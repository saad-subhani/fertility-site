<?php
function appointmentError(array $booking): ?string
{
    if (empty($booking['appointment_assigned_at'])) return 'Save and confirm the appointment details before sending confirmation.';
    if (trim($booking['consultant'] ?? '') === '') return 'Assign a consultant before sending confirmation.';
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $booking['date'] ?? '');
    if (!$date || $date->format('Y-m-d') !== $booking['date']) return 'Assign a valid consultation date.';
    if (!preg_match('/^(?:(?:0?[1-9]|1[0-2]):[0-5][0-9] (?:AM|PM)|(?:[01][0-9]|2[0-3]):[0-5][0-9])$/', $booking['time'] ?? '')) return 'Assign a valid consultation time (HH:MM or HH:MM AM/PM).';
    if (trim($booking['consultation_type'] ?? '') === '') return 'Assign a consultation type.';
    if (($booking['appointment_mode'] ?? '') === 'online') {
        if (!filter_var($booking['meeting_url'] ?? '', FILTER_VALIDATE_URL) || parse_url($booking['meeting_url'], PHP_URL_SCHEME) !== 'https') return 'Enter a valid HTTPS meeting link.';
    } elseif (($booking['appointment_mode'] ?? '') === 'clinic') {
        if (trim($booking['clinic_address'] ?? '') === '') return 'Enter the clinic address.';
    } else return 'Choose online or clinic for the appointment.';
    return null;
}
