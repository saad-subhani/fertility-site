-- ============================================================
-- Fertility Clinic by AJ – Database Setup
-- Run this once in phpMyAdmin / MySQL CLI / any SQL tool
-- ============================================================

CREATE DATABASE IF NOT EXISTS fertility_clinic
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fertility_clinic;

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
  status               ENUM('pending', 'paid', 'paid_at_clinic') NOT NULL DEFAULT 'pending',
  is_paid              TINYINT(1)    NOT NULL DEFAULT 0,
  created_at           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME      DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_created (created_at),
  INDEX idx_email (email),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: sample data for testing (remove in production)
-- INSERT INTO bookings (name, email, phone, consultant, date, time, consultation_type, payment_method, status, is_paid)
-- VALUES
-- ('Ali Khan', 'ali@example.com', '03001234567', 'Dr. Ayesha Javed', '2026-09-20', '10:00 AM', 'Initial Fertility Consultation', 'Bank Transfer', 'pending', 0),
-- ('Sara Ahmed', 'sara@example.com', '03219876543', 'Dr. Sarah Ahmed', '2026-09-21', '02:00 PM', 'Follow-up Consultation', 'Pay at Clinic', 'paid_at_clinic', 0);
