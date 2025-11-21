-- =============================================
-- STEP 1: DROP ALL TABLES AND CLEAN DATABASE
-- =============================================
-- This script drops all existing tables and types
-- Run this FIRST to start with a clean slate
--
-- Usage: psql <connection-string> < database/1_drop_all.sql
-- =============================================

BEGIN;

-- Drop all tables (in reverse dependency order)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS analytics_cache CASCADE;
DROP TABLE IF EXISTS ai_interactions CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS health_data CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS hubs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop all custom types
DROP TYPE IF EXISTS ai_status CASCADE;
DROP TYPE IF EXISTS ai_interaction_type CASCADE;
DROP TYPE IF EXISTS data_source CASCADE;
DROP TYPE IF EXISTS risk_level CASCADE;
DROP TYPE IF EXISTS volunteer_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS donation_type CASCADE;
DROP TYPE IF EXISTS hub_status CASCADE;
DROP TYPE IF EXISTS quality_rating CASCADE;
DROP TYPE IF EXISTS plastic_type CASCADE;
DROP TYPE IF EXISTS collection_status CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Drop helper functions if they exist
DROP FUNCTION IF EXISTS get_collection_stats CASCADE;
DROP FUNCTION IF EXISTS get_user_stats CASCADE;
DROP FUNCTION IF EXISTS cleanup_expired_cache CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

COMMIT;

-- Confirmation message
SELECT 'All tables, types, and functions have been dropped successfully!' AS status;
