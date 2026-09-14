-- Remove the retired payment option while preserving existing bookings.
UPDATE bookings
SET status = 'pending', is_paid = 0
WHERE status = 'paid_at_clinic';

ALTER TABLE bookings
 MODIFY status ENUM('pending', 'paid') NOT NULL DEFAULT 'pending';