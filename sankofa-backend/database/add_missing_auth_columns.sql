-- Add missing columns for authentication tracking
-- Run this script in Supabase SQL Editor

ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_last_activity ON users(last_activity);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);

SELECT 'Added last_activity, login_count, and last_login columns to users table' AS status;
