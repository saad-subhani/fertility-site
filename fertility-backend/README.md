# Fertility Clinic by AJ backend

PHP 8.2+, MySQL/MariaDB, PHPMailer and bcrypt admin authentication.

See [SMTP implementation and Hostinger deployment](SMTP_IMPLEMENTATION.md) for configuration, database setup, exact commands, testing and the complete file inventory.

Secrets belong only in the ignored backend .env. The local .env has been configured; copy it privately to your server and replace the local database settings with your Hostinger database details. Never commit it.

Fresh database: select the database in phpMyAdmin and import database.sql. Existing database: run php scripts/migrate.php; do not replace your existing records. Then run php scripts/init-admin.php.

The frontend uses localhost:8000 in development and /fertility-backend in production unless NEXT_PUBLIC_API_URL is set before building. PHP must run separately from the Next.js Node process.
