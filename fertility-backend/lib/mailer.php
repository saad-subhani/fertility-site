<?php
use PHPMailer\PHPMailer\PHPMailer;
require_once __DIR__ . '/bootstrap.php';

final class ClinicMailer
{
    private static ?PHPMailer $client = null;
    public static function client(): PHPMailer
    {
        if (self::$client) return self::$client;
        $c = clinicConfig();
        if ($c['smtp_password'] === 'PASTE_SMTP_PASSWORD_HERE' || $c['smtp_host'] === 'YOUR_EMAIL_PROVIDER_SMTP_HOST') throw new RuntimeException('SMTP not configured');
        $m = new PHPMailer(true);
        $m->isSMTP();
        $m->Host = $c['smtp_host'];
        $m->Port = $c['smtp_port'];
        $m->SMTPAuth = true;
        $m->Username = $c['smtp_user'];
        $m->Password = $c['smtp_password'];
        $m->SMTPSecure = $c['smtp_secure'] ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $m->SMTPDebug = 0;
        $m->Timeout = 10;
        $m->Timelimit = 15;
        $m->SMTPKeepAlive = true;
        $m->CharSet = 'UTF-8';
        $m->setFrom($c['from_email'], $c['from_name']);
        $m->addReplyTo($c['from_email'], $c['from_name']);
        register_shutdown_function(static function () use ($m) { $m->smtpClose(); });
        return self::$client = $m;
    }
    public static function verify(): void
    {
        if (!self::client()->smtpConnect()) throw new RuntimeException('SMTP connection failed');
    }
    public static function send(string $recipient, array $template, string $messageId): void
    {
        $m = self::client();
        $m->clearAddresses();
        $m->addAddress($recipient);
        $m->MessageID = $messageId;
        $m->Subject = $template['subject'];
        $m->isHTML(true);
        $m->Body = $template['html'];
        $m->AltBody = $template['text'];
        if (!$m->send()) throw new RuntimeException('SMTP delivery failed');
    }
}
