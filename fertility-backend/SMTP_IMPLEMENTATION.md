# SMTP implementation and Hostinger deployment

## Current setup

The backend `.env` is at `fertility-backend/.env`. The supplied mailbox password has been stored there with quotes so its `#` characters are preserved. It is not printed here, committed, or exposed through an API. A cryptographically random 64-byte JWT signing secret and 24-byte admin password were generated and saved there. Read `ADMIN_PASSWORD` directly in that local file to log in; the username is `admin`.

The existing local database was migrated, and the admin was initialized with a bcrypt hash (cost 12). Existing bookings and payment data were retained. Subsequent initialization skips any existing admin rather than creating a duplicate or changing their credentials. Editing `ADMIN_PASSWORD` after initialization does not automatically reset an existing database account.

Hostinger SMTP TLS connection and authentication were successfully verified with the configured mailbox. No real email was sent by that diagnostic. The automated workflow uses synthetic records in a separate temporary database and a local TLS SMTP server; it sends nothing to actual patients.

## Required production configuration

The domain's MX records point to Hostinger Email. The current settings use `smtp.hostinger.com`, port `465`, and `SMTP_SECURE=true`, matching [Hostinger's configuration guide](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/). Port `587` requires `SMTP_SECURE=false`; the mailer then **requires STARTTLS**, not unencrypted SMTP. Certificate validation remains enabled.

Before going live, update these values in the backend `.env` using hPanel:

| Setting | Required value |
| --- | --- |
| `DB_HOST` | The database host shown in hPanel |
| `DB_NAME` | The full Hostinger database name, including its account prefix |
| `DB_USER` | The assigned Hostinger database user |
| `DB_PASSWORD` | That database user's password, quoted if it contains special characters |
| `APP_ENV` | `production` (already set) |
| `FRONTEND_ORIGIN` | `https://fertilityclinicbyaj.online` (already set; change if the canonical site uses `www`) |
| `ADMIN_DASHBOARD_URL` | `https://fertilityclinicbyaj.online/admin` (already set) |
| `APP_TIMEZONE` | `Asia/Karachi`; appointment times are interpreted in this zone |

The `.env` still contains **local** MySQL connection details until you enter hPanel's values. Localhost as a database hostname can be valid on hosting; the host must match hPanel rather than being guessed. No Hostinger database access or deployment credentials were provided, so the live database and deployment have not been modified.

The production frontend defaults to the same-origin `/fertility-backend` path. Serve the PHP backend at that path, or set the frontend's public `NEXT_PUBLIC_API_URL` to its actual HTTPS base URL **before building**. For example, if you provision `https://api.fertilityclinicbyaj.online`, use that URL without a trailing `/api`. This is a public address, not a secret. Never put SMTP, admin or JWT secrets in the frontend environment.

The Next.js app requires a Node-capable deployment because it contains a dynamic admin booking route. Uploading TypeScript files to PHP-only hosting is not sufficient. Run Next.js using an appropriate Node service and configure the PHP path through the web server, or host PHP on a subdomain and configure `NEXT_PUBLIC_API_URL` accordingly. Hosting account access is needed to perform this routing/deployment.

## Database setup

`database.sql` now contains the complete fresh-install schema: `bookings`, `admins`, `email_deliveries` and `schema_migrations`. It intentionally has no `CREATE DATABASE` or `USE` statement, allowing import into the account-prefixed database selected in Hostinger phpMyAdmin. It inserts no default password or fake patient data.

For an **existing** database, back up first, then run `php scripts/migrate.php`. Migration `001_email_workflow.sql` adds appointment assignment/mode/location, first-verification tracking, the three sent timestamps, email status/reason and the admin/delivery tables. It retains previous records and does not email historical paid bookings. The runner checks each column and tracks completion, so rerunning or resuming a partially applied migration is safe. Do not import the raw migration twice manually.

For a **fresh** database, select it in phpMyAdmin and import `database.sql`, then run the migration runner and admin initialization. `CREATE TABLE IF NOT EXISTS` does not upgrade old tables; use the migration runner for those.

## Email workflow and security

1. Both consultation forms POST to the existing booking API. It validates and saves the complete booking plus a unique pending admin-notification record in a transaction. After committing, the service immediately attempts the admin notification. A mail failure cannot roll back the saved booking.
2. The admin detail screen allows staff to confirm the actual consultant, date, time, consultation type and online meeting URL or clinic address. Confirmation is blocked until those details are saved and valid. Existing patient-selected details are displayed for review; no consultant, schedule or location is invented by the email service.
3. First payment verification (`paid`, or the API alias `verified`) saves payment and queues the welcome and appointment-confirmation messages. Both go to the exact stored consultation email, including its case and plus tags. Missing appointment details produce a clear admin validation message while leaving payment saved; the welcome can still be delivered. Saving valid details later releases the confirmation.
4. Responsive branded HTML and plain text include only the requested booking/contact details, with HTML escaping and no medical claims. SMTP errors are never copied to templates or frontend responses.

JWT tokens use HS256, expire after one hour, and are checked against the actual admin table. Payment updates, appointment assignment, booking access and resends require an authenticated admin. Admin passwords are only hashed in the database. Tokens generated with the old signing secret no longer authenticate.

The bootstrap validates required settings and rejects placeholder admin/JWT credentials. API exceptions are generic; logs contain fixed error categories and record IDs rather than SMTP transcripts, credentials, message bodies or patient details. The reusable PHPMailer instance keeps its SMTP connection for multiple messages within the PHP request. Separate PHP requests naturally have separate instances.

`.env` and `vendor` are ignored by Git; `.env.example` contains placeholders only. Apache/LiteSpeed `.htaccess` and the development router allowlist public API/upload paths and block configuration, dotfiles, scripts, migrations, tests and dependencies. Retain `.htaccess`, disable directory listing, and do not use PHP's bare development server without `router.php`. If using nginx, configure equivalent allowlisted API/upload locations and a deny-by-default backend location; nginx does not read `.htaccess`. Keep server filesystem permissions restricted to the hosting account.

## Duplicate prevention and retries

`email_deliveries` has a unique `(booking_id, kind)` key and a stable Message-ID. A database-scoped MySQL advisory lock serializes deliveries and admin mutations for each booking. Accepted messages are skipped permanently; repeated status updates, clicks and concurrent requests do not recreate deliveries.

Timestamps are written only after the SMTP server accepts the message, atomically with the `sent` delivery record. This means provider acceptance, not a guarantee of inbox placement or reading; bounces and spam filtering remain provider-side concerns.

Open a booking in the admin dashboard and click **Resend Email** to retry pending/failed messages. Already sent messages are skipped, and patient messages require current paid status. Authentication/connection failures and explicit SMTP rejection remain retryable. The booking-level status is `failed` when delivery fails, with only a safe description exposed.

SMTP cannot guarantee exactly-once delivery across a disconnect after DATA acceptance or a process crash. These cases use `review_required` (or a durable `sending` claim recovered as review-required). Automatic retry is blocked. After an operator checks the provider's records, reconcile from the private backend CLI:

```bash
php scripts/reconcile-email.php BOOKING_ID admin_notification accepted
php scripts/reconcile-email.php BOOKING_ID payment_verified not-accepted
php scripts/reconcile-email.php BOOKING_ID consultation_confirmation not-accepted
```

Choose `accepted` only with provider evidence, or `not-accepted` to enable a safe dashboard retry. The command itself does not send email. Sent confirmations also block silent appointment edits; contact the patient to arrange later changes.

## Exact commands

### Current Windows/XAMPP workspace

Run from `D:\Internship\fertility-site`. Keep XAMPP MySQL running. Dependencies were installed locally; the first command is useful after a fresh checkout. It uses the downloaded, checksum-verified Composer PHAR.

```powershell
cd D:\Internship\fertility-site\fertility-backend
C:/xampp/php/php.exe -d extension=zip composer.phar install --no-interaction --prefer-dist
C:/xampp/php/php.exe scripts/migrate.php
C:/xampp/php/php.exe scripts/init-admin.php
C:/xampp/php/php.exe scripts/smtp-check.php
C:/xampp/php/php.exe tests/workflow.php
C:/xampp/php/php.exe -S localhost:8000 router.php
```

In a separate terminal:

```powershell
cd D:\Internship\fertility-site
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

The workflow test requires Node, MySQL and OpenSSL. It generates its own temporary test TLS certificate and randomly named `clinic_email_test_*` database, then drops only that database. It never changes `.env` or clinic records. Override `TEST_DB_HOST`, `TEST_DB_USER`, `TEST_DB_PASSWORD`, or `TEST_OPENSSL` in the test process environment when needed. The test database user must be able to create and drop test databases; do not run this suite against a restricted production account.

### Hostinger SSH / production

After uploading the backend, including `vendor` or installing it using Composer, privately uploading `.env`, entering the hosting database credentials, importing the fresh schema when needed, and configuring the PHP route:

```bash
cd /actual/path/to/fertility-backend
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
php scripts/migrate.php
php scripts/init-admin.php
php scripts/smtp-check.php
```

If SSH/Composer is unavailable on the hosting plan, prepare `vendor` locally with the locked Composer dependencies and upload it privately; database import can use phpMyAdmin. Admin initialization still requires a private CLI execution path; no public setup or SMTP-test endpoint has been added.

Build the frontend in its own directory using the actual provisioned PHP URL:

```bash
npm ci
NEXT_PUBLIC_API_URL=/fertility-backend npm run build
npm run start
```

After deployment, these read-only smoke checks should return 403/404 for private files and 401 for unauthenticated mutations. Adjust the backend URL if you chose a subdomain:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://fertilityclinicbyaj.online/fertility-backend/.env
curl -s -o /dev/null -w '%{http_code}\n' https://fertilityclinicbyaj.online/fertility-backend/scripts/smtp-check.php
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://fertilityclinicbyaj.online/fertility-backend/api/admin/update-status.php
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://fertilityclinicbyaj.online/fertility-backend/api/admin/resend-email.php
```

For final live acceptance: submit a controlled booking using an inbox you own, check the admin notification, log in with the `.env` admin password, save actual appointment details, verify payment and check both patient messages. Repeated resends must not duplicate them. This live sending test has not been performed because no real test appointment was supplied. The automated tests cover that flow with a local SMTP fixture.

Verify the mailbox sender permissions and domain SPF/DKIM/DMARC configuration in hPanel, and ensure outbound port 465 is allowed. Mailbox authentication from this machine already succeeded; repeat `smtp-check.php` on the hosting server to verify its network/TLS environment.

## File inventory

Created (paths relative to repository root):

- `.env.example`, `lib/api.ts`
- `fertility-backend/.env` (private and ignored), `.env.example`, `composer.json`, `composer.lock`, `SMTP_IMPLEMENTATION.md`
- `fertility-backend/api/admin/appointment.php`, `resend-email.php`
- `fertility-backend/lib/bootstrap.php`, `mailer.php`, `email-template.php`, `email-service.php`, `appointment.php`, `booking-admin.php`, `admin-mutation.php`
- `fertility-backend/migrations/001_email_workflow.sql`
- `fertility-backend/scripts/migrate.php`, `init-admin.php`, `smtp-check.php`, `reconcile-email.php`
- `fertility-backend/tests/workflow.php`, `router.php`, `smtp-server.mjs`

Modified:

- `.gitignore`, `eslint.config.mjs`
- `app/admin/page.tsx`, `layout.tsx`, `admin.module.css`, `login/page.tsx`, `bookings/[id]/page.tsx`
- `components/booking/BookingForm.tsx`, `components/home/Contact.tsx`
- `fertility-backend/.htaccess`, `router.php`, `database.sql`, `README.md`
- `fertility-backend/config/env.php`, `database.php`
- `fertility-backend/lib/cors.php`, `jwt.php`
- `fertility-backend/api/book.php`, `api/admin/login.php`, `bookings.php`, `booking-detail.php`, `update-status.php`

Local generated artifacts include ignored Composer tooling/dependencies, Next.js build output, and ignored synthetic test runtime files. These are not application secrets to publish or source files to commit. No deployment or Git push was performed.
