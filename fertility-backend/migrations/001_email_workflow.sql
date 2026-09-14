-- Additive migration. Existing bookings/payment records are retained.
ALTER TABLE bookings
 ADD COLUMN appointment_assigned_at DATETIME NULL,
 ADD COLUMN appointment_mode ENUM('online','clinic') NULL,
 ADD COLUMN meeting_url VARCHAR(2048) NULL,
 ADD COLUMN clinic_address VARCHAR(1000) NULL,
 ADD COLUMN payment_verified_at DATETIME NULL,
 ADD COLUMN admin_notification_sent_at DATETIME NULL,
 ADD COLUMN payment_verified_email_sent_at DATETIME NULL,
 ADD COLUMN consultation_confirmation_sent_at DATETIME NULL,
 ADD COLUMN email_delivery_status VARCHAR(24) NOT NULL DEFAULT 'pending',
 ADD COLUMN email_failure_reason VARCHAR(255) NULL;

-- Historical paid bookings must not be treated as a new first verification.
UPDATE bookings SET payment_verified_at = COALESCE(updated_at, created_at) WHERE is_paid = 1;

CREATE TABLE IF NOT EXISTS admins (
 id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
 username VARCHAR(150) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 email VARCHAR(180) NOT NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS email_deliveries (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 booking_id INT UNSIGNED NOT NULL,
 kind ENUM('admin_notification','payment_verified','consultation_confirmation') NOT NULL,
 status ENUM('pending','sending','sent','failed','review_required') NOT NULL DEFAULT 'pending',
 attempts INT UNSIGNED NOT NULL DEFAULT 0,
 message_id VARCHAR(255) NOT NULL,
 failure_reason VARCHAR(255) NULL,
 sent_at DATETIME NULL,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY booking_email (booking_id, kind),
 FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;
