<?php
/**
 * Update booking status (mark as paid / pending / paid_at_clinic)
 * POST JSON { id, status }
 */

require_once __DIR__ . '/../../lib/cors.php';
require_once __DIR__ . '/../../lib/jwt.php';
require_once __DIR__ . '/../../config/database.php';

enableCORS();
requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$body   = json_decode(file_get_contents('php://input'), true) ?? [];
$id     = (int) ($body['id'] ?? 0);
$status = strtolower(trim($body['status'] ?? ''));

$valid = ['pending', 'paid', 'paid_at_clinic'];

if ($id <= 0 || !in_array($status, $valid, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid id or status']);
    exit;
}

$isPaid = ($status === 'paid') ? 1 : 0;

try {
    $db   = getDB();
    $stmt = $db->prepare("
        UPDATE bookings
        SET status = :status, is_paid = :is_paid, updated_at = NOW()
        WHERE id = :id
    ");
    $stmt->execute([
        ':status'  => $status,
        ':is_paid' => $isPaid,
        ':id'      => $id,
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Booking not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Status updated',
        'data'    => ['id' => $id, 'status' => $status, 'is_paid' => $isPaid],
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to update status',
        'error'   => $e->getMessage(),
    ]);
}
