-- Sankofa-Coin Database Schema
-- This file contains all the SQL commands to create the necessary tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('collector', 'hub-manager', 'volunteer', 'donor', 'admin')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  avatar TEXT,
  date_of_birth DATE,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
  
  -- Address information
  street VARCHAR(255),
  city VARCHAR(100),
  region VARCHAR(100),
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Collector specific
  collector_rank VARCHAR(50) DEFAULT 'Bronze',
  total_collections INTEGER DEFAULT 0,
  total_weight DECIMAL(10, 2) DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  health_tokens INTEGER DEFAULT 0,
  nhis_number VARCHAR(100),
  nhis_status VARCHAR(50) DEFAULT 'inactive',
  
  -- Account verification
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP,
  login_count INTEGER DEFAULT 0,
  last_activity TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

-- Hubs table
CREATE TABLE IF NOT EXISTS hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  location POINT NOT NULL,
  street VARCHAR(255),
  city VARCHAR(100),
  region VARCHAR(100),
  postal_code VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  manager_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'closed')),
  opening_hours TEXT,
  capacity_tons DECIMAL(10, 2),
  total_collections INTEGER DEFAULT 0,
  total_plastic_collected DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collector_id UUID NOT NULL REFERENCES users(id),
  hub_id UUID NOT NULL REFERENCES hubs(id),
  plastic_type VARCHAR(50) NOT NULL CHECK (plastic_type IN ('PET', 'HDPE', 'LDPE', 'PP', 'PS', 'Other')),
  weight DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  location POINT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'processed', 'paid', 'rejected')),
  quality VARCHAR(50) CHECK (quality IN ('excellent', 'good', 'fair', 'poor')),
  cash_amount DECIMAL(12, 2),
  health_tokens INTEGER,
  co2_reduced DECIMAL(10, 4),
  payment_status VARCHAR(50) DEFAULT 'pending',
  verification_notes TEXT,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(12, 2) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('one-time', 'monthly', 'quarterly', 'yearly')),
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('mobile_money', 'bank_transfer', 'credit_card', 'paypal', 'crypto')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  is_recurring BOOLEAN DEFAULT FALSE,
  next_payment_date DATE,
  transaction_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Health Data table
CREATE TABLE IF NOT EXISTS health_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location POINT NOT NULL,
  region VARCHAR(100),
  source VARCHAR(100) NOT NULL CHECK (source IN ('collection_data', 'health_records', 'environmental_monitoring', 'ai_prediction', 'manual_entry')),
  disease_type VARCHAR(100),
  risk_level VARCHAR(50) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  population_affected INTEGER,
  environmental_factors TEXT,
  health_metrics JSONB,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI Interactions table
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT,
  type VARCHAR(50) CHECK (type IN ('chat', 'voice', 'query', 'insight_request', 'health_analysis')),
  is_helpful BOOLEAN,
  accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
  relevance_rating INTEGER CHECK (relevance_rating >= 1 AND relevance_rating <= 5),
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Volunteer Opportunities table
CREATE TABLE IF NOT EXISTS volunteer_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  hub_id UUID REFERENCES hubs(id),
  start_date DATE NOT NULL,
  end_date DATE,
  required_skills TEXT,
  commitment_level VARCHAR(50),
  spots_available INTEGER DEFAULT 1,
  spots_filled INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Volunteer Applications table
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL REFERENCES users(id),
  opportunity_id UUID NOT NULL REFERENCES volunteer_opportunities(id),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'inactive')),
  application_date TIMESTAMP DEFAULT NOW(),
  approval_date TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  reference_id UUID NOT NULL,
  reference_type VARCHAR(50) NOT NULL CHECK (reference_type IN ('collection', 'donation', 'reward')),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GHS',
  method VARCHAR(50) NOT NULL CHECK (method IN ('mobile_money', 'bank_transfer', 'credit_card', 'paypal', 'crypto')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  description TEXT,
  metadata JSONB,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_hubs_code ON hubs(code);
CREATE INDEX idx_hubs_manager ON hubs(manager_id);
CREATE INDEX idx_hubs_status ON hubs(status);
CREATE INDEX idx_collections_collector ON collections(collector_id);
CREATE INDEX idx_collections_hub ON collections(hub_id);
CREATE INDEX idx_collections_status ON collections(status);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_health_data_region ON health_data(region);
CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX idx_volunteer_apps_volunteer ON volunteer_applications(volunteer_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Enable RLS (Row Level Security) - optional but recommended
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
