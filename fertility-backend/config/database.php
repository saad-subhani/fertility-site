<?php
/**
 * PDO Database Connection
 */

function getDB(): PDO
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $cfg = require __DIR__ . '/env.php';

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $cfg['db_host'],
        $cfg['db_name'],
        $cfg['db_charset']
    );

    try {
        $pdo = new PDO($dsn, $cfg['db_user'], $cfg['db_pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed. Check config/env.php and run the SQL first.',
            'error'   => $e->getMessage(),
        ]);
        exit;
    }

    return $pdo;
}
