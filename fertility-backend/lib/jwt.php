<?php
/**
 * Simple JWT (HS256) – no external library needed
 */

function base64UrlEncode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/'));
}

function createJWT(array $payload, string $secret, int $expireSeconds = 604800): string
{
    $header = ['typ' => 'JWT', 'alg' => 'HS256'];

    $payload['iat'] = time();
    $payload['exp'] = time() + $expireSeconds;

    $segments = [
        base64UrlEncode(json_encode($header)),
        base64UrlEncode(json_encode($payload)),
    ];

    $signature = hash_hmac('sha256', implode('.', $segments), $secret, true);
    $segments[] = base64UrlEncode($signature);

    return implode('.', $segments);
}

function verifyJWT(string $token, string $secret): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    [$headerB64, $payloadB64, $sigB64] = $parts;
    $header = json_decode(base64UrlDecode($headerB64), true);
    if (!is_array($header) || ($header['alg'] ?? '') !== 'HS256' || ($header['typ'] ?? '') !== 'JWT') return null;

    $expected = base64UrlEncode(
        hash_hmac('sha256', "$headerB64.$payloadB64", $secret, true)
    );

    if (!hash_equals($expected, $sigB64)) {
        return null;
    }

    $payload = json_decode(base64UrlDecode($payloadB64), true);

    if (!is_array($payload) || !is_int($payload['exp'] ?? null) || $payload['exp'] <= time()) {
        return null;
    }

    return $payload;
}

/**
 * Get Bearer token from Authorization header
 */
function getBearerToken(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';

    // Apache sometimes needs this
    if (empty($header) && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header  = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
        return $m[1];
    }

    return null;
}

/**
 * Require valid admin JWT or exit with 401
 */
function requireAdminAuth(): array
{
    $cfg   = require __DIR__ . '/../config/env.php';
    $token = getBearerToken();

    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized – no token']);
        exit;
    }

    $payload = verifyJWT($token, $cfg['jwt_secret']);

    if (!$payload || ($payload['role'] ?? '') !== 'admin' || empty($payload['sub'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized – invalid or expired token']);
        exit;
    }

    require_once __DIR__ . '/../config/database.php';
    $stmt = getDB()->prepare('SELECT id FROM admins WHERE id=? AND username=?');
    $stmt->execute([$payload['sub'], $payload['username'] ?? '']);
    if (!$stmt->fetchColumn()) {
        http_response_code(401);
        echo json_encode(['success'=>false,'message'=>'Unauthorized']);
        exit;
    }
    return $payload;
}
