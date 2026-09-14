<?php
require_once __DIR__ . '/mailer.php';
require_once __DIR__ . '/email-template.php';
require_once __DIR__ . '/appointment.php';

function bookingLockName(int $id): string
{
    return 'clinic_' . substr(hash('sha256', clinicConfig()['db_name']), 0, 16) . '_booking_' . $id;
}

final class EmailService
{
    public const COLUMNS = [
        'admin_notification' => 'admin_notification_sent_at',
        'payment_verified' => 'payment_verified_email_sent_at',
        'consultation_confirmation' => 'consultation_confirmation_sent_at',
    ];
    public function __construct(private PDO $db, private array $cfg, private $sender = null, private $verify = null) {}

    public function queue(int $id, array $kinds): void
    {
        foreach ($kinds as $kind) {
            if (!isset(self::COLUMNS[$kind])) throw new InvalidArgumentException('Invalid email type');
            $domain = substr(strrchr($this->cfg['from_email'], '@'), 1);
            $this->db->prepare('INSERT IGNORE INTO email_deliveries (booking_id, kind, message_id) VALUES (?, ?, ?)')
                ->execute([$id, $kind, '<' . bin2hex(random_bytes(16)) . '@' . $domain . '>']);
        }
    }

    public function deliver(int $id): array
    {
        // Shared with appointment/payment mutations: serialize all operations for this booking.
        $lock = $this->db->prepare('SELECT GET_LOCK(?, 0)');
        $lock->execute([bookingLockName($id)]);
        if (!$lock->fetchColumn()) return ['status' => 'pending', 'message' => 'Another operation is in progress.'];
        try {
            $stmt = $this->db->prepare('SELECT * FROM bookings WHERE id = ?');
            $stmt->execute([$id]);
            $b = $stmt->fetch();
            if (!$b) throw new RuntimeException('Booking missing');
            // A previous worker died after claiming the message. Never blindly retry an uncertain delivery.
            $this->db->prepare("UPDATE email_deliveries SET status = 'review_required', failure_reason = 'Delivery outcome unknown; check provider records before retrying.' WHERE booking_id = ? AND status = 'sending'")->execute([$id]);
            $stmt = $this->db->prepare('SELECT * FROM email_deliveries WHERE booking_id = ? ORDER BY id');
            $stmt->execute([$id]);
            foreach ($stmt->fetchAll() as $delivery) {
                if (!in_array($delivery['status'], ['pending','failed'], true)) continue;
                $kind = $delivery['kind'];
                if ($kind !== 'admin_notification' && !$b['is_paid']) continue;
                $recipient = $kind === 'admin_notification' ? $this->cfg['admin_notification_email'] : $b['email'];
                $validation = !filter_var($recipient, FILTER_VALIDATE_EMAIL) ? 'The booking email address is invalid.' : null;
                if (!$validation && $kind === 'consultation_confirmation') $validation = appointmentError($b);
                if ($validation) {
                    $this->failure($delivery['id'], 'failed', $validation);
                    continue;
                }
                // Connection/auth failures happen before message submission and are safe to retry.
                try {
                    if ($this->verify) ($this->verify)(); else ClinicMailer::verify();
                } catch (Throwable $e) {
                    $this->failure($delivery['id'], 'failed', 'Email connection unavailable. Check server configuration and retry.');
                    continue;
                }
                $this->db->prepare("UPDATE email_deliveries SET status = 'sending', attempts = attempts + 1, failure_reason = NULL WHERE id = ?")->execute([$delivery['id']]);
                try {
                    $template = emailTemplate($kind, $b, $this->cfg);
                    if ($this->sender) ($this->sender)($recipient, $template, $delivery['message_id']);
                    else ClinicMailer::send($recipient, $template, $delivery['message_id']);
                } catch (Throwable $e) {
                    // SMTP may have accepted DATA before a timeout. Operator must reconcile with provider.
                    $code = $this->sender ? 0 : (int) (ClinicMailer::client()->getSMTPInstance()->getError()['smtp_code'] ?? 0);
                    $rejected = $code >= 400 && $code <= 599;
                    $this->failure($delivery['id'], $rejected ? 'failed' : 'review_required', $rejected
                        ? 'Mail server rejected the email. Check recipient or provider configuration and retry.'
                        : 'Delivery outcome unknown; check provider records before retrying.');
                    continue;
                }
                // Only after SMTP accepted the message. Both tracking records change atomically.
                $this->db->beginTransaction();
                try {
                    $this->db->prepare("UPDATE email_deliveries SET status = 'sent', sent_at = NOW(), failure_reason = NULL WHERE id = ?")->execute([$delivery['id']]);
                    $column = self::COLUMNS[$kind];
                    $this->db->prepare("UPDATE bookings SET $column = NOW() WHERE id = ?")->execute([$id]);
                    $this->db->commit();
                } catch (Throwable $e) {
                    if ($this->db->inTransaction()) $this->db->rollBack();
                    throw $e; // Durable 'sending' claim blocks duplicate submission after DB failure.
                }
            }
            return $this->summarize($id);
        } finally {
            $this->db->prepare('SELECT RELEASE_LOCK(?)')->execute([bookingLockName($id)]);
        }
    }
    private function failure(int $deliveryId, string $state, string $reason): void
    {
        $this->db->prepare('UPDATE email_deliveries SET status = ?, failure_reason = ? WHERE id = ?')->execute([$state, $reason, $deliveryId]);
        error_log('clinic: email_failure delivery_id=' . $deliveryId . ' category=' . $state);
    }
    private function summarize(int $id): array
    {
        $stmt = $this->db->prepare('SELECT status, failure_reason FROM email_deliveries WHERE booking_id = ?');
        $stmt->execute([$id]);
        $status = 'sent'; $reason = null;
        foreach ($stmt->fetchAll() as $row) {
            if (in_array($row['status'], ['failed','review_required','sending'], true)) { $status = 'failed'; $reason = $row['failure_reason']; }
            elseif ($row['status'] === 'pending' && $status !== 'failed') $status = 'pending';
        }
        $this->db->prepare('UPDATE bookings SET email_delivery_status = ?, email_failure_reason = ? WHERE id = ?')->execute([$status, $reason, $id]);
        return ['status' => $status, 'message' => $reason ?? ($status === 'sent' ? 'All eligible emails accepted by the mail server.' : 'Emails are pending.')];
    }
}

function deliverBookingEmails(PDO $db, int $id): array
{
    try { return (new EmailService($db, clinicConfig()))->deliver($id); }
    catch (Throwable $e) {
        error_log('clinic: email_workflow_failed booking_id=' . $id);
        // Booking/payment has already committed. No transport exception can undo it.
        try { $db->prepare("UPDATE bookings SET email_delivery_status = 'failed', email_failure_reason = 'Email processing failed. Retry from the dashboard.' WHERE id = ?")->execute([$id]); } catch (Throwable $ignored) {}
        return ['status' => 'failed', 'message' => 'Email processing failed. Retry from the dashboard.'];
    }
}
