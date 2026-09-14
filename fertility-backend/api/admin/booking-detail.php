<?php
/**
 * Single booking detail
 * GET ?id=123
 */

require_once __DIR__ . '/../../lib/cors.php';
require_once __DIR__ . '/../../lib/jwt.php';
require_once __DIR__ . '/../../config/database.php';

enableCORS();
requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$id = (int) ($_GET['id'] ?? 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid booking ID']);
    exit;
}

try {
    $db   = getDB();
    $stmt = $db->prepare("
        SELECT
            id, name, email, phone, consultant, date, time,
            consultation_type, payment_method, payment_screenshot,
            status, is_paid, created_at, updated_at
        FROM bookings
        WHERE id = :id
        LIMIT 1
    ");
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch();

    if (!$row) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Booking not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'data'    => $row,
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load booking',
        'error'   => $e->getMessage(),
    ]);
}
