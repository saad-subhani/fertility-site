<?php
// CLI only; no public diagnostic endpoint or message sending.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/../lib/mailer.php';
try {
    ClinicMailer::verify();
    echo "SMTP TLS connection and authentication successful. No email sent.\n";
} catch (Throwable $e) {
    fwrite(STDERR, "SMTP check failed. Check backend environment, provider credentials, TLS and outbound network access.\n");
    exit(1);
}
