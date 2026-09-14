<?php
/**
 * Environment / Config
 * Admin password & JWT secret stored here (like .env)
 */

return [
    // Database
    'db_host'     => '127.0.0.1',
    'db_name'     => 'fertility_clinic',
    'db_user'     => 'root',
    'db_pass'     => '',          // change if your MySQL has password
    'db_charset'  => 'utf8mb4',

    // Admin credentials (change these!)
    'admin_username' => 'admin',
    'admin_password' => 'Admin@12345',   // change in production

    // JWT
    'jwt_secret'  => 'FertilityClinic_JWT_Secret_Key_Change_This_In_Production_2026',
    'jwt_expire'  => 86400 * 7,   // 7 days

    // Uploads
    'upload_dir'  => __DIR__ . '/../uploads/payments/',
    'upload_url'  => '/uploads/payments/',
];
