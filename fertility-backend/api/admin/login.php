<?php
/**
 * Admin Login – returns JWT
 * POST JSON { username, password }
 */

require_once __DIR__ . '/../../lib/cors.php';
require_once __DIR__ . '/../../lib/jwt.php';

require_once __DIR__ . '/../../config/database.php';
enableCORS();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$cfg  = require __DIR__ . '/../../config/env.php';
$body = json_decode(file_get_contents('php://input'), true) ?? [];
if (!is_array($body) || !is_string($body['username'] ?? '') || !is_string($body['password'] ?? '') || strlen($body['password'] ?? '') > 72) {
    http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid credentials.']); exit;
}

$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username and password required']);
    exit;
}

$stmt = getDB()->prepare('SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1');
$stmt->execute([$username]);
$admin = $stmt->fetch();
if (!$admin || !password_verify($password, $admin['password_hash'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    exit;
}

$token = createJWT(
    [
        'role'     => 'admin',
        'sub'      => (int) $admin['id'],
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
