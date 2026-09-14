<?php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/../config/database.php';
$cfg = require __DIR__ . '/../config/env.php';
$db = getDB();
if (!$db->query("SELECT GET_LOCK('clinic_admin_init', 10)")->fetchColumn()) throw new RuntimeException('Initialization busy');
try {
    if ($db->query('SELECT id FROM admins LIMIT 1')->fetchColumn()) {
        echo "Admin already exists; no account changed or created.\n";
    } else {
        $db->prepare('INSERT INTO admins (id, username, password_hash, email) VALUES (1, ?, ?, ?)')->execute([
            $cfg['admin_username'], password_hash($cfg['admin_password'], PASSWORD_BCRYPT, ['cost' => 12]), $cfg['admin_email'],
        ]);
        echo "Admin initialized with bcrypt hash.\n";
    }
} finally { $db->query("SELECT RELEASE_LOCK('clinic_admin_init')"); }
