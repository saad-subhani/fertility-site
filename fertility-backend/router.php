<?php
/**
 * Simple router for PHP built-in server
 * Usage: php -S localhost:8000 router.php
 */

require_once __DIR__ . '/lib/bootstrap.php';
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Serve uploaded files
if (preg_match('~^/uploads/payments/pay_[a-zA-Z0-9_]+\.(jpg|png|webp|gif)$~D', $uri)) {
    $file = __DIR__ . $uri;
    if (is_file($file)) {
        $mime = mime_content_type($file) ?: 'application/octet-stream';
        header('Content-Type: ' . $mime);
        header('Access-Control-Allow-Origin: *');
        readfile($file);
        return true;
    }
    http_response_code(404);
    echo 'File not found';
    return true;
}

// Map API routes
$map = [
    '/api/admin/appointment.php' => __DIR__ . '/api/admin/appointment.php',
    '/api/admin/resend-email.php' => __DIR__ . '/api/admin/resend-email.php',
    '/api/book.php'                    => __DIR__ . '/api/book.php',
    '/api/admin/login.php'             => __DIR__ . '/api/admin/login.php',
    '/api/admin/bookings.php'          => __DIR__ . '/api/admin/bookings.php',
    '/api/admin/booking-detail.php'    => __DIR__ . '/api/admin/booking-detail.php',
    '/api/admin/update-status.php'     => __DIR__ . '/api/admin/update-status.php',
];

if (isset($map[$uri])) {
    require $map[$uri];
    return true;
}

// Fallback 404
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
return true;
