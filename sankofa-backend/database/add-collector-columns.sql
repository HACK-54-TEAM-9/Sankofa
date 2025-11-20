-- =====================================================
-- ADD MISSING COLUMNS TO COLLECTORS TABLE
-- Run this in Supabase SQL Editor for collector registration
-- =====================================================

-- Add missing fields for low-tech collector registration
ALTER TABLE collectors 
ADD COLUMN IF NOT EXISTS has_phone VARCHAR(10) CHECK (has_phone IN ('yes', 'no', 'shared')),
ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(20),
ADD COLUMN IF NOT EXISTS landmark TEXT,
ADD COLUMN IF NOT EXISTS photo TEXT,
ADD COLUMN IF NOT EXISTS physical_id_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS registered_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index for registered_by
CREATE INDEX IF NOT EXISTS idx_collectors_registered_by ON collectors(registered_by);

-- Update existing collectors to have default values
UPDATE collectors 
SET has_phone = 'yes'
WHERE has_phone IS NULL AND phone IS NOT NULL;

UPDATE collectors 
SET has_phone = 'no'
WHERE has_phone IS NULL AND phone IS NULL;

-- Display success message
SELECT 'Migration completed successfully! Added has_phone, emergency_contact, landmark, photo, physical_id_number, notes, registered_by columns to collectors table.' as status;
