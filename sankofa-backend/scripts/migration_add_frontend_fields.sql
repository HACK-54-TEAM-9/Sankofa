-- Migration: Add missing fields for frontend integration
-- Date: 2025-10-27
-- Description: Adds savings_tokens, card_number, and low-tech collector support fields

-- Add savings_tokens column to users table (for healthcare savings)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS savings_tokens DECIMAL(12, 2) DEFAULT 0;

-- Add card_number for low-tech/illiterate collectors (6-digit card)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS card_number VARCHAR(6) UNIQUE;

-- Add low-tech support fields
ALTER TABLE users
ADD COLUMN IF NOT EXISTS has_phone VARCHAR(10) CHECK (has_phone IN ('yes', 'no', 'shared'));

ALTER TABLE users
ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(20);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS landmark VARCHAR(255);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(50) DEFAULT 'english';

ALTER TABLE users
ADD COLUMN IF NOT EXISTS can_read VARCHAR(5) CHECK (can_read IN ('yes', 'no'));

ALTER TABLE users
ADD COLUMN IF NOT EXISTS physical_id_number VARCHAR(100);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS collector_notes TEXT;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS registered_by UUID REFERENCES users(id);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS registration_date TIMESTAMP;

-- Add neighborhood field (separate from full address)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS neighborhood VARCHAR(100);

-- Create indexes for fast lookup by phone and card number
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_card_number ON users(card_number) WHERE card_number IS NOT NULL;

-- Update User model fields to use snake_case
COMMENT ON COLUMN users.savings_tokens IS 'Healthcare savings tokens that collectors can accumulate';
COMMENT ON COLUMN users.card_number IS '6-digit physical card number for collectors without smartphones';
COMMENT ON COLUMN users.has_phone IS 'Whether collector has a phone (yes/no/shared)';
COMMENT ON COLUMN users.can_read IS 'Literacy status for providing appropriate assistance';
COMMENT ON COLUMN users.preferred_language IS 'Preferred language for communication (e.g., Twi, Ga, English)';
COMMENT ON COLUMN users.landmark IS 'Local landmark for collectors who cannot provide formal address';
COMMENT ON COLUMN users.neighborhood IS 'Neighborhood or community name';

-- Make GPS location optional in collections table
ALTER TABLE collections
ALTER COLUMN collection_location DROP NOT NULL;

COMMENT ON COLUMN collections.collection_location IS 'GPS coordinates (optional - not all collectors have GPS-enabled phones)';

-- Create transactions table for split payment support
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collector_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  collector_name VARCHAR(100) NOT NULL,
  collector_phone VARCHAR(20),
  hub_manager_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hub_id UUID REFERENCES hubs(id) ON DELETE SET NULL,

  -- Transaction details
  plastic_type VARCHAR(50) NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  location POINT,  -- Optional GPS location

  -- Split payment
  total_value DECIMAL(12, 2) NOT NULL,
  instant_cash DECIMAL(12, 2) NOT NULL DEFAULT 0,
  savings_token DECIMAL(12, 2) NOT NULL DEFAULT 0,

  -- Metadata
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
  notes TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT check_split_payment CHECK (instant_cash + savings_token = total_value)
);

-- Create indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_collector_id ON transactions(collector_id);
CREATE INDEX IF NOT EXISTS idx_transactions_hub_manager_id ON transactions(hub_manager_id);
CREATE INDEX IF NOT EXISTS idx_transactions_hub_id ON transactions(hub_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);

-- Add active_campaigns field to hubs table
ALTER TABLE hubs
ADD COLUMN IF NOT EXISTS active_campaigns INTEGER DEFAULT 0;

-- Create hub_collectors junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS hub_collectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID NOT NULL REFERENCES hubs(id) ON DELETE CASCADE,
  collector_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT NOW(),
  registered_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,

  UNIQUE(hub_id, collector_id)
);

CREATE INDEX IF NOT EXISTS idx_hub_collectors_hub_id ON hub_collectors(hub_id);
CREATE INDEX IF NOT EXISTS idx_hub_collectors_collector_id ON hub_collectors(collector_id);

-- Update existing collections to allow null location
-- Skip this if no collections exist yet or if location is already null
-- UPDATE collections
-- SET collection_location = NULL
-- WHERE collection_location IS NOT NULL
--   AND collection_location::jsonb->>'coordinates' = '[0,0]';

-- Add comment to users table
COMMENT ON TABLE users IS 'User accounts including collectors, hub managers, volunteers, donors, and admins. Supports both smartphone and low-tech/illiterate users.';
COMMENT ON TABLE transactions IS 'Hub manager transactions with split payment support (instant cash + savings tokens)';
COMMENT ON TABLE hub_collectors IS 'Junction table tracking which collectors are registered with which hubs';
