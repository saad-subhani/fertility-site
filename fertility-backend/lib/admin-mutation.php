<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/booking-admin.php';

function adminMutation(string $action): void
{
    enableCORS();
    requireAdminAuth();
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success'=>false,'message'=>'Method not allowed']); return; }
    $body = json_decode(file_get_contents('php://input'), true);
    if (!is_array($body) || !filter_var($body['id'] ?? null, FILTER_VALIDATE_INT, ['options'=>['min_range'=>1]])) {
        http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid booking ID.']); return;
    }
    $id = (int) $body['id']; $db = getDB();
    try {
        $result = ['message' => 'Email retry processed.'];
        if ($action === 'resend') {
            $check = $db->prepare('SELECT id FROM bookings WHERE id=?'); $check->execute([$id]);
            if (!$check->fetchColumn()) throw new DomainException('Booking not found.');
        } else $result = changeBooking($db, $id, $body, $action === 'appointment');
        $email = deliverBookingEmails($db, $id);
        echo json_encode(['success'=>true, ...$result, 'email'=>$email]);
    } catch (DomainException $e) {
        http_response_code(422); echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
    } catch (Throwable $e) {
        error_log('clinic: booking_update_failed');
        http_response_code(500); echo json_encode(['success'=>false,'message'=>'Could not update booking.']);
    }
}
