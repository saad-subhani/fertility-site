<?php
// Never log exception text, request bodies, configuration or SMTP transcripts.
ini_set('display_errors', '0');
ini_set('zend.exception_ignore_args', '1');
set_exception_handler(function (Throwable $error): void {
    error_log('clinic: unhandled_backend_error');
    if (PHP_SAPI === 'cli') {
        fwrite(STDERR, "Backend unavailable. Check configuration, dependencies and migrations.\n");
        exit(1);
    }
    http_response_code(503);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Backend unavailable. Contact the administrator.']);
});
require_once __DIR__ . '/../vendor/autoload.php';

function clinicConfig(): array
{
    static $config;
    if ($config !== null) return $config;
    Dotenv\Dotenv::createImmutable(dirname(__DIR__))->safeLoad();
    $get = static fn(string $key, string $default = ''): string => (string) (getenv($key) !== false ? getenv($key) : ($_ENV[$key] ?? $_SERVER[$key] ?? $default));
    foreach (['DB_HOST','DB_NAME','DB_USER','ADMIN_USERNAME','ADMIN_PASSWORD','ADMIN_EMAIL','JWT_SECRET',
        'SMTP_HOST','SMTP_PORT','SMTP_SECURE','SMTP_USER','SMTP_PASSWORD','SMTP_FROM_EMAIL','SMTP_FROM_NAME','ADMIN_NOTIFICATION_EMAIL'] as $key) {
        if ($get($key) === '') throw new RuntimeException('Missing configuration');
    }
    if (strlen($get('JWT_SECRET')) < 32 || str_starts_with($get('JWT_SECRET'), 'REPLACE_') || strlen($get('ADMIN_PASSWORD')) < 12 || strlen($get('ADMIN_PASSWORD')) > 72 ||
        $get('ADMIN_PASSWORD') === 'SET_A_STRONG_ADMIN_PASSWORD') throw new RuntimeException('Invalid authentication configuration');
    foreach (['ADMIN_EMAIL','SMTP_USER','SMTP_FROM_EMAIL','ADMIN_NOTIFICATION_EMAIL'] as $key) {
        if (!filter_var($get($key), FILTER_VALIDATE_EMAIL)) throw new RuntimeException('Invalid email configuration');
    }
    if (!in_array($get('SMTP_SECURE'), ['true','false'], true) ||
        !in_array($get('SMTP_PORT'), ['465','587'], true) ||
        ($get('SMTP_PORT') === '465') !== ($get('SMTP_SECURE') === 'true')) throw new RuntimeException('Invalid SMTP transport');
    if ($get('APP_ENV', 'production') === 'production' &&
        ($get('SMTP_PASSWORD') === 'PASTE_SMTP_PASSWORD_HERE' || $get('SMTP_HOST') === 'YOUR_EMAIL_PROVIDER_SMTP_HOST')) throw new RuntimeException('SMTP not configured');
    $url = $get('ADMIN_DASHBOARD_URL');
    if ($url !== '' && (!filter_var($url, FILTER_VALIDATE_URL) || !in_array(parse_url($url, PHP_URL_SCHEME), ['https','http'], true))) throw new RuntimeException('Invalid dashboard URL');
    date_default_timezone_set($get('APP_TIMEZONE', 'Asia/Karachi'));
    return $config = [
        'db_host' => $get('DB_HOST'), 'db_name' => $get('DB_NAME'), 'db_user' => $get('DB_USER'),
        'db_pass' => $get('DB_PASSWORD'), 'db_charset' => 'utf8mb4',
        'admin_username' => $get('ADMIN_USERNAME'), 'admin_password' => $get('ADMIN_PASSWORD'), 'admin_email' => $get('ADMIN_EMAIL'),
        'jwt_secret' => $get('JWT_SECRET'), 'jwt_expire' => 3600,
        'smtp_host' => $get('SMTP_HOST'), 'smtp_port' => (int) $get('SMTP_PORT'), 'smtp_secure' => $get('SMTP_SECURE') === 'true',
        'smtp_user' => $get('SMTP_USER'), 'smtp_password' => $get('SMTP_PASSWORD'),
        'from_email' => $get('SMTP_FROM_EMAIL'), 'from_name' => $get('SMTP_FROM_NAME'),
        'admin_notification_email' => $get('ADMIN_NOTIFICATION_EMAIL'), 'dashboard_url' => $url,
        'timezone' => date_default_timezone_get(), 'app_env' => $get('APP_ENV', 'production'),
        'frontend_origin' => $get('FRONTEND_ORIGIN', 'http://localhost:3000'),
        'upload_dir' => dirname(__DIR__) . '/uploads/payments/', 'upload_url' => '/uploads/payments/',
    ];
}
