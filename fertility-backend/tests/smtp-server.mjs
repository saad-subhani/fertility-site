// Local TLS SMTP fixture: synthetic test messages only, no external delivery.
import tls from 'node:tls';
import fs from 'node:fs';
import path from 'node:path';
const dir = process.argv[2];
const server = tls.createServer({ key: fs.readFileSync(path.join(dir, 'key.pem')), cert: fs.readFileSync(path.join(dir, 'cert.pem')) }, socket => {
  socket.setEncoding('utf8');
  socket.write('220 localhost test SMTP\r\n');
  let buffer = '', data = false, body = '', recipient = '', auth = 0;
  socket.on('error', () => {});
  socket.on('data', chunk => {
    buffer += chunk;
    while (buffer.includes('\r\n')) {
      const end = buffer.indexOf('\r\n');
      const line = buffer.slice(0, end); buffer = buffer.slice(end + 2);
      if (data) {
        if (line === '.') {
          data = false;
          const mode = fs.readFileSync(path.join(dir, 'mode'), 'utf8').trim();
          if (mode === 'reject') socket.write('550 Message rejected by test fixture\r\n');
          else {
            fs.appendFileSync(path.join(dir, 'messages.jsonl'), JSON.stringify({ recipient, body }) + '\n');
            if (mode === 'disconnect') socket.destroy();
            else socket.write('250 Message accepted\r\n');
          }
          body = '';
        } else body += line + '\r\n';
      } else if (auth) {
        if (auth === 1) { auth = 2; socket.write('334 UGFzc3dvcmQ6\r\n'); }
        else { auth = 0; socket.write('235 Authentication successful\r\n'); }
      } else if (/^EHLO/.test(line)) socket.write('250-localhost\r\n250-AUTH LOGIN\r\n250 SIZE 1000000\r\n');
      else if (/^AUTH LOGIN/.test(line)) {
        if (fs.readFileSync(path.join(dir, 'mode'), 'utf8').trim() === 'auth-reject') socket.write('535 Authentication rejected\r\n');
        else { auth = 1; socket.write('334 VXNlcm5hbWU6\r\n'); }
      }
      else if (/^MAIL FROM/.test(line)) socket.write('250 Sender OK\r\n');
      else if (/^RCPT TO/.test(line)) { recipient = line.slice(8); socket.write('250 Recipient OK\r\n'); }
      else if (line === 'DATA') { data = true; socket.write('354 End with dot\r\n'); }
      else if (line === 'QUIT') { socket.end('221 Bye\r\n'); }
      else socket.write('250 OK\r\n');
    }
  });
});
server.listen(0, '127.0.0.1', () => process.stdout.write(String(server.address().port) + '\n'));
