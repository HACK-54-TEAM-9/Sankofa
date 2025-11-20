-- =====================================================
-- SANKOFA DATABASE SCHEMA
-- Complete PostgreSQL schema for Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE
-- Core user authentication and profile data
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'collector' CHECK (role IN ('collector', 'hub-manager', 'volunteer', 'donor', 'admin')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended', 'deleted')),
    
    -- Verification
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    phone_verification_code VARCHAR(6),
    
    -- Profile
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    
    -- Settings
    preferred_language VARCHAR(50) DEFAULT 'English',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": true, "push": true}'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- =====================================================
-- 2. HUBS TABLE
-- Collection hub locations and management
-- =====================================================
CREATE TABLE IF NOT EXISTS hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Location
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    coordinates JSONB NOT NULL, -- {lat: float, lng: float}
    
    -- Contact
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    
    -- Management
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'closed')),
    
    -- Capacity
    capacity_kg DECIMAL(10, 2) DEFAULT 1000.00,
    current_stock_kg DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Operating hours
    operating_hours JSONB DEFAULT '{"monday": "08:00-17:00", "tuesday": "08:00-17:00", "wednesday": "08:00-17:00", "thursday": "08:00-17:00", "friday": "08:00-17:00", "saturday": "08:00-13:00"}'::jsonb,
    
    -- Statistics
    total_collections INTEGER DEFAULT 0,
    total_weight_kg DECIMAL(10, 2) DEFAULT 0.00,
    total_collectors INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for hubs
CREATE INDEX idx_hubs_code ON hubs(code);
CREATE INDEX idx_hubs_manager_id ON hubs(manager_id);
CREATE INDEX idx_hubs_status ON hubs(status);
CREATE INDEX idx_hubs_city ON hubs(city);
CREATE INDEX idx_hubs_region ON hubs(region);

-- =====================================================
-- 3. COLLECTORS TABLE
-- Registered plastic collectors
-- =====================================================
CREATE TABLE IF NOT EXISTS collectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Collector Info
    card_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    neighborhood TEXT NOT NULL,
    
    -- Preferences
    preferred_language VARCHAR(50) DEFAULT 'English',
    can_read VARCHAR(10) DEFAULT 'yes' CHECK (can_read IN ('yes', 'no')),
    
    -- Hub Association
    primary_hub_id UUID REFERENCES hubs(id) ON DELETE SET NULL,
    
    -- Statistics
    total_collections INTEGER DEFAULT 0,
    total_weight_kg DECIMAL(10, 2) DEFAULT 0.00,
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    health_tokens DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    
    -- Metadata
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_collection_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for collectors
CREATE INDEX idx_collectors_user_id ON collectors(user_id);
CREATE INDEX idx_collectors_card_number ON collectors(card_number);
CREATE INDEX idx_collectors_phone ON collectors(phone);
CREATE INDEX idx_collectors_primary_hub_id ON collectors(primary_hub_id);
CREATE INDEX idx_collectors_status ON collectors(status);

-- =====================================================
-- 4. COLLECTIONS TABLE
-- Individual plastic collection transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relationships
    collector_id UUID REFERENCES collectors(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Collection Details
    plastic_type VARCHAR(50) NOT NULL CHECK (plastic_type IN ('PET', 'HDPE', 'LDPE', 'PP', 'PS', 'PVC', 'Other')),
    weight_kg DECIMAL(10, 2) NOT NULL CHECK (weight_kg > 0),
    quantity INTEGER DEFAULT 1,
    quality VARCHAR(50) CHECK (quality IN ('excellent', 'good', 'fair', 'poor')),
    
    -- Financial
    price_per_kg DECIMAL(10, 2) NOT NULL,
    total_value DECIMAL(10, 2) NOT NULL,
    instant_cash DECIMAL(10, 2) DEFAULT 0.00,
    savings_token DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Status & Verification
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'processed', 'paid', 'rejected')),
    verification_notes TEXT,
    
    -- Location
    collection_location JSONB, -- {coordinates: [lng, lat], address: string}
    
    -- Images
    images TEXT[], -- Array of image URLs
    
    -- Metadata
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for collections
CREATE INDEX idx_collections_collector_id ON collections(collector_id);
CREATE INDEX idx_collections_hub_id ON collections(hub_id);
CREATE INDEX idx_collections_status ON collections(status);
CREATE INDEX idx_collections_plastic_type ON collections(plastic_type);
CREATE INDEX idx_collections_collected_at ON collections(collected_at);

-- =====================================================
-- 5. TRANSACTIONS TABLE
-- Payment and financial transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relationships
    collector_id UUID REFERENCES collectors(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
    hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
    processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Transaction Details
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('collection', 'withdrawal', 'transfer', 'bonus', 'penalty')),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'GHS',
    
    -- Payment Method
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'mobile-money', 'bank-transfer', 'health-token')),
    payment_reference VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
    
    -- Additional Info
    description TEXT,
    metadata JSONB, -- Additional flexible data
    
    -- Metadata
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for transactions
CREATE INDEX idx_transactions_collector_id ON transactions(collector_id);
CREATE INDEX idx_transactions_hub_id ON transactions(hub_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- =====================================================
-- 6. HEALTH_DATA TABLE
-- Health risk data and insights
-- =====================================================
CREATE TABLE IF NOT EXISTS health_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Location
    region VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    neighborhood TEXT,
    coordinates JSONB,
    
    -- Health Metrics
    malaria_risk_level VARCHAR(50) CHECK (malaria_risk_level IN ('low', 'medium', 'high', 'critical')),
    respiratory_cases INTEGER DEFAULT 0,
    waterborne_diseases INTEGER DEFAULT 0,
    dengue_cases INTEGER DEFAULT 0,
    
    -- Environmental Data
    plastic_pollution_level VARCHAR(50) CHECK (plastic_pollution_level IN ('low', 'medium', 'high', 'critical')),
    air_quality_index INTEGER,
    water_quality_score INTEGER,
    
    -- AI Predictions
    ai_risk_score DECIMAL(5, 2), -- 0-100
    ai_recommendations TEXT[],
    
    -- Time Period
    data_date DATE NOT NULL,
    week_number INTEGER,
    month_number INTEGER,
    year_number INTEGER,
    
    -- Metadata
    data_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for health_data
CREATE INDEX idx_health_data_region ON health_data(region);
CREATE INDEX idx_health_data_city ON health_data(city);
CREATE INDEX idx_health_data_date ON health_data(data_date);
CREATE INDEX idx_health_data_risk ON health_data(malaria_risk_level);

-- =====================================================
-- 7. MESSAGES TABLE
-- Communication between users
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Sender/Receiver
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message Content
    subject VARCHAR(255),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'direct' CHECK (message_type IN ('direct', 'broadcast', 'notification', 'alert')),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Attachments
    attachments TEXT[],
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for messages
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- =====================================================
-- 8. DONATIONS TABLE
-- Donation records
-- =====================================================
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Donor Info
    donor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    donor_name VARCHAR(100),
    donor_email VARCHAR(255),
    donor_phone VARCHAR(20),
    
    -- Donation Details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(10) DEFAULT 'GHS',
    donation_type VARCHAR(50) CHECK (donation_type IN ('one-time', 'recurring', 'corporate')),
    
    -- Purpose
    purpose VARCHAR(100),
    message TEXT,
    
    -- Payment
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- Allocation
    allocated_to VARCHAR(50) CHECK (allocated_to IN ('general', 'health-tokens', 'education', 'infrastructure')),
    
    -- Metadata
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for donations
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_donations_created_at ON donations(created_at);

-- =====================================================
-- 9. VOLUNTEERS TABLE
-- Volunteer applications and management
-- =====================================================
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Volunteer Info
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Details
    skills TEXT[],
    availability TEXT,
    preferred_location VARCHAR(100),
    
    -- Application
    motivation TEXT,
    application_status VARCHAR(50) DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected', 'on-hold')),
    
    -- Activity
    hours_contributed INTEGER DEFAULT 0,
    events_attended INTEGER DEFAULT 0,
    
    -- Metadata
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for volunteers
CREATE INDEX idx_volunteers_user_id ON volunteers(user_id);
CREATE INDEX idx_volunteers_status ON volunteers(application_status);
CREATE INDEX idx_volunteers_email ON volunteers(email);

-- =====================================================
-- 10. ANALYTICS TABLE
-- System-wide analytics and metrics
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Metric Type
    metric_name VARCHAR(100) NOT NULL,
    metric_category VARCHAR(50) NOT NULL,
    
    -- Values
    metric_value DECIMAL(15, 2) NOT NULL,
    metric_unit VARCHAR(50),
    
    -- Dimensions
    region VARCHAR(100),
    hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
    
    -- Time
    recorded_date DATE NOT NULL,
    recorded_time TIME,
    
    -- Metadata
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX idx_analytics_metric_name ON analytics(metric_name);
CREATE INDEX idx_analytics_category ON analytics(metric_category);
CREATE INDEX idx_analytics_date ON analytics(recorded_date);
CREATE INDEX idx_analytics_hub_id ON analytics(hub_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- Automatic timestamp updates
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hubs_updated_at BEFORE UPDATE ON hubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collectors_updated_at BEFORE UPDATE ON collectors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_data_updated_at BEFORE UPDATE ON health_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS for all tables
-- =====================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE collectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Note: Configure specific RLS policies based on your auth requirements
-- For development, you can disable RLS temporarily or set permissive policies

-- =====================================================
-- INITIAL DATA SEEDING
-- Sample data for development/testing
-- =====================================================

-- Insert sample hub
INSERT INTO hubs (name, code, address, city, region, coordinates, phone, status) VALUES
('Accra Central Hub', 'ACH-001', '123 Independence Avenue', 'Accra', 'Greater Accra', '{"lat": 5.6037, "lng": -0.1870}', '+233244123456', 'active'),
('Kumasi Hub', 'KUM-001', '45 Prempeh II Street', 'Kumasi', 'Ashanti', '{"lat": 6.6885, "lng": -1.6244}', '+233244234567', 'active'),
('Tamale Hub', 'TAM-001', '78 Hospital Road', 'Tamale', 'Northern', '{"lat": 9.4008, "lng": -0.8393}', '+233244345678', 'active')
ON CONFLICT DO NOTHING;

-- Insert sample health data
INSERT INTO health_data (region, city, malaria_risk_level, plastic_pollution_level, ai_risk_score, data_date, year_number, month_number, week_number) VALUES
('Greater Accra', 'Accra', 'high', 'high', 78.5, CURRENT_DATE, EXTRACT(YEAR FROM CURRENT_DATE), EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(WEEK FROM CURRENT_DATE)),
('Ashanti', 'Kumasi', 'medium', 'medium', 62.3, CURRENT_DATE, EXTRACT(YEAR FROM CURRENT_DATE), EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(WEEK FROM CURRENT_DATE)),
('Northern', 'Tamale', 'high', 'low', 71.8, CURRENT_DATE, EXTRACT(YEAR FROM CURRENT_DATE), EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(WEEK FROM CURRENT_DATE))
ON CONFLICT DO NOTHING;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Dashboard statistics view
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
    (SELECT COUNT(*) FROM collectors WHERE status = 'active') as active_collectors,
    (SELECT COUNT(*) FROM hubs WHERE status = 'active') as active_hubs,
    (SELECT COALESCE(SUM(weight_kg), 0) FROM collections WHERE status = 'verified') as total_plastic_kg,
    (SELECT COALESCE(SUM(total_value), 0) FROM collections WHERE status = 'paid') as total_paid_out,
    (SELECT COUNT(*) FROM collections WHERE collected_at >= CURRENT_DATE - INTERVAL '7 days') as collections_this_week;

-- Hub performance view
CREATE OR REPLACE VIEW hub_performance AS
SELECT 
    h.id,
    h.name,
    h.code,
    h.city,
    h.region,
    COUNT(DISTINCT c.collector_id) as unique_collectors,
    COUNT(c.id) as total_collections,
    COALESCE(SUM(c.weight_kg), 0) as total_weight_kg,
    COALESCE(SUM(c.total_value), 0) as total_value,
    AVG(c.weight_kg) as avg_collection_weight
FROM hubs h
LEFT JOIN collections c ON h.id = c.hub_id
WHERE h.deleted_at IS NULL
GROUP BY h.id, h.name, h.code, h.city, h.region;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Sankofa database schema created successfully!';
    RAISE NOTICE '📊 Tables created: 10';
    RAISE NOTICE '🔐 Row Level Security enabled';
    RAISE NOTICE '⚡ Triggers configured';
    RAISE NOTICE '📈 Views created for analytics';
END $$;
