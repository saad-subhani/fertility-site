<?php
/**
 * List all bookings with optional filter + search
 * GET ?status=pending|paid|paid_at_clinic|all
 *     &search=keyword
 *     &page=1&limit=50
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

$status = strtolower(trim($_GET['status'] ?? 'all'));
$search = trim($_GET['search'] ?? '');
$page   = max(1, (int) ($_GET['page'] ?? 1));
$limit  = min(100, max(1, (int) ($_GET['limit'] ?? 50)));
$offset = ($page - 1) * $limit;

$where  = [];
$params = [];

// Status filter
$validStatuses = ['pending', 'paid', 'paid_at_clinic'];
if (in_array($status, $validStatuses, true)) {
    $where[]         = 'status = :status';
    $params[':status'] = $status;
}

// Search (name, email, phone, consultant)
if ($search !== '') {
    $where[] = '(name LIKE :q1 OR email LIKE :q2 OR phone LIKE :q3 OR consultant LIKE :q4)';
    foreach ([':q1', ':q2', ':q3', ':q4'] as $key) $params[$key] = '%' . $search . '%';
}

$whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

try {
    $db = getDB();

    // Total count
    $countStmt = $db->prepare("SELECT COUNT(*) FROM bookings $whereSql");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    // Data
    $sql = "
        SELECT
            id, name, email, phone, consultant, date, time,
            consultation_type, payment_method, payment_screenshot,
            status, is_paid, created_at
        FROM bookings
        $whereSql
        ORDER BY created_at DESC
        LIMIT $limit OFFSET $offset
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    // Counts for filter badges
    $counts = $db->query("
        SELECT
            COUNT(*) AS total,
            SUM(status = 'pending') AS pending,
            SUM(status = 'paid') AS paid,
            SUM(status = 'paid_at_clinic') AS paid_at_clinic
        FROM bookings
    ")->fetch();

    echo json_encode([
        'success' => true,
        'data'    => $rows,
        'meta'    => [
            'total'  => $total,
            'page'   => $page,
            'limit'  => $limit,
            'counts' => [
                'all'            => (int) $counts['total'],
                'pending'        => (int) $counts['pending'],
                'paid'           => (int) $counts['paid'],
                'paid_at_clinic' => (int) $counts['paid_at_clinic'],
            ],
        ],
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load bookings',
    ]);
}
