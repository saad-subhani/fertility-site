<?php
/**
 * Admin Login – returns JWT
 * POST JSON { username, password }
 */

require_once __DIR__ . '/../../lib/cors.php';
require_once __DIR__ . '/../../lib/jwt.php';

enableCORS();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$cfg  = require __DIR__ . '/../../config/env.php';
$body = json_decode(file_get_contents('php://input'), true) ?? [];

$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username and password required']);
    exit;
}

if (
    $username !== $cfg['admin_username'] ||
    !hash_equals($cfg['admin_password'], $password)
) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    exit;
}

$token = createJWT(
    [
        'role'     => 'admin',
        'username' => $username,
    ],
    $cfg['jwt_secret'],
    $cfg['jwt_expire']
);

echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'token'   => $token,
]);
