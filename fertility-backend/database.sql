-- ============================================================
-- Fertility Clinic by AJ – Database Setup
-- Fresh database: select your database in phpMyAdmin, then import this file.
-- Hostinger: create/select the hPanel database first (its name may be prefixed).
-- Existing database: preserve records and run php scripts/migrate.php instead.
-- After importing, run php scripts/migrate.php and php scripts/init-admin.php.
-- ============================================================

-- No CREATE DATABASE or USE statement: imports target the database you selected.

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name                 VARCHAR(150)  NOT NULL,
  email                VARCHAR(180)  NOT NULL,
  phone                VARCHAR(40)   NOT NULL,
  consultant           VARCHAR(120)  NOT NULL,
  date                 DATE          NOT NULL,
  time                 VARCHAR(20)   NOT NULL,
  consultation_type    VARCHAR(120)  NOT NULL,
  payment_method       VARCHAR(60)   NOT NULL,
  payment_screenshot   VARCHAR(255)  DEFAULT NULL,
  status               ENUM('pending', 'paid') NOT NULL DEFAULT 'pending',
  is_paid              TINYINT(1)    NOT NULL DEFAULT 0,
  created_at           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME      DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  appointment_assigned_at DATETIME NULL,
  appointment_mode     ENUM('online','clinic') NULL,
  meeting_url          VARCHAR(2048) NULL,
  clinic_address       VARCHAR(1000) NULL,
  payment_verified_at  DATETIME NULL,
  admin_notification_sent_at DATETIME NULL,
  payment_verified_email_sent_at DATETIME NULL,
  consultation_confirmation_sent_at DATETIME NULL,
  email_delivery_status VARCHAR(24) NOT NULL DEFAULT 'pending',
  email_failure_reason VARCHAR(255) NULL,

  INDEX idx_status (status),
  INDEX idx_created (created_at),
  INDEX idx_email (email),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- No default credentials or sample patients. CLI initialization hashes .env credentials.
CREATE TABLE IF NOT EXISTS admins (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  username VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(180) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(100) PRIMARY KEY,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
