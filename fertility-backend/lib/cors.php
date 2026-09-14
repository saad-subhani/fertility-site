<?php
/**
 * CORS headers – allow frontend (Next.js) to call this API
 */

function enableCORS(): void
{
    require_once __DIR__ . '/bootstrap.php';
    $cfg = clinicConfig();
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

    // Allow localhost and common Next.js ports
    $allowed = [
        $cfg['frontend_origin'],
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001',
    ];

    if (in_array($origin, $allowed, true)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    header('Vary: Origin');

    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    header('Content-Type: application/json; charset=utf-8');

    // Preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
