<?php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/../config/database.php';
$db = getDB();
$db->exec('CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(100) PRIMARY KEY, applied_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
if (!$db->query("SELECT GET_LOCK('clinic_schema_migration', 10)")->fetchColumn()) throw new RuntimeException('Migration busy');
try {
    foreach (glob(__DIR__ . '/../migrations/*.sql') as $file) {
        $version = basename($file);
        $check = $db->prepare('SELECT version FROM schema_migrations WHERE version = ?');
        $check->execute([$version]);
        if ($check->fetchColumn()) continue;
        // MySQL DDL commits implicitly. Resume safely if an earlier run was interrupted.
        $sql = file_get_contents($file);
        if (preg_match('/ALTER TABLE bookings\s+ADD COLUMN\s+/s', $sql) && preg_match('/ALTER TABLE bookings\s+(.*?);/s', $sql, $match)) {
            foreach (preg_split('/,\s*(?=ADD COLUMN)/', trim($match[1])) as $definition) {
                if (!preg_match('/^ADD COLUMN ([a-z_]+)\s/', $definition, $column)) throw new RuntimeException('Invalid migration');
                $exists = $db->prepare('SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=\'bookings\' AND COLUMN_NAME=?');
                $exists->execute([$column[1]]);
                if (!$exists->fetchColumn()) $db->exec('ALTER TABLE bookings ' . $definition);
            }
            $sql = str_replace($match[0], '', $sql);
        }
        $db->exec($sql);
        $db->prepare('INSERT INTO schema_migrations (version) VALUES (?)')->execute([$version]);
        echo "Applied $version\n";
    }
} finally { $db->query("SELECT RELEASE_LOCK('clinic_schema_migration')"); }
