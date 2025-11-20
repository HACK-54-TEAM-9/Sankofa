-- =============================================
-- STEP 4: ADD MISSING COLUMNS FOR TEST COMPATIBILITY
-- =============================================
-- This script adds columns and tables needed for tests to pass
-- Run this AFTER creating tables and seeding data
--
-- Usage: psql <connection-string> < database/4_add_missing_test_columns.sql
-- =============================================

BEGIN;

-- =============================================
-- ADD MISSING COLUMNS TO health_data TABLE
-- =============================================

-- Add risk_level column for health analytics
ALTER TABLE health_data 
ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'low';

-- Add comment for documentation
COMMENT ON COLUMN health_data.risk_level IS 'Risk assessment level: low, medium, high, critical';

-- =============================================
-- ADD MISSING COLUMNS TO users TABLE
-- =============================================

-- Add cash column for payment tracking
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS cash DECIMAL(10,2) DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN users.cash IS 'Cash balance available for withdrawal';

-- =============================================
-- CREATE ussd_sessions TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS ussd_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    current_menu VARCHAR(50) NOT NULL DEFAULT 'main',
    user_data JSONB DEFAULT '{}',
    history TEXT[] DEFAULT '{}',
    state VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '5 minutes'
);

-- Add index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_ussd_sessions_phone 
ON ussd_sessions(phone_number);

-- Add index for session expiry cleanup
CREATE INDEX IF NOT EXISTS idx_ussd_sessions_expires 
ON ussd_sessions(expires_at);

-- Add comment for documentation
COMMENT ON TABLE ussd_sessions IS 'Stores active USSD session state for menu navigation';

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Index for health_data risk_level queries
CREATE INDEX IF NOT EXISTS idx_health_data_risk_level 
ON health_data(risk_level);

-- Index for health_data status queries
CREATE INDEX IF NOT EXISTS idx_health_data_status 
ON health_data(status);

-- Index for users cash queries
CREATE INDEX IF NOT EXISTS idx_users_cash 
ON users(cash);

-- =============================================
-- UPDATE EXISTING DATA (IF ANY)
-- =============================================

-- Set default risk_level based on health_metrics if exists
UPDATE health_data 
SET risk_level = 
    CASE 
        WHEN (health_metrics->>'disease_prevalence')::numeric > 0.7 THEN 'critical'
        WHEN (health_metrics->>'disease_prevalence')::numeric > 0.5 THEN 'high'
        WHEN (health_metrics->>'disease_prevalence')::numeric > 0.3 THEN 'medium'
        ELSE 'low'
    END
WHERE risk_level = 'low' 
  AND health_metrics ? 'disease_prevalence';

-- =============================================
-- GRANT PERMISSIONS (if needed)
-- =============================================

-- Grant permissions to application user (adjust username as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ussd_sessions TO app_user;

COMMIT;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify health_data columns exist
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'health_data' 
  AND column_name IN ('risk_level', 'status')
ORDER BY column_name;

-- Verify users columns exist
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('cash', 'total_earnings')
ORDER BY column_name;

-- Verify ussd_sessions table exists
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'ussd_sessions';

-- Show sample data
SELECT 
    COUNT(*) as total_health_records,
    COUNT(DISTINCT risk_level) as distinct_risk_levels
FROM health_data;

SELECT 
    COUNT(*) as total_users,
    SUM(cash) as total_cash,
    AVG(cash) as avg_cash
FROM users;

SELECT COUNT(*) as active_ussd_sessions 
FROM ussd_sessions 
WHERE expires_at > NOW();
