-- =====================================================
-- ADD MISSING COLUMNS TO USERS TABLE
-- Run this in Supabase SQL Editor to fix login issues
-- =====================================================

-- Add last_activity column (used to track user activity)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE;

-- Add login_count column (tracks number of logins)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- Add password reset columns (for forgot password flow)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_reset_token TEXT,
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_last_activity ON users(last_activity);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);

-- Update existing users to have default values
UPDATE users 
SET last_activity = COALESCE(last_login, created_at),
    login_count = 0 
WHERE last_activity IS NULL;

-- Display success message
SELECT 'Migration completed successfully! Added last_activity, login_count, password_reset_token, password_reset_expires columns.' as status;
