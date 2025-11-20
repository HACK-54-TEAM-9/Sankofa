-- =============================================
-- STEP 2: CREATE ALL TABLES WITH UPDATED SCHEMA
-- =============================================
-- This script creates all tables with fields compatible with seed_data.sql
-- Run this SECOND after dropping all tables
--
-- Usage: psql <connection-string> < database/2_create_tables.sql
-- =============================================

BEGIN;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================
-- CREATE CUSTOM TYPES
-- =============================================

CREATE TYPE user_role AS ENUM ('collector', 'hub-manager', 'volunteer', 'donor', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
CREATE TYPE collection_status AS ENUM ('pending', 'verified', 'processed', 'paid', 'rejected');
CREATE TYPE plastic_type AS ENUM ('PET', 'HDPE', 'LDPE', 'PP', 'PS', 'Other', 'Mixed');
CREATE TYPE quality_rating AS ENUM ('excellent', 'good', 'fair', 'poor');
CREATE TYPE hub_status AS ENUM ('active', 'inactive', 'maintenance', 'closed');
CREATE TYPE donation_type AS ENUM ('one-time', 'monthly', 'quarterly', 'yearly');
CREATE TYPE payment_method AS ENUM ('mobile_money', 'bank_transfer', 'credit_card', 'paypal', 'crypto');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE volunteer_status AS ENUM ('pending', 'approved', 'rejected', 'active', 'inactive');
CREATE TYPE data_source AS ENUM ('collection_data', 'health_records', 'environmental_monitoring', 'ai_prediction', 'manual_entry', 'field_survey', 'health_facility');

-- =============================================
-- USERS TABLE
-- =============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'collector',
    status user_status DEFAULT 'active',
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    profile JSONB DEFAULT '{}',
    location JSONB DEFAULT '{}',
    health_tokens DECIMAL(10,2) DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    total_collections INTEGER DEFAULT 0,
    total_weight DECIMAL(10,2) DEFAULT 0,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- HUBS TABLE
-- =============================================

CREATE TABLE hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE,
    description TEXT,
    location JSONB NOT NULL,
    contact JSONB NOT NULL,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status hub_status DEFAULT 'active',
    operating_hours JSONB DEFAULT '{}',
    capacity DECIMAL(10,2) DEFAULT 5000,
    current_load DECIMAL(10,2) DEFAULT 0,
    equipment JSONB DEFAULT '{}',
    services JSONB DEFAULT '{}',
    pricing JSONB DEFAULT '{}',
    performance JSONB DEFAULT '{}',
    staff JSONB DEFAULT '[]',
    quality_standards JSONB DEFAULT '{}',
    health_safety JSONB DEFAULT '{}',
    environmental_impact JSONB DEFAULT '{}',
    images JSONB DEFAULT '[]',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- COLLECTIONS TABLE
-- =============================================

CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collector_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
    plastic_type plastic_type NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    quality quality_rating DEFAULT 'good',
    status collection_status DEFAULT 'pending',
    collection_location JSONB NOT NULL,
    verification_notes TEXT,
    points_awarded INTEGER DEFAULT 0,
    contamination INTEGER DEFAULT 0,
    notes TEXT,
    base_price DECIMAL(10,2) DEFAULT 0,
    quality_multiplier DECIMAL(3,2) DEFAULT 1.0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    cash_amount DECIMAL(10,2) DEFAULT 0,
    health_token_amount DECIMAL(10,2) DEFAULT 0,
    verification_date TIMESTAMP WITH TIME ZONE,
    processed_date TIMESTAMP WITH TIME ZONE,
    paid_date TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    payment_method payment_method DEFAULT 'mobile_money',
    payment_reference VARCHAR(255),
    payment_status payment_status DEFAULT 'pending',
    health_impact JSONB DEFAULT '{}',
    environmental_impact JSONB DEFAULT '{}',
    images JSONB DEFAULT '[]',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- HEALTH_DATA TABLE
-- =============================================

CREATE TABLE health_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location JSONB NOT NULL,
    source data_source NOT NULL,
    health_metrics JSONB NOT NULL,
    collection_impact JSONB DEFAULT '{}',
    predictions JSONB DEFAULT '{}',
    ai_analysis JSONB DEFAULT '{}',
    data_quality JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DONATIONS TABLE
-- =============================================

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GHS',
    type donation_type NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    anonymous BOOLEAN DEFAULT FALSE,
    message TEXT,
    payment JSONB DEFAULT '{}',
    tier JSONB DEFAULT '{}',
    allocation JSONB DEFAULT '{}',
    impact JSONB DEFAULT '{}',
    recurring JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    communication JSONB DEFAULT '{}',
    tax JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PAYMENTS TABLE
-- =============================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GHS',
    payment_method VARCHAR(50),
    status payment_status DEFAULT 'pending',
    description TEXT,
    transaction_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- VOLUNTEERS TABLE
-- =============================================

CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    application_status VARCHAR(50),
    skills JSONB DEFAULT '[]',
    availability JSONB DEFAULT '{}',
    motivation TEXT,
    assigned_tasks JSONB DEFAULT '[]',
    hours_contributed INTEGER DEFAULT 0,
    status volunteer_status DEFAULT 'pending',
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    rejected_by UUID REFERENCES users(id) ON DELETE SET NULL,
    rejected_at TIMESTAMP WITH TIME ZONE,
    assigned_opportunity UUID,
    hours_volunteered INTEGER DEFAULT 0,
    impact JSONB DEFAULT '{}',
    feedback JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AI_INTERACTIONS TABLE
-- =============================================

CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255) DEFAULT 'default-session',
    type VARCHAR(50),
    message TEXT,
    response TEXT,
    metadata JSONB DEFAULT '{}',
    feedback JSONB DEFAULT '{}',
    input JSONB DEFAULT '{}',
    processing JSONB DEFAULT '{}',
    health_intelligence JSONB DEFAULT '{}',
    collection_intelligence JSONB DEFAULT '{}',
    follow_up JSONB DEFAULT '{}',
    privacy JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'completed',
    error JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ANALYTICS_CACHE TABLE
-- =============================================

CREATE TABLE analytics_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE INDEXES
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Hubs indexes
CREATE INDEX idx_hubs_manager ON hubs(manager_id);
CREATE INDEX idx_hubs_status ON hubs(status);
CREATE INDEX idx_hubs_code ON hubs(code);
CREATE INDEX idx_hubs_location ON hubs USING GIN (location);

-- Collections indexes
CREATE INDEX idx_collections_collector ON collections(collector_id);
CREATE INDEX idx_collections_hub ON collections(hub_id);
CREATE INDEX idx_collections_status ON collections(status);
CREATE INDEX idx_collections_plastic_type ON collections(plastic_type);
CREATE INDEX idx_collections_created_at ON collections(created_at);
CREATE INDEX idx_collections_location ON collections USING GIN (collection_location);
CREATE INDEX idx_collections_payment_status ON collections(payment_status);

-- Health data indexes
CREATE INDEX idx_health_data_location ON health_data USING GIN (location);
CREATE INDEX idx_health_data_source ON health_data(source);
CREATE INDEX idx_health_data_status ON health_data(status);
CREATE INDEX idx_health_data_created_at ON health_data(created_at);

-- Donations indexes
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_type ON donations(type);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at);

-- Payments indexes
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_donation ON payments(donation_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Volunteers indexes
CREATE INDEX idx_volunteers_user ON volunteers(user_id);
CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_volunteers_created_at ON volunteers(created_at);

-- AI interactions indexes
CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_session ON ai_interactions(session_id);
CREATE INDEX idx_ai_interactions_type ON ai_interactions(type);
CREATE INDEX idx_ai_interactions_created_at ON ai_interactions(created_at);

-- Analytics cache indexes
CREATE INDEX idx_analytics_cache_key ON analytics_cache(cache_key);
CREATE INDEX idx_analytics_cache_expires ON analytics_cache(expires_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- =============================================
-- CREATE TRIGGERS
-- =============================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hubs_updated_at BEFORE UPDATE ON hubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_data_updated_at BEFORE UPDATE ON health_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_interactions_updated_at BEFORE UPDATE ON ai_interactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Confirmation message
SELECT 'All tables created successfully! Ready for seed data.' AS status;
