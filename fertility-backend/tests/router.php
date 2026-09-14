<?php
// Used only when explicitly launched by the CLI test runner. Never route this on production.
if (PHP_SAPI !== 'cli-server' || getenv('APP_ENV') !== 'test' || !getenv('CLINIC_TEST_SMTP_PORT')) { http_response_code(404); exit; }
require_once __DIR__ . '/../lib/mailer.php';
$mailer = ClinicMailer::client();
$mailer->Port = (int) getenv('CLINIC_TEST_SMTP_PORT');
$mailer->SMTPOptions = ['ssl' => ['cafile' => getenv('CLINIC_TEST_CA'), 'peer_name' => 'localhost', 'verify_peer' => true, 'verify_peer_name' => true]];
require __DIR__ . '/../router.php';
