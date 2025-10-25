-- Sankofa-Coin Database Schema for Supabase (PostgreSQL)
-- This file contains the complete database schema for the Sankofa-Coin application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_role AS ENUM ('collector', 'hub-manager', 'volunteer', 'donor', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
CREATE TYPE collection_status AS ENUM ('pending', 'verified', 'processed', 'paid', 'rejected');
CREATE TYPE plastic_type AS ENUM ('PET', 'HDPE', 'LDPE', 'PP', 'PS', 'Other');
CREATE TYPE quality_rating AS ENUM ('excellent', 'good', 'fair', 'poor');
CREATE TYPE hub_status AS ENUM ('active', 'inactive', 'maintenance', 'closed');
CREATE TYPE donation_type AS ENUM ('one-time', 'monthly', 'quarterly', 'yearly');
CREATE TYPE payment_method AS ENUM ('mobile_money', 'bank_transfer', 'credit_card', 'paypal', 'crypto');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE volunteer_status AS ENUM ('pending', 'approved', 'rejected', 'active', 'inactive');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE data_source AS ENUM ('collection_data', 'health_records', 'environmental_monitoring', 'ai_prediction', 'manual_entry');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'collector',
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    profile JSONB DEFAULT '{}',
    location JSONB DEFAULT '{}',
    health_tokens DECIMAL(10,2) DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    total_collections INTEGER DEFAULT 0,
    total_weight DECIMAL(10,2) DEFAULT 0,
    status user_status DEFAULT 'active',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hubs table
CREATE TABLE hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location JSONB NOT NULL, -- {coordinates: [lng, lat], address: "string"}
    contact JSONB NOT NULL, -- {phone: "string", email: "string"}
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    capacity INTEGER DEFAULT 1000,
    current_stock DECIMAL(10,2) DEFAULT 0,
    status hub_status DEFAULT 'active',
    operating_hours JSONB DEFAULT '{}',
    services JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collections table
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
    plastic_type plastic_type NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    collection_location JSONB NOT NULL, -- {coordinates: [lng, lat], address: "string"}
    status collection_status DEFAULT 'pending',
    quality quality_rating,
    verification_notes TEXT,
    cash_amount DECIMAL(10,2) DEFAULT 0,
    health_tokens DECIMAL(10,2) DEFAULT 0,
    co2_reduced DECIMAL(10,2) DEFAULT 0,
    water_saved DECIMAL(10,2) DEFAULT 0,
    energy_saved DECIMAL(10,2) DEFAULT 0,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health data table
CREATE TABLE health_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location JSONB NOT NULL, -- {coordinates: [lng, lat], address: "string"}
    region VARCHAR(100),
    source data_source NOT NULL,
    health_metrics JSONB NOT NULL, -- {riskAssessment: {overallRisk: "medium", factors: []}, ...}
    environmental_data JSONB DEFAULT '{}',
    disease_patterns JSONB DEFAULT '{}',
    predictions JSONB DEFAULT '{}',
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    type donation_type NOT NULL,
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    payment_data JSONB DEFAULT '{}',
    recurring_config JSONB DEFAULT '{}',
    impact_report JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GHS',
    method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    description TEXT,
    transaction_id VARCHAR(255),
    payment_data JSONB DEFAULT '{}',
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers table
CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id UUID, -- References volunteer opportunities
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    skills JSONB DEFAULT '[]',
    availability JSONB DEFAULT '{}',
    experience TEXT,
    motivation TEXT,
    status volunteer_status DEFAULT 'pending',
    assigned_tasks JSONB DEFAULT '[]',
    hours_volunteered INTEGER DEFAULT 0,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI interactions table
CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    message TEXT NOT NULL,
    response TEXT,
    type VARCHAR(50) DEFAULT 'chat',
    context JSONB DEFAULT '{}',
    feedback JSONB DEFAULT '{}',
    processing_time INTEGER, -- milliseconds
    tokens_used INTEGER,
    cost DECIMAL(10,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics cache table
CREATE TABLE analytics_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_hubs_manager ON hubs(manager_id);
CREATE INDEX idx_hubs_status ON hubs(status);
CREATE INDEX idx_hubs_location ON hubs USING GIST ((location->>'coordinates')::point);

CREATE INDEX idx_collections_user ON collections(user_id);
CREATE INDEX idx_collections_hub ON collections(hub_id);
CREATE INDEX idx_collections_status ON collections(status);
CREATE INDEX idx_collections_created_at ON collections(created_at);
CREATE INDEX idx_collections_location ON collections USING GIST ((collection_location->>'coordinates')::point);

CREATE INDEX idx_health_data_location ON health_data USING GIST ((location->>'coordinates')::point);
CREATE INDEX idx_health_data_region ON health_data(region);
CREATE INDEX idx_health_data_source ON health_data(source);
CREATE INDEX idx_health_data_created_at ON health_data(created_at);

CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_type ON donations(type);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_donations_created_at ON donations(created_at);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_method ON payments(method);
CREATE INDEX idx_payments_created_at ON payments(created_at);

CREATE INDEX idx_volunteers_user ON volunteers(user_id);
CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_volunteers_created_at ON volunteers(created_at);

CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_session ON ai_interactions(session_id);
CREATE INDEX idx_ai_interactions_created_at ON ai_interactions(created_at);

CREATE INDEX idx_analytics_cache_key ON analytics_cache(cache_key);
CREATE INDEX idx_analytics_cache_expires ON analytics_cache(expires_at);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

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

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Collections policies
CREATE POLICY "Users can view own collections" ON collections FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create collections" ON collections FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own collections" ON collections FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Donations policies
CREATE POLICY "Users can view own donations" ON donations FOR SELECT USING (auth.uid()::text = donor_id::text);
CREATE POLICY "Users can create donations" ON donations FOR INSERT WITH CHECK (auth.uid()::text = donor_id::text);

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create payments" ON payments FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Volunteers policies
CREATE POLICY "Users can view own volunteer records" ON volunteers FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create volunteer applications" ON volunteers FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- AI interactions policies
CREATE POLICY "Users can view own AI interactions" ON ai_interactions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create AI interactions" ON ai_interactions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);

-- Public read access for some tables
CREATE POLICY "Public read access for hubs" ON hubs FOR SELECT USING (true);
CREATE POLICY "Public read access for health data" ON health_data FOR SELECT USING (true);

-- Admin access policies (for service role)
CREATE POLICY "Service role full access" ON users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON hubs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON collections FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON health_data FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON donations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON payments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON volunteers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON ai_interactions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON notifications FOR ALL USING (auth.role() = 'service_role');

-- Create a function to clean up expired analytics cache
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM analytics_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
    total_users BIGINT,
    active_users BIGINT,
    collectors BIGINT,
    hub_managers BIGINT,
    volunteers BIGINT,
    donors BIGINT,
    recent_users BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE status = 'active') as active_users,
        COUNT(*) FILTER (WHERE role = 'collector') as collectors,
        COUNT(*) FILTER (WHERE role = 'hub-manager') as hub_managers,
        COUNT(*) FILTER (WHERE role = 'volunteer') as volunteers,
        COUNT(*) FILTER (WHERE role = 'donor') as donors,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as recent_users
    FROM users;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get collection statistics
CREATE OR REPLACE FUNCTION get_collection_stats()
RETURNS TABLE (
    total_collections BIGINT,
    total_weight DECIMAL,
    total_earnings DECIMAL,
    total_health_tokens DECIMAL,
    total_co2_reduced DECIMAL,
    pending_collections BIGINT,
    verified_collections BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_collections,
        COALESCE(SUM(weight), 0) as total_weight,
        COALESCE(SUM(cash_amount), 0) as total_earnings,
        COALESCE(SUM(health_tokens), 0) as total_health_tokens,
        COALESCE(SUM(co2_reduced), 0) as total_co2_reduced,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_collections,
        COUNT(*) FILTER (WHERE status = 'verified') as verified_collections
    FROM collections;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data (optional - for development)
INSERT INTO users (id, name, email, phone, password, role, is_email_verified, is_phone_verified) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin@sankofacoin.org', '+233123456789', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'admin', true, true),
    ('550e8400-e29b-41d4-a716-446655440001', 'John Collector', 'john@example.com', '+233123456790', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'collector', true, true),
    ('550e8400-e29b-41d4-a716-446655440002', 'Jane Hub Manager', 'jane@example.com', '+233123456791', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'hub-manager', true, true);

INSERT INTO hubs (id, name, description, location, contact, manager_id) VALUES
    ('650e8400-e29b-41d4-a716-446655440000', 'Accra Central Hub', 'Main collection hub in Accra Central', '{"coordinates": [-0.1870, 5.6037], "address": "Accra Central, Ghana"}', '{"phone": "+233123456789", "email": "accra@hub.com"}', '550e8400-e29b-41d4-a716-446655440002'),
    ('650e8400-e29b-41d4-a716-446655440001', 'Kumasi Hub', 'Collection hub in Kumasi', '{"coordinates": [-1.6244, 6.6885], "address": "Kumasi, Ghana"}', '{"phone": "+233123456790", "email": "kumasi@hub.com"}', '550e8400-e29b-41d4-a716-446655440002');

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts and profiles for the Sankofa-Coin platform';
COMMENT ON TABLE hubs IS 'Collection hubs where users can drop off plastic waste';
COMMENT ON TABLE collections IS 'Plastic waste collection records';
COMMENT ON TABLE health_data IS 'Health intelligence and environmental data';
COMMENT ON TABLE donations IS 'Donation records and recurring donations';
COMMENT ON TABLE payments IS 'Payment transactions and processing';
COMMENT ON TABLE volunteers IS 'Volunteer applications and management';
COMMENT ON TABLE ai_interactions IS 'AI assistant interactions and chat history';
COMMENT ON TABLE analytics_cache IS 'Cached analytics data for performance';
COMMENT ON TABLE notifications IS 'User notifications and alerts';
