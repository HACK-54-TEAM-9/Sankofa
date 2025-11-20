-- Add missing verification and password reset columns
-- Run this in Supabase SQL Editor

ALTER TABLE users
ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone_verification_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS phone_verification_expires TIMESTAMP,
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email_verification ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_password_reset ON users(password_reset_token);

SELECT 'Added verification and password reset columns to users table' AS status;
