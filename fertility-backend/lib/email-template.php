<?php
function emailTemplate(string $kind, array $b, array $cfg): array
{
    $details = ['Booking reference' => (string) $b['id']];
    if ($kind === 'admin_notification') {
        $subject = 'New Consultation Request — ' . preg_replace('/[\r\n]+/', ' ', $b['name']);
        $greeting = 'Hello Clinic Team,';
        $intro = 'A new consultation request has been saved. Please review the booking and payment in the admin dashboard.';
        $details += ['Patient name' => $b['name'], 'Email' => $b['email'], 'Phone' => $b['phone'],
            'Consultation type' => $b['consultation_type'], 'Preferred date' => $b['date'], 'Preferred time' => $b['time'],
            'Submitted at' => $b['created_at'], 'Payment status' => $b['status']];
        if ($cfg['dashboard_url'] !== '') $details['Admin dashboard'] = rtrim($cfg['dashboard_url'], '/') . '/bookings/' . $b['id'];
    } elseif ($kind === 'payment_verified') {
        $subject = 'Payment Verified — Welcome to Fertility Clinic by AJ';
        $greeting = 'Hello ' . $b['name'] . ',';
        $intro = 'Welcome to Fertility Clinic by AJ. Your payment has been verified. Your appointment details will be provided in a separate confirmation email once assigned by our team.';
        $details['Payment status'] = 'Verified';
    } else {
        $subject = 'Consultation Confirmed — ' . $b['date'] . ' at ' . $b['time'];
        $greeting = 'Hello ' . $b['name'] . ',';
        $intro = 'Your consultation is confirmed. Please find your appointment details below. Contact us if you need assistance or wish to request a change.';
        $details += ['Consultant' => $b['consultant'], 'Consultation date' => $b['date'], 'Consultation time' => $b['time'],
            'Time zone' => $cfg['timezone'], 'Consultation type' => $b['consultation_type']];
        $details[$b['appointment_mode'] === 'online' ? 'Online meeting link' : 'Clinic address'] =
            $b['appointment_mode'] === 'online' ? $b['meeting_url'] : $b['clinic_address'];
    }
    $details['Support email'] = $cfg['from_email'];
    $escape = static fn($v) => htmlspecialchars((string) $v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $rows = ''; $text = "$greeting\n\n$intro\n\n";
    foreach ($details as $label => $value) {
        $rows .= '<tr><td style="padding:10px;border-bottom:1px solid #eee;word-break:break-word"><strong>' . $escape($label) . '</strong><br>' . nl2br($escape($value)) . '</td></tr>';
        $text .= "$label: $value\n";
    }
    $html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#faf6f2;font-family:Arial,sans-serif;color:#38291f"><table role="presentation" width="100%"><tr><td align="center" style="padding:16px"><table role="presentation" width="100%" style="max-width:600px;background:white;border-radius:12px"><tr><td style="padding:24px;background:#6b4734;color:white;font-size:22px">Fertility Clinic by AJ</td></tr><tr><td style="padding:24px"><p>' . $escape($greeting) . '</p><p style="line-height:1.6">' . $escape($intro) . '</p><table role="presentation" width="100%">' . $rows . '</table><p>Kind regards,<br>Fertility Clinic by AJ</p></td></tr></table></td></tr></table></body></html>';
    return ['subject' => $subject, 'html' => $html, 'text' => $text . "\nKind regards,\nFertility Clinic by AJ"];
}
