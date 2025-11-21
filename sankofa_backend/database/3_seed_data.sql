-- =============================================
-- STEP 3: SEED DATABASE WITH DEMO DATA
-- =============================================
-- Run AFTER 1_drop_all.sql and 2_create_tables.sql
-- Usage: psql <connection-string> < database/3_seed_data.sql
-- Password for all test users: password123
-- =============================================


-- Start transaction
BEGIN;

-- Clear existing data (in correct order to respect foreign keys)
-- Using DO block to safely truncate only if tables exist
DO $$ 
BEGIN
    -- Truncate tables in reverse dependency order
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_interactions') THEN
        TRUNCATE TABLE ai_interactions CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'analytics_cache') THEN
        TRUNCATE TABLE analytics_cache CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        TRUNCATE TABLE notifications CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments') THEN
        TRUNCATE TABLE payments CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'donations') THEN
        TRUNCATE TABLE donations CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteers') THEN
        TRUNCATE TABLE volunteers CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'collections') THEN
        TRUNCATE TABLE collections CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'health_data') THEN
        TRUNCATE TABLE health_data CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'hubs') THEN
        TRUNCATE TABLE hubs CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        TRUNCATE TABLE users CASCADE;
    END IF;
END $$;

-- =============================================
-- USERS (10 users with different roles)
-- =============================================
-- Password for all users: 'password123' (hashed with bcrypt)
-- Hash: $2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq

INSERT INTO users (id, name, email, phone, password, role, status, is_email_verified, is_phone_verified, points, level, created_at, updated_at) VALUES
-- Collectors (4 users)
('550e8400-e29b-41d4-a716-446655440001', 'Kwame Mensah', 'kwame.mensah@example.com', '+233241234567', '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq', 'collector', 'active', true, true, 1250, 5, NOW() - INTERVAL '6 months', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Ama Osei', 'ama.osei@example.com', '+233242345678', '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq', 'collector', 'active', true, true, 890, 4, NOW() - INTERVAL '4 months', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Kofi Asante', 'kofi.asante@example.com', '+233243456789', '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq', 'collector', 'active', true, false, 560, 3, NOW() - INTERVAL '2 months', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Abena Owusu', 'abena.owusu@example.com', '+233244567890', '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq', 'collector', 'active', false, false, 320, 2, NOW() - INTERVAL '1 month', NOW()),

-- Hub Managers (2 users)
('550e8400-e29b-41d4-a716-446655440005', 'Yaw Boateng', 'yaw.boateng@example.com', '+233245678901', '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq', 'hub-manager', 'active', true, true, 0, 1, NOW() - INTERVAL '8 months', NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'Akosua Darko', 'akosua.darko@example.com', '+233246789012', '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq', 'hub-manager', 'active', true, true, 0, 1, NOW() - INTERVAL '5 months', NOW()),

-- Volunteers (2 users)
('550e8400-e29b-41d4-a716-446655440007', 'Kwesi Appiah', 'kwesi.appiah@example.com', '+233247890123', '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq', 'volunteer', 'active', true, true, 0, 1, NOW() - INTERVAL '3 months', NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'Efua Adjei', 'efua.adjei@example.com', '+233248901234', '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq', 'volunteer', 'active', true, false, 0, 1, NOW() - INTERVAL '2 months', NOW()),

-- Donors (2 users)
('550e8400-e29b-41d4-a716-446655440009', 'Samuel Nkrumah', 'samuel.nkrumah@example.com', '+233249012345', '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq', 'donor', 'active', true, true, 0, 1, NOW() - INTERVAL '7 months', NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'Adwoa Mensah', 'adwoa.mensah@example.com', '+233240123456', '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq', 'donor', 'active', true, true, 0, 1, NOW() - INTERVAL '4 months', NOW());

-- =============================================
-- HUBS (5 collection hubs across Ghana)
-- =============================================

INSERT INTO hubs (id, name, code, location, contact, capacity, current_load, manager_id, status, operating_hours, created_at, updated_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Accra Central Hub', 'HUB-ACC-001', 
  '{"type": "Point", "coordinates": [-0.1870, 5.6037], "address": {"region": "Greater Accra", "district": "Accra Metro", "city": "Accra", "street": "Independence Avenue"}}',
  '{"phone": "+233302123456", "email": "accra.central@sankofa.com"}',
  5000, 3250, '550e8400-e29b-41d4-a716-446655440005', 'active',
  '{"monday": {"open": "08:00", "close": "18:00"}, "tuesday": {"open": "08:00", "close": "18:00"}, "wednesday": {"open": "08:00", "close": "18:00"}, "thursday": {"open": "08:00", "close": "18:00"}, "friday": {"open": "08:00", "close": "18:00"}, "saturday": {"open": "09:00", "close": "14:00"}}',
  NOW() - INTERVAL '8 months', NOW()),

('650e8400-e29b-41d4-a716-446655440002', 'Kumasi Tech Hub', 'HUB-KUM-001',
  '{"type": "Point", "coordinates": [-1.6163, 6.6885], "address": {"region": "Ashanti", "district": "Kumasi Metro", "city": "Kumasi", "street": "Tech Junction Road"}}',
  '{"phone": "+233322234567", "email": "kumasi.tech@sankofa.com"}',
  4000, 2100, '550e8400-e29b-41d4-a716-446655440006', 'active',
  '{"monday": {"open": "08:00", "close": "17:00"}, "tuesday": {"open": "08:00", "close": "17:00"}, "wednesday": {"open": "08:00", "close": "17:00"}, "thursday": {"open": "08:00", "close": "17:00"}, "friday": {"open": "08:00", "close": "17:00"}}',
  NOW() - INTERVAL '5 months', NOW()),

('650e8400-e29b-41d4-a716-446655440003', 'Takoradi Coastal Hub', 'HUB-TAK-001',
  '{"type": "Point", "coordinates": [-1.7533, 4.8845], "address": {"region": "Western", "district": "Sekondi-Takoradi Metro", "city": "Takoradi", "street": "Harbor Road"}}',
  '{"phone": "+233312345678", "email": "takoradi.coastal@sankofa.com"}',
  3500, 1800, '550e8400-e29b-41d4-a716-446655440005', 'active',
  '{"monday": {"open": "07:00", "close": "16:00"}, "tuesday": {"open": "07:00", "close": "16:00"}, "wednesday": {"open": "07:00", "close": "16:00"}, "thursday": {"open": "07:00", "close": "16:00"}, "friday": {"open": "07:00", "close": "16:00"}}',
  NOW() - INTERVAL '6 months', NOW()),

('650e8400-e29b-41d4-a716-446655440004', 'Tamale Northern Hub', 'HUB-TAM-001',
  '{"type": "Point", "coordinates": [-0.8393, 9.4075], "address": {"region": "Northern", "district": "Tamale Metro", "city": "Tamale", "street": "Central Market Road"}}',
  '{"phone": "+233372456789", "email": "tamale.northern@sankofa.com"}',
  3000, 950, '550e8400-e29b-41d4-a716-446655440006', 'active',
  '{"monday": {"open": "08:00", "close": "17:00"}, "tuesday": {"open": "08:00", "close": "17:00"}, "wednesday": {"open": "08:00", "close": "17:00"}, "thursday": {"open": "08:00", "close": "17:00"}, "friday": {"open": "08:00", "close": "17:00"}}',
  NOW() - INTERVAL '4 months', NOW()),

('650e8400-e29b-41d4-a716-446655440005', 'Cape Coast University Hub', 'HUB-CPE-001',
  '{"type": "Point", "coordinates": [-1.2915, 5.1053], "address": {"region": "Central", "district": "Cape Coast Metro", "city": "Cape Coast", "street": "University Road"}}',
  '{"phone": "+233332567890", "email": "capecoast.uni@sankofa.com"}',
  2500, 1200, '550e8400-e29b-41d4-a716-446655440005', 'active',
  '{"monday": {"open": "08:00", "close": "18:00"}, "tuesday": {"open": "08:00", "close": "18:00"}, "wednesday": {"open": "08:00", "close": "18:00"}, "thursday": {"open": "08:00", "close": "18:00"}, "friday": {"open": "08:00", "close": "18:00"}}',
  NOW() - INTERVAL '3 months', NOW());

-- =============================================
-- COLLECTIONS (15 plastic collection records)
-- =============================================

INSERT INTO collections (id, collector_id, hub_id, plastic_type, weight, quantity, quality, status, collection_location, verification_notes, points_awarded, created_by, updated_by, created_at, updated_at) VALUES
-- Recent collections
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'PET', 15.5, 120, 'excellent', 'verified',
  '{"type": "Point", "coordinates": [-0.1920, 5.6100], "address": "Osu, Accra"}',
  'High quality PET bottles, clean and sorted', 155, '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),

('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'HDPE', 22.3, 85, 'good', 'verified',
  '{"type": "Point", "coordinates": [-0.1800, 5.6200], "address": "Labadi, Accra"}',
  'HDPE containers, mostly clean', 223, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),

('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'PET', 18.7, 145, 'excellent', 'verified',
  '{"type": "Point", "coordinates": [-1.6200, 6.6950], "address": "Adum, Kumasi"}',
  'Excellent condition, well sorted PET', 187, '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006',
  NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),

('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'LDPE', 12.4, 95, 'fair', 'verified',
  '{"type": "Point", "coordinates": [-0.1950, 5.5950], "address": "Kaneshie, Accra"}',
  'LDPE bags and films, some contamination', 100, '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '1 week', NOW() - INTERVAL '6 days'),

('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', 'PP', 25.6, 110, 'good', 'verified',
  '{"type": "Point", "coordinates": [-1.7600, 4.8900], "address": "Market Circle, Takoradi"}',
  'Polypropylene containers, good condition', 256, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '1 week', NOW() - INTERVAL '5 days'),

('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', 'PET', 8.9, 75, 'good', 'pending',
  '{"type": "Point", "coordinates": [-0.1750, 5.6150], "address": "Teshie, Accra"}',
  NULL, 0, '550e8400-e29b-41d4-a716-446655440004', NULL,
  NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Older collections
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'PET', 31.2, 250, 'excellent', 'verified',
  '{"type": "Point", "coordinates": [-0.1880, 5.6050], "address": "Ridge, Accra"}',
  'Large batch of clean PET bottles', 312, '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '13 days'),

('750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', 'HDPE', 19.5, 88, 'good', 'verified',
  '{"type": "Point", "coordinates": [-0.8450, 9.4100], "address": "Vittin, Tamale"}',
  'HDPE milk bottles, clean', 195, '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006',
  NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '20 days'),

('750e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440005', 'PET', 14.8, 115, 'excellent', 'verified',
  '{"type": "Point", "coordinates": [-1.2950, 5.1100], "address": "UCC Campus, Cape Coast"}',
  'Student collection drive, excellent quality', 148, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '1 month', NOW() - INTERVAL '28 days'),

('750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'Mixed', 42.7, 320, 'fair', 'verified',
  '{"type": "Point", "coordinates": [-1.6150, 6.6800], "address": "Asafo, Kumasi"}',
  'Mixed plastics, requires further sorting', 350, '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006',
  NOW() - INTERVAL '1 month', NOW() - INTERVAL '25 days'),

('750e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', 'HDPE', 11.3, 65, 'good', 'verified',
  '{"type": "Point", "coordinates": [-0.2000, 5.6000], "address": "Dansoman, Accra"}',
  'Good quality HDPE', 113, '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '6 weeks', NOW() - INTERVAL '40 days'),

('750e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 'PET', 9.6, 78, 'excellent', 'verified',
  '{"type": "Point", "coordinates": [-1.7500, 4.8850], "address": "New Takoradi"}',
  'Clean PET from office collection', 96, '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '2 months', NOW() - INTERVAL '58 days'),

('750e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'PP', 16.2, 92, 'good', 'verified',
  '{"type": "Point", "coordinates": [-0.1850, 5.6080], "address": "Airport, Accra"}',
  'PP from restaurant containers', 162, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '3 months', NOW() - INTERVAL '85 days'),

('750e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440004', 'PET', 27.9, 215, 'excellent', 'verified',
  '{"type": "Point", "coordinates": [-0.8400, 9.4050], "address": "Tamale Central"}',
  'Large collection from market', 279, '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006',
  NOW() - INTERVAL '4 months', NOW() - INTERVAL '115 days'),

('750e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440005', 'LDPE', 7.4, 58, 'fair', 'verified',
  '{"type": "Point", "coordinates": [-1.2900, 5.1080], "address": "Cape Coast Market"}',
  'LDPE bags from market', 60, '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '5 months', NOW() - INTERVAL '145 days');

-- =============================================
-- HEALTH DATA (8 records across regions)
-- =============================================

INSERT INTO health_data (id, location, source, health_metrics, collection_impact, status, created_by, updated_by, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440001',
  '{"type": "Point", "coordinates": [-0.1870, 5.6037], "address": {"region": "Greater Accra", "district": "Accra Metro", "city": "Accra", "neighborhood": "Osu"}}',
  'collection_data',
  '{"diseases": [{"name": "Malaria", "cases": 45, "trend": "decreasing"}], "environmentalHealth": {"airQuality": "moderate", "waterQuality": "good", "wasteManagement": "improving"}, "riskAssessment": {"overallRisk": "medium", "factors": ["waste_accumulation", "drainage"]}}',
  '{"plasticReduction": 156.8, "healthImprovement": "positive", "communityEngagement": "high"}',
  'active', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '1 week', NOW()),

('850e8400-e29b-41d4-a716-446655440002',
  '{"type": "Point", "coordinates": [-1.6163, 6.6885], "address": {"region": "Ashanti", "district": "Kumasi Metro", "city": "Kumasi", "neighborhood": "Adum"}}',
  'collection_data',
  '{"diseases": [{"name": "Cholera", "cases": 12, "trend": "stable"}], "environmentalHealth": {"airQuality": "good", "waterQuality": "moderate", "wasteManagement": "good"}, "riskAssessment": {"overallRisk": "low", "factors": ["sanitation"]}}',
  '{"plasticReduction": 61.4, "healthImprovement": "stable", "communityEngagement": "medium"}',
  'active', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006',
  NOW() - INTERVAL '2 weeks', NOW()),

('850e8400-e29b-41d4-a716-446655440003',
  '{"type": "Point", "coordinates": [-1.7533, 4.8845], "address": {"region": "Western", "district": "Sekondi-Takoradi Metro", "city": "Takoradi", "neighborhood": "Market Circle"}}',
  'field_survey',
  '{"diseases": [{"name": "Dengue", "cases": 8, "trend": "increasing"}], "environmentalHealth": {"airQuality": "moderate", "waterQuality": "poor", "wasteManagement": "fair"}, "riskAssessment": {"overallRisk": "high", "factors": ["coastal_pollution", "standing_water"]}}',
  '{"plasticReduction": 25.6, "healthImprovement": "needs_improvement", "communityEngagement": "low"}',
  'active', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '3 weeks', NOW()),

('850e8400-e29b-41d4-a716-446655440004',
  '{"type": "Point", "coordinates": [-0.8393, 9.4075], "address": {"region": "Northern", "district": "Tamale Metro", "city": "Tamale", "neighborhood": "Central"}}',
  'collection_data',
  '{"diseases": [{"name": "Typhoid", "cases": 18, "trend": "stable"}], "environmentalHealth": {"airQuality": "good", "waterQuality": "moderate", "wasteManagement": "improving"}, "riskAssessment": {"overallRisk": "medium", "factors": ["water_quality"]}}',
  '{"plasticReduction": 47.4, "healthImprovement": "positive", "communityEngagement": "high"}',
  'active', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006',
  NOW() - INTERVAL '1 month', NOW()),

('850e8400-e29b-41d4-a716-446655440005',
  '{"type": "Point", "coordinates": [-1.2915, 5.1053], "address": {"region": "Central", "district": "Cape Coast Metro", "city": "Cape Coast", "neighborhood": "University Area"}}',
  'collection_data',
  '{"diseases": [{"name": "Skin infections", "cases": 22, "trend": "decreasing"}], "environmentalHealth": {"airQuality": "good", "waterQuality": "good", "wasteManagement": "excellent"}, "riskAssessment": {"overallRisk": "low", "factors": []}}',
  '{"plasticReduction": 22.2, "healthImprovement": "excellent", "communityEngagement": "very_high"}',
  'active', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '6 weeks', NOW()),

('850e8400-e29b-41d4-a716-446655440006',
  '{"type": "Point", "coordinates": [-0.1920, 5.6100], "address": {"region": "Greater Accra", "district": "Accra Metro", "city": "Accra", "neighborhood": "Labadi"}}',
  'health_facility',
  '{"diseases": [{"name": "Respiratory issues", "cases": 67, "trend": "stable"}], "environmentalHealth": {"airQuality": "poor", "waterQuality": "moderate", "wasteManagement": "fair"}, "riskAssessment": {"overallRisk": "high", "factors": ["air_pollution", "plastic_burning"]}}',
  '{"plasticReduction": 22.3, "healthImprovement": "needs_improvement", "communityEngagement": "medium"}',
  'active', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '2 months', NOW()),

('850e8400-e29b-41d4-a716-446655440007',
  '{"type": "Point", "coordinates": [-0.1950, 5.5950], "address": {"region": "Greater Accra", "district": "Accra Metro", "city": "Accra", "neighborhood": "Kaneshie"}}',
  'collection_data',
  '{"diseases": [{"name": "Diarrhea", "cases": 34, "trend": "decreasing"}], "environmentalHealth": {"airQuality": "moderate", "waterQuality": "fair", "wasteManagement": "improving"}, "riskAssessment": {"overallRisk": "medium", "factors": ["market_waste", "drainage"]}}',
  '{"plasticReduction": 12.4, "healthImprovement": "positive", "communityEngagement": "medium"}',
  'active', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '3 months', NOW()),

('850e8400-e29b-41d4-a716-446655440008',
  '{"type": "Point", "coordinates": [-1.6150, 6.6800], "address": {"region": "Ashanti", "district": "Kumasi Metro", "city": "Kumasi", "neighborhood": "Asafo"}}',
  'field_survey',
  '{"diseases": [{"name": "Vector-borne diseases", "cases": 29, "trend": "stable"}], "environmentalHealth": {"airQuality": "moderate", "waterQuality": "moderate", "wasteManagement": "fair"}, "riskAssessment": {"overallRisk": "medium", "factors": ["stagnant_water", "waste"]}}',
  '{"plasticReduction": 42.7, "healthImprovement": "stable", "communityEngagement": "medium"}',
  'active', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006',
  NOW() - INTERVAL '4 months', NOW());

-- =============================================
-- DONATIONS (6 donation records)
-- =============================================

INSERT INTO donations (id, donor_id, amount, currency, type, status, payment_method, anonymous, message, created_at, updated_at) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', 500.00, 'GHS', 'one-time', 'completed', 'mobile_money', false, 'Supporting clean environment in Ghana', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 1000.00, 'GHS', 'monthly', 'completed', 'bank_transfer', false, 'Monthly support for plastic collection', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks'),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', 250.00, 'GHS', 'one-time', 'completed', 'mobile_money', true, NULL, NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '3 weeks'),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440010', 750.00, 'GHS', 'quarterly', 'completed', 'credit_card', false, 'Quarterly donation for health initiatives', NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 month'),
('950e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440009', 300.00, 'GHS', 'one-time', 'pending', 'mobile_money', false, 'One-time donation', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('950e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440010', 1000.00, 'GHS', 'monthly', 'completed', 'bank_transfer', false, 'Monthly support', NOW() - INTERVAL '6 weeks', NOW() - INTERVAL '6 weeks');

-- =============================================
-- PAYMENTS (6 payment records linked to donations)
-- =============================================

INSERT INTO payments (id, user_id, donation_id, amount, currency, payment_method, status, transaction_id, metadata, created_at, updated_at) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', '950e8400-e29b-41d4-a716-446655440001', 500.00, 'GHS', 'mobile_money', 'completed', 'MTN-TXN-20251019-001', '{"network": "MTN", "phone": "+233249012345"}', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'),
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', '950e8400-e29b-41d4-a716-446655440002', 1000.00, 'GHS', 'bank_transfer', 'completed', 'BANK-TXN-20251012-001', '{"bank": "GCB", "account": "****5678"}', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks'),
('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', '950e8400-e29b-41d4-a716-446655440003', 250.00, 'GHS', 'mobile_money', 'completed', 'VOD-TXN-20251005-001', '{"network": "Vodafone", "phone": "+233249012345"}', NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '3 weeks'),
('a50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440010', '950e8400-e29b-41d4-a716-446655440004', 750.00, 'GHS', 'credit_card', 'completed', 'CARD-TXN-20250926-001', '{"last4": "1234", "brand": "Visa"}', NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 month'),
('a50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440009', '950e8400-e29b-41d4-a716-446655440005', 300.00, 'GHS', 'mobile_money', 'pending', 'MTN-TXN-20251024-001', '{"network": "MTN", "phone": "+233249012345"}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('a50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440010', '950e8400-e29b-41d4-a716-446655440006', 1000.00, 'GHS', 'bank_transfer', 'completed', 'BANK-TXN-20250914-001', '{"bank": "GCB", "account": "****5678"}', NOW() - INTERVAL '6 weeks', NOW() - INTERVAL '6 weeks');

-- =============================================
-- VOLUNTEERS (5 volunteer applications)
-- =============================================

INSERT INTO volunteers (id, user_id, name, email, phone, opportunity_id, application_status, availability, skills, motivation, assigned_tasks, hours_contributed, status, created_at, updated_at) VALUES
('b50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'Kwesi Appiah', 'kwesi.appiah@example.com', '+233247890123', 'community-cleanup-accra', 'approved', 
  '{"days": ["monday", "wednesday", "saturday"], "timeSlots": ["morning", "afternoon"]}',
  '["community_organizing", "waste_sorting", "public_speaking"]',
  'Passionate about environmental conservation and community health',
  '["organize_collection_drives", "educate_communities"]',
  24, 'active', NOW() - INTERVAL '3 months', NOW()),

('b50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', 'Efua Adjei', 'efua.adjei@example.com', '+233248901234', 'health-education-kumasi', 'approved',
  '{"days": ["tuesday", "thursday", "friday"], "timeSlots": ["afternoon", "evening"]}',
  '["health_education", "communication", "data_collection"]',
  'Want to help improve health awareness in my community',
  '["conduct_health_surveys", "community_education"]',
  18, 'active', NOW() - INTERVAL '2 months', NOW()),

('b50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 'Kwesi Appiah', 'kwesi.appiah@example.com', '+233247890123', 'hub-support-takoradi', 'pending',
  '{"days": ["monday", "tuesday", "wednesday", "thursday", "friday"], "timeSlots": ["morning"]}',
  '["logistics", "organization", "inventory_management"]',
  'Interested in learning about waste management',
  NULL,
  0, 'pending', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'),

('b50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440008', 'Efua Adjei', 'efua.adjei@example.com', '+233248901234', 'data-collection-tamale', 'approved',
  '{"days": ["saturday", "sunday"], "timeSlots": ["morning", "afternoon"]}',
  '["data_entry", "surveying", "mobile_apps"]',
  'Tech-savvy volunteer willing to help with data collection',
  '["field_surveys", "data_entry"]',
  12, 'active', NOW() - INTERVAL '1 month', NOW()),

('b50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007', 'Kwesi Appiah', 'kwesi.appiah@example.com', '+233247890123', 'school-outreach-capecoast', 'rejected',
  '{"days": ["saturday"], "timeSlots": ["morning"]}',
  '["teaching"]',
  'Want to volunteer',
  NULL,
  0, 'inactive', NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 month');

-- =============================================
-- AI INTERACTIONS (10 chat interactions)
-- =============================================

INSERT INTO ai_interactions (id, user_id, type, message, response, metadata, feedback, created_at) VALUES
('c50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'chat', 'What are the best practices for collecting PET bottles?',
  'Here are the best practices for collecting PET bottles: 1) Rinse bottles to remove residue, 2) Remove caps and labels when possible, 3) Crush bottles to save space, 4) Sort by color (clear, green, colored), 5) Store in a clean, dry place away from direct sunlight.',
  '{"language": "en", "location": {"region": "Greater Accra"}}',
  '{"helpful": true, "accuracy": 5, "relevance": 5}',
  NOW() - INTERVAL '2 weeks'),

('c50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'health_analysis', 'What are health risks in my area?',
  'Based on data from Labadi area, the main health concerns are: 1) Respiratory issues (67 cases) linked to poor air quality and plastic burning, 2) Moderate water quality concerns. Recommendations: Avoid burning plastic waste, participate in collection programs, ensure proper waste disposal.',
  '{"language": "en", "location": {"region": "Greater Accra", "neighborhood": "Labadi"}}',
  '{"helpful": true, "accuracy": 4, "relevance": 5}',
  NOW() - INTERVAL '1 week'),

('c50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'collection_advice', 'How can I earn more points?',
  'To earn more points: 1) Collect high-quality plastics (excellent quality = 10x weight in points), 2) Focus on PET and HDPE which are highly recyclable, 3) Submit larger batches, 4) Ensure plastics are clean and sorted, 5) Get verified quickly by delivering to hubs during peak hours.',
  '{"language": "en"}',
  '{"helpful": true, "accuracy": 5, "relevance": 5}',
  NOW() - INTERVAL '5 days'),

('c50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'chat', 'Where is the nearest collection hub?',
  'The nearest hub to your location is Accra Central Hub at Independence Avenue, approximately 2.3 km away. Operating hours: Monday-Friday 8:00-18:00, Saturday 9:00-14:00. Contact: +233302123456.',
  '{"language": "en", "location": {"coordinates": [-0.195, 5.600]}}',
  '{"helpful": true, "accuracy": 5, "relevance": 5}',
  NOW() - INTERVAL '3 days'),

('c50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'insight_request', 'Show my collection statistics',
  'Your statistics: Total collections: 5, Total weight: 114.1 kg, Total points: 1,250, Current level: 5, Average quality: Excellent. You are in the top 5% of collectors! Keep up the great work!',
  '{"language": "en"}',
  '{"helpful": true, "accuracy": 5, "relevance": 5}',
  NOW() - INTERVAL '2 days'),

('c50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', 'chat', 'How do I become a volunteer?',
  'To become a volunteer: 1) Browse opportunities at /api/volunteers/opportunities, 2) Submit an application with your availability and skills, 3) Wait for approval from hub managers, 4) Attend orientation session, 5) Start contributing! Most applications are reviewed within 3-5 days.',
  '{"language": "en"}',
  NULL,
  NOW() - INTERVAL '1 week'),

('c50e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'health_analysis', 'How does plastic affect water quality?',
  'Plastic pollution affects water quality through: 1) Microplastics contaminating water sources, 2) Blocked drainage causing stagnant water and disease vectors, 3) Chemical leaching from plastics into groundwater, 4) Reduced water flow in gutters and streams. Your collection efforts directly help by removing plastics before they reach water bodies!',
  '{"language": "en"}',
  '{"helpful": true, "accuracy": 4, "relevance": 5}',
  NOW() - INTERVAL '4 days'),

('c50e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440009', 'chat', 'What impact has my donation made?',
  'Your donations (Total: 1,050 GHS) have supported: 1) Collection of 2,340 kg of plastic waste, 2) Health education for 450+ community members, 3) Support for 8 active collectors, 4) Improvement in air quality in 2 neighborhoods. Thank you for your generous support!',
  '{"language": "en"}',
  '{"helpful": true, "accuracy": 5, "relevance": 5}',
  NOW() - INTERVAL '3 days'),

('c50e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'collection_advice', 'What plastic types are most valuable?',
  'Most valuable plastic types ranked: 1) PET (clear) - highest recycling value, 2) HDPE - very recyclable, used for many products, 3) PP - good recycling demand, 4) PET (colored) - still valuable but lower than clear, 5) LDPE - acceptable but lower value. Focus on collecting PET and HDPE for maximum points!',
  '{"language": "en"}',
  '{"helpful": true, "accuracy": 5, "relevance": 5}',
  NOW() - INTERVAL '6 days'),

('c50e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440008', 'chat', 'Tell me about malaria prevention',
  'Malaria prevention related to waste management: 1) Remove plastic containers that collect standing water (mosquito breeding sites), 2) Properly dispose of discarded tires and bottles, 3) Keep gutters clear of plastic to ensure water flow, 4) Participate in community cleanup drives. Proper plastic collection reduces mosquito breeding grounds by up to 70%!',
  '{"language": "en"}',
  '{"helpful": true, "accuracy": 4, "relevance": 4}',
  NOW() - INTERVAL '1 day');

-- =============================================
-- ANALYTICS CACHE (for performance)
-- =============================================

INSERT INTO analytics_cache (cache_key, data, expires_at) VALUES
('dashboard_stats_latest', 
  '{"totalCollections": 15, "totalWeight": 295.4, "totalUsers": 10, "activeHubs": 5, "totalDonations": 3800.00, "totalVolunteers": 5, "averageQuality": "good"}'::jsonb,
  NOW() + INTERVAL '1 hour'),

('collection_stats_monthly',
  '{"currentMonth": {"collections": 6, "weight": 82.7, "collectors": 4}, "lastMonth": {"collections": 9, "weight": 212.7, "collectors": 4}, "growth": {"collections": -33.3, "weight": -61.1}}'::jsonb,
  NOW() + INTERVAL '1 hour'),

('health_overview_accra',
  '{"totalRecords": 4, "riskLevels": {"high": 2, "medium": 2, "low": 0}, "topDiseases": ["Respiratory issues", "Diarrhea", "Malaria"], "environmentalScore": 62}'::jsonb,
  NOW() + INTERVAL '30 minutes');

-- =============================================
-- NOTIFICATIONS (sample notifications)
-- =============================================

INSERT INTO notifications (id, user_id, type, title, message, read, metadata, created_at) VALUES
('d50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'collection_verified',
  'Collection Verified!', 'Your collection of 15.5 kg PET has been verified. You earned 155 points!',
  true, '{"collectionId": "750e8400-e29b-41d4-a716-446655440001", "points": 155}'::jsonb,
  NOW() - INTERVAL '1 day'),

('d50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'level_up',
  'Level Up!', 'Congratulations! You have reached Level 5!',
  true, '{"newLevel": 5, "rewards": ["badge", "bonus_points"]}'::jsonb,
  NOW() - INTERVAL '1 week'),

('d50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 'volunteer_approved',
  'Volunteer Application Approved', 'Your application for Community Cleanup has been approved! Check your dashboard for details.',
  false, '{"opportunityId": "community-cleanup-accra"}'::jsonb,
  NOW() - INTERVAL '2 days'),

('d50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440009', 'donation_receipt',
  'Donation Received', 'Thank you for your donation of 500 GHS! Your support helps keep Ghana clean.',
  true, '{"donationId": "950e8400-e29b-41d4-a716-446655440001", "amount": 500}'::jsonb,
  NOW() - INTERVAL '1 week'),

('d50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'collection_verified',
  'Collection Verified!', 'Your collection of 22.3 kg HDPE has been verified. You earned 223 points!',
  false, '{"collectionId": "750e8400-e29b-41d4-a716-446655440002", "points": 223}'::jsonb,
  NOW() - INTERVAL '2 days');

-- =============================================
-- Verification and Summary
-- =============================================

-- Display summary of inserted data
SELECT 
    'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Hubs', COUNT(*) FROM hubs
UNION ALL
SELECT 'Collections', COUNT(*) FROM collections
UNION ALL
SELECT 'Health Data', COUNT(*) FROM health_data
UNION ALL
SELECT 'Donations', COUNT(*) FROM donations
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments
UNION ALL
SELECT 'Volunteers', COUNT(*) FROM volunteers
UNION ALL
SELECT 'AI Interactions', COUNT(*) FROM ai_interactions
UNION ALL
SELECT 'Analytics Cache', COUNT(*) FROM analytics_cache
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;

-- Display user summary
SELECT 
    role,
    COUNT(*) as count,
    SUM(points) as total_points
FROM users
GROUP BY role
ORDER BY role;

-- Display collection summary by hub
SELECT 
    h.name as hub_name,
    COUNT(c.id) as collections,
    ROUND(SUM(c.weight)::numeric, 2) as total_weight_kg,
    SUM(c.points_awarded) as total_points
FROM hubs h
LEFT JOIN collections c ON h.id = c.hub_id
GROUP BY h.name
ORDER BY total_weight_kg DESC;

COMMIT;
