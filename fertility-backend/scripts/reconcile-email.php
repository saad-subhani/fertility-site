<?php
// Explicit operator reconciliation only, after checking SMTP provider records.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/email-service.php';
$id = filter_var($argv[1] ?? '', FILTER_VALIDATE_INT);
$kind = $argv[2] ?? '';
$outcome = $argv[3] ?? '';
if (!$id || !isset(EmailService::COLUMNS[$kind]) || !in_array($outcome, ['accepted','not-accepted'], true)) {
    fwrite(STDERR, "Usage: php scripts/reconcile-email.php BOOKING_ID EMAIL_KIND accepted|not-accepted\n"); exit(1);
}
$db = getDB();
$lock = $db->prepare('SELECT GET_LOCK(?, 0)'); $lock->execute([bookingLockName($id)]);
if (!$lock->fetchColumn()) throw new RuntimeException('Booking busy');
try {
    $db->beginTransaction();
    $q = $db->prepare("UPDATE email_deliveries SET status=?, sent_at=IF(?='sent',NOW(),NULL), failure_reason=NULL WHERE booking_id=? AND kind=? AND status IN ('sending','review_required')");
    $state = $outcome === 'accepted' ? 'sent' : 'failed';
    $q->execute([$state, $state, $id, $kind]);
    if ($q->rowCount() && $state === 'sent') {
        $column = EmailService::COLUMNS[$kind];
        $db->prepare("UPDATE bookings SET $column=NOW() WHERE id=?")->execute([$id]);
    }
    $db->commit();
    echo "Reconciled. Use Resend Email in the dashboard to process remaining emails.\n";
} finally { $db->prepare('SELECT RELEASE_LOCK(?)')->execute([bookingLockName($id)]); }
