<?php
/**
 * Public endpoint – submit consultation booking
 * POST multipart/form-data
 */

require_once __DIR__ . '/../lib/cors.php';
require_once __DIR__ . '/../config/database.php';

require_once __DIR__ . '/../lib/email-service.php';
enableCORS();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$cfg = require __DIR__ . '/../config/env.php';
foreach (['name','email','phone','consultant','date','time','consultationType','paymentMethod'] as $field) {
    if (isset($_POST[$field]) && !is_string($_POST[$field])) {
        http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid form field.']); exit;
    }
}

// ---------- Collect fields ----------
$name             = trim($_POST['name'] ?? '');
$email            = trim($_POST['email'] ?? '');
$phone            = trim($_POST['phone'] ?? '');
$consultant       = trim($_POST['consultant'] ?? '');
$date             = trim($_POST['date'] ?? '');
$time             = trim($_POST['time'] ?? '');
$consultationType = trim($_POST['consultationType'] ?? '');
$paymentMethod    = trim($_POST['paymentMethod'] ?? '');

// ---------- Validation ----------
$errors = [];
foreach (['name'=>150,'email'=>180,'phone'=>40,'consultant'=>120,'date'=>10,'time'=>20,'consultationType'=>120,'paymentMethod'=>60] as $field => $limit) {
    if (!is_string($_POST[$field] ?? null) || strlen($_POST[$field]) > $limit) $errors[] = 'Invalid field: ' . $field;
}
$parsedDate = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
if (!$parsedDate || $parsedDate->format('Y-m-d') !== $date) $errors[] = 'Valid date is required';
if (!preg_match('/^(?:(?:0?[1-9]|1[0-2]):[0-5][0-9] (?:AM|PM)|(?:[01][0-9]|2[0-3]):[0-5][0-9])$/', $time)) $errors[] = 'Valid time is required';

if ($name === '')             $errors[] = 'Name is required';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required';
if ($phone === '')            $errors[] = 'Phone is required';
if ($consultant === '')       $errors[] = 'Consultant is required';
if ($date === '')             $errors[] = 'Date is required';
if ($time === '')             $errors[] = 'Time is required';
if ($consultationType === '') $errors[] = 'Consultation type is required';
if ($paymentMethod === '')    $errors[] = 'Payment method is required';

$isPayAtClinic = (strcasecmp($paymentMethod, 'Pay at Clinic') === 0);

if (!$isPayAtClinic && empty($_FILES['paymentScreenshot']['name'])) {
    $errors[] = 'Payment screenshot is required for online payment';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode('. ', $errors)]);
    exit;
}

// ---------- Handle file upload ----------
$screenshotFilename = null;

if (!$isPayAtClinic && !empty($_FILES['paymentScreenshot']['name'])) {
    $file = $_FILES['paymentScreenshot'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'File upload error']);
        exit;
    }

    if ($file['size'] > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Screenshot must be under 5MB']);
        exit;
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime  = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array($mime, $allowed, true)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Only JPG, PNG, WEBP, GIF allowed']);
        exit;
    }

    $ext = match ($mime) {
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif',
        default      => 'jpg',
    };

    $screenshotFilename = 'pay_' . time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $dest = $cfg['upload_dir'] . $screenshotFilename;

    if (!is_dir($cfg['upload_dir'])) {
        mkdir($cfg['upload_dir'], 0755, true);
    }

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to save screenshot']);
        exit;
    }
}

// ---------- Status ----------
// pending  = online payment, waiting verification
// paid     = verified / confirmed paid
// paid_at_clinic = chose Pay at Clinic
$status = $isPayAtClinic ? 'paid_at_clinic' : 'pending';
$isPaid = $isPayAtClinic ? 0 : 0;   // both start unpaid until admin marks paid

// ---------- Insert ----------
try {
    $db = getDB();
    $db->beginTransaction();

    $stmt = $db->prepare("
        INSERT INTO bookings
            (name, email, phone, consultant, date, time, consultation_type,
             payment_method, payment_screenshot, status, is_paid, created_at)
        VALUES
            (:name, :email, :phone, :consultant, :date, :time, :ctype,
             :pmethod, :screenshot, :status, :is_paid, NOW())
    ");

    $stmt->execute([
        ':name'       => $name,
        ':email'      => $email,
        ':phone'      => $phone,
        ':consultant' => $consultant,
        ':date'       => $date,
        ':time'       => $time,
        ':ctype'      => $consultationType,
        ':pmethod'    => $paymentMethod,
        ':screenshot' => $screenshotFilename,
        ':status'     => $status,
        ':is_paid'    => $isPaid,
    ]);

    $id = (int) $db->lastInsertId();
    (new EmailService($db, $cfg))->queue($id, ['admin_notification']);
    $db->commit();
    deliverBookingEmails($db, $id);

    echo json_encode([
        'success' => true,
        'message' => 'Booking submitted successfully',
        'data'    => ['id' => $id],
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) $db->rollBack();
    error_log('clinic: booking_save_failed');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Could not save booking',
    ]);
}
