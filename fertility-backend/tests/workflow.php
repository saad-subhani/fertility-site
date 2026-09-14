<?php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
// Creates and drops ONLY a randomly named clinic_email_test_* database; never uses clinic records.
$root = dirname(__DIR__);
$runtime = __DIR__ . '/.runtime/' . bin2hex(random_bytes(6));
mkdir($runtime, 0700, true);
$dbName = 'clinic_email_test_' . bin2hex(random_bytes(6));
$env = [
    'APP_ENV'=>'test', 'APP_TIMEZONE'=>'Asia/Karachi', 'DB_HOST'=>getenv('TEST_DB_HOST') ?: '127.0.0.1',
    'DB_NAME'=>$dbName, 'DB_USER'=>getenv('TEST_DB_USER') ?: 'root', 'DB_PASSWORD'=>getenv('TEST_DB_PASSWORD') ?: '',
    'ADMIN_USERNAME'=>'test-admin', 'ADMIN_PASSWORD'=>bin2hex(random_bytes(20)), 'ADMIN_EMAIL'=>'admin@example.test',
    'JWT_SECRET'=>bin2hex(random_bytes(32)), 'SMTP_HOST'=>'127.0.0.1', 'SMTP_PORT'=>'465', 'SMTP_SECURE'=>'true',
    'SMTP_USER'=>'sender@example.test', 'SMTP_PASSWORD'=>bin2hex(random_bytes(16)),
    'SMTP_FROM_EMAIL'=>'sender@example.test', 'SMTP_FROM_NAME'=>'Fertility Clinic by AJ',
    'ADMIN_NOTIFICATION_EMAIL'=>'admin@example.test', 'ADMIN_DASHBOARD_URL'=>'http://localhost:3000/admin',
];
foreach ($env as $key=>$value) { $_ENV[$key]=$value; putenv("$key=$value"); }
require_once $root . '/lib/booking-admin.php';
require_once $root . '/config/database.php';
$processes = []; $db = null; $server = null; $checks = 0; $testFailed = false;
function check(bool $ok, string $label): void { global $checks; if (!$ok) throw new RuntimeException($label); $checks++; echo "PASS $label\n"; }
function run(array $args): void {
    global $root;
    $p = proc_open($args, [0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']], $pipes, $root);
    fclose($pipes[0]); $out = stream_get_contents($pipes[1]); $err = stream_get_contents($pipes[2]);
    fclose($pipes[1]); fclose($pipes[2]);
    if (proc_close($p) !== 0) throw new RuntimeException('Child command failed: ' . basename($args[0]));
}
function request(string $path, ?array $data = null, ?string $token = null, bool $form = false): array {
    global $base;
    $headers = ['Content-Type: ' . ($form ? 'application/x-www-form-urlencoded' : 'application/json')];
    if ($token) $headers[] = 'Authorization: Bearer ' . $token;
    $context = stream_context_create(['http'=>['method'=>$data === null ? 'GET' : 'POST','header'=>implode("\r\n",$headers),
        'content'=>$data === null ? '' : ($form ? http_build_query($data) : json_encode($data)), 'ignore_errors'=>true, 'timeout'=>60]]);
    $raw = file_get_contents($base . $path, false, $context);
    preg_match('/\s(\d{3})\s/', $http_response_header[0], $match);
    return [(int) $match[1], json_decode($raw, true), $raw];
}
function messageCount(): int { global $runtime; return is_file($runtime . '/messages.jsonl') ? count(file($runtime . '/messages.jsonl')) : 0; }
try {
    $server = new PDO('mysql:host=' . $env['DB_HOST'], $env['DB_USER'], $env['DB_PASSWORD'], [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
    $server->exec("CREATE DATABASE `$dbName` CHARACTER SET utf8mb4");
    $db = getDB();
    $schema = file_get_contents($root . '/database.sql');
    $db->exec(substr($schema, strpos($schema, 'CREATE TABLE IF NOT EXISTS bookings')));
    $db->exec("INSERT INTO bookings(name,email,phone,consultant,date,time,consultation_type,payment_method,status,is_paid) VALUES ('Historical test','old@example.test','000','Historical consultant','2027-01-01','10:00 AM','Clinic','Bank Transfer','paid',1)");
    run([PHP_BINARY, 'scripts/migrate.php']); run([PHP_BINARY, 'scripts/migrate.php']);
    check((int)$db->query('SELECT is_paid FROM bookings WHERE id=1')->fetchColumn()===1 && $db->query('SELECT payment_verified_at FROM bookings WHERE id=1')->fetchColumn()!==null && (int)$db->query('SELECT COUNT(*) FROM email_deliveries')->fetchColumn()===0, 'migration preserves historical payment without sending retrospective emails');
    run([PHP_BINARY, 'scripts/init-admin.php']); run([PHP_BINARY, 'scripts/init-admin.php']);
    check((int)$db->query('SELECT COUNT(*) FROM admins')->fetchColumn() === 1, 'migration and admin initialization are repeatable');
    $hash = $db->query('SELECT password_hash FROM admins')->fetchColumn();
    check(password_verify($env['ADMIN_PASSWORD'], $hash) && str_starts_with($hash, '$2y$'), 'admin password stored as bcrypt');
    $openssl = getenv('TEST_OPENSSL') ?: (PHP_OS_FAMILY === 'Windows' ? 'C:/xampp/apache/bin/openssl.exe' : 'openssl');
    // Test-only certificate. Production TLS validation is never weakened.
    file_put_contents($runtime . '/openssl.cnf', "[req]\ndistinguished_name=dn\nx509_extensions=ext\nprompt=no\n[dn]\nCN=localhost\n[ext]\nsubjectAltName=DNS:localhost\nbasicConstraints=critical,CA:TRUE\n");
    run([$openssl,'req','-x509','-newkey','rsa:2048','-nodes','-keyout',$runtime.'/key.pem','-out',$runtime.'/cert.pem','-days','1','-config',$runtime.'/openssl.cnf']);
    file_put_contents($runtime . '/mode', 'accept');
    $smtp = proc_open(['node',__DIR__.'/smtp-server.mjs',$runtime], [0=>['pipe','r'],1=>['pipe','w'],2=>['file',$runtime.'/smtp.log','a']], $pipes);
    $processes[]=$smtp; $smtpPort=(int)trim(fgets($pipes[1]));
    check($smtpPort > 0, 'local TLS SMTP fixture started');
    putenv('CLINIC_TEST_SMTP_PORT='.$smtpPort); putenv('CLINIC_TEST_CA='.$runtime.'/cert.pem');
    $mailer=ClinicMailer::client(); $mailer->Port=$smtpPort;
    $mailer->SMTPOptions=['ssl'=>['cafile'=>$runtime.'/cert.pem','peer_name'=>'localhost','verify_peer'=>true,'verify_peer_name'=>true]];
    ClinicMailer::verify(); $mailer->smtpClose();
    check(messageCount() === 0, 'SMTP TLS/authentication verified before workflow; no email sent');
    $listener=stream_socket_server('tcp://127.0.0.1:0'); $address=stream_socket_get_name($listener,false); fclose($listener);
    $base='http://'.$address;
    $http=proc_open([PHP_BINARY,'-S',$address,'tests/router.php'], [0=>['pipe','r'],1=>['file',$runtime.'/http.log','a'],2=>['file',$runtime.'/http.log','a']], $httpPipes, $root);
    $processes[]=$http;
    for($i=0;$i<50;$i++){ $sock=@stream_socket_client('tcp://'.$address,$errno,$errstr,0.1); if($sock){fclose($sock);break;} usleep(100000); }
    foreach (['update-status','appointment','resend-email'] as $endpoint) {
        [$status]=request('/api/admin/'.$endpoint.'.php',['id'=>1,'status'=>'paid']); check($status===401, "$endpoint requires admin authentication");
    }
    foreach (['/.env','/config/env.php','/vendor/autoload.php','/scripts/smtp-check.php','/tests/router.php','/uploads/../.env'] as $path) {
        [$status,, $raw]=request($path); check($status===404 && !str_contains($raw,$env['SMTP_PASSWORD']), 'private route blocked: '.$path);
    }
    [$status,$login]=request('/api/admin/login.php',['username'=>$env['ADMIN_USERNAME'],'password'=>$env['ADMIN_PASSWORD']]);
    check($status===200 && isset($login['token']), 'admin can log in using initialized hash'); $token=$login['token'];
    $form=['name'=>'Test <Patient>','email'=>'Exact.Patient+tag@example.test','phone'=>'000000000','consultant'=>'Test Consultant',
        'date'=>'2027-04-12','time'=>'10:00 AM','consultationType'=>'Online Consultation','paymentMethod'=>'Pay at Clinic'];
    [$status,$booking]=request('/api/book.php',$form,null,true); $id=$booking['data']['id'] ?? 0;
    check($status===200 && $id>0 && messageCount()===1, 'consultation persists and sends one admin notification');
    $row=$db->query('SELECT * FROM bookings WHERE id='.(int)$id)->fetch();
    check($row['email']===$form['email'] && $row['admin_notification_sent_at']!==null, 'exact patient email and accepted timestamp retained');
    [$status,$result]=request('/api/admin/update-status.php',['id'=>$id,'status'=>'verified'],$token);
    check($status===200 && !empty($result['validation_error']) && messageCount()===2, 'payment saved and welcome sent; missing assignment blocks confirmation');
    check((int)$db->query('SELECT is_paid FROM bookings WHERE id='.$id)->fetchColumn()===1, 'validation does not undo payment');
    $appointment=['id'=>$id,'consultant'=>'Assigned Test Consultant','date'=>'2027-04-13','time'=>'14:30','consultation_type'=>'Online Consultation','appointment_mode'=>'online','meeting_url'=>'https://example.test/meeting','clinic_address'=>''];
    [$status]=request('/api/admin/appointment.php',$appointment,$token);
    check($status===200 && messageCount()===3, 'admin assignment releases confirmation with real saved values');
    foreach(['paid','pending','paid'] as $state) request('/api/admin/update-status.php',['id'=>$id,'status'=>$state],$token);
    request('/api/admin/resend-email.php',['id'=>$id],$token); request('/api/admin/resend-email.php',['id'=>$id],$token);
    check(messageCount()===3, 'repeated status updates and resends do not duplicate accepted messages');
    $messages=array_map(fn($line)=>json_decode($line,true),file($runtime.'/messages.jsonl'));
    check(str_contains($messages[1]['recipient'],$form['email']) && str_contains($messages[2]['recipient'],$form['email']), 'both patient emails use the exact consultation address');
    $confirmation=quoted_printable_decode($messages[2]['body']);
    check(str_contains($confirmation,'Assigned Test Consultant') && str_contains($confirmation,'2027-04-13') && str_contains($confirmation,'14:30') && str_contains($confirmation,'https://example.test/meeting') && str_contains($confirmation,'text/plain') && str_contains($confirmation,'text/html'), 'confirmation has assigned details and HTML/plain-text alternatives');
    file_put_contents($runtime.'/mode','reject');
    [$status,$failed]=request('/api/book.php',$form,null,true); $failedId=$failed['data']['id'];
    check($status===200 && $db->query('SELECT email_delivery_status FROM bookings WHERE id='.$failedId)->fetchColumn()==='failed', 'SMTP rejection preserves booking and records failure');
    check($db->query('SELECT admin_notification_sent_at FROM bookings WHERE id='.$failedId)->fetchColumn()===null, 'rejected email has no sent timestamp');
    file_put_contents($runtime.'/mode','accept'); request('/api/admin/resend-email.php',['id'=>$failedId],$token);
    check(messageCount()===4, 'admin retry sends previously rejected email');
    request('/api/admin/appointment.php',[...$appointment,'id'=>$failedId],$token);
    file_put_contents($runtime.'/mode','reject');
    [$status]=request('/api/admin/update-status.php',['id'=>$failedId,'status'=>'paid'],$token);
    check($status===200 && (int)$db->query('SELECT is_paid FROM bookings WHERE id='.$failedId)->fetchColumn()===1 && messageCount()===4, 'SMTP failure preserves verified payment');
    file_put_contents($runtime.'/mode','accept'); request('/api/admin/resend-email.php',['id'=>$failedId],$token);
    check(messageCount()===6, 'retry delivers both failed patient emails once');
    file_put_contents($runtime.'/mode','disconnect');
    [, $uncertain]=request('/api/book.php',$form,null,true); $uncertainId=$uncertain['data']['id'];
    file_put_contents($runtime.'/mode','accept'); request('/api/admin/resend-email.php',['id'=>$uncertainId],$token);
    check(messageCount()===7 && $db->query('SELECT status FROM email_deliveries WHERE booking_id='.$uncertainId)->fetchColumn()==='review_required', 'ambiguous SMTP acceptance is held for review, never blindly resent');
    $other=new PDO('mysql:host='.$env['DB_HOST'].';dbname='.$dbName,$env['DB_USER'],$env['DB_PASSWORD']);
    $lockName = bookingLockName($id);
    $other->query("SELECT GET_LOCK('$lockName',0)");
    $result=(new EmailService($db,clinicConfig()))->deliver($id);
    check($result['status']==='pending' && messageCount()===7, 'concurrent operation lock prevents duplicate send');
    $other->query("SELECT RELEASE_LOCK('$lockName')");
    file_put_contents($runtime.'/mode','auth-reject');
    [$status,$authFailed]=request('/api/book.php',$form,null,true); $authId=$authFailed['data']['id'];
    check($status===200 && $db->query('SELECT status FROM email_deliveries WHERE booking_id='.$authId)->fetchColumn()==='failed' && messageCount()===7, 'SMTP authentication failure preserves booking and is retryable');
    file_put_contents($runtime.'/mode','accept');
    $db->exec("UPDATE bookings SET email='invalid-address' WHERE id=$authId");
    request('/api/admin/appointment.php',[...$appointment,'id'=>$authId],$token);
    [$status]=request('/api/admin/update-status.php',['id'=>$authId,'status'=>'paid'],$token);
    check($status===200 && (int)$db->query("SELECT COUNT(*) FROM email_deliveries WHERE booking_id=$authId AND kind!='admin_notification' AND status='failed'")->fetchColumn()===2, 'invalid patient email blocks delivery without undoing payment');
    [, $detail] = request('/api/admin/booking-detail.php?id='.$authId, null, $token);
    check(!str_contains(json_encode($detail), $env['SMTP_PASSWORD']) && !str_contains(json_encode($detail), $env['ADMIN_PASSWORD']), 'admin response contains no credentials');
    [$status] = request('/api/admin/bookings.php?search=Test', null, $token);
    check($status===200, 'admin search works with native prepared statements');
    echo "All $checks checks passed. No external email sent.\n";
} catch (Throwable $e) { fwrite(STDERR,'FAIL: '.$e->getMessage()."\n"); $testFailed=true; }
finally {
    foreach(array_reverse($processes) as $process) { proc_terminate($process); proc_close($process); }
    if ($server && preg_match('/^clinic_email_test_[a-f0-9]{12}$/D',$dbName)) $server->exec("DROP DATABASE IF EXISTS `$dbName`");
}
exit($testFailed ? 1 : 0);
