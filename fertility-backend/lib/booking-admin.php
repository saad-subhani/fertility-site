<?php
require_once __DIR__ . '/email-service.php';

function changeBooking(PDO $db, int $id, array $body, bool $appointmentOnly = false): array
{
    $lock = $db->prepare('SELECT GET_LOCK(?, 0)');
    $lock->execute([bookingLockName($id)]);
    if (!$lock->fetchColumn()) throw new DomainException('Another operation is in progress. Please retry.');
    try {
        $db->beginTransaction();
        $stmt = $db->prepare('SELECT * FROM bookings WHERE id = ? FOR UPDATE');
        $stmt->execute([$id]); $b = $stmt->fetch();
        if (!$b) throw new DomainException('Booking not found.');
        if ($appointmentOnly) {
            if ($b['consultation_confirmation_sent_at']) throw new DomainException('Confirmation already sent. Contact the patient before arranging changes.');
            $check = $db->prepare("SELECT COUNT(*) FROM email_deliveries WHERE booking_id = ? AND kind = 'consultation_confirmation' AND status IN ('sending','review_required')");
            $check->execute([$id]);
            if ($check->fetchColumn()) throw new DomainException('Resolve the uncertain email delivery before changing appointment details.');
            $fields = ['consultant' => 120, 'date' => 10, 'time' => 20, 'consultation_type' => 120, 'appointment_mode' => 10, 'meeting_url' => 2048, 'clinic_address' => 1000];
            foreach ($fields as $field => $limit) {
                if (!is_string($body[$field] ?? null) || strlen($body[$field]) > $limit) throw new DomainException('Invalid appointment field: ' . $field);
                $b[$field] = trim($body[$field]);
            }
            $b['appointment_assigned_at'] = date('Y-m-d H:i:s');
            if ($error = appointmentError($b)) throw new DomainException($error);
            $db->prepare('UPDATE bookings SET consultant=?, date=?, time=?, consultation_type=?, appointment_mode=?, meeting_url=?, clinic_address=?, appointment_assigned_at=NOW() WHERE id=?')
                ->execute([$b['consultant'], $b['date'], $b['time'], $b['consultation_type'], $b['appointment_mode'], $b['meeting_url'], $b['clinic_address'], $id]);
        } else {
            $status = $body['status'] ?? '';
            if ($status === 'verified') $status = 'paid';
            if (!in_array($status, ['pending','paid'], true)) throw new DomainException('Invalid payment status.');
            $db->prepare("UPDATE bookings SET status=?, is_paid=?, payment_verified_at=IF(? = 'paid', COALESCE(payment_verified_at, NOW()), payment_verified_at) WHERE id=?")
                ->execute([$status, $status === 'paid' ? 1 : 0, $status, $id]);
            // INSERT IGNORE preserves sent deliveries while repairing missing or failed queues.
            if ($status === 'paid') {
                (new EmailService($db, clinicConfig()))->queue($id, ['payment_verified','consultation_confirmation']);
            }
        }
        $db->commit();
        return ['message' => $appointmentOnly ? 'Appointment saved.' : 'Payment status saved.',
            'validation_error' => (!$appointmentOnly && ($body['status'] ?? '') !== 'pending' && in_array($body['status'] ?? '', ['paid','verified'], true)) ? appointmentError($b) : null];
    } catch (Throwable $e) {
        if ($db->inTransaction()) $db->rollBack();
        throw $e;
    } finally { $db->prepare('SELECT RELEASE_LOCK(?)')->execute([bookingLockName($id)]); }
}
