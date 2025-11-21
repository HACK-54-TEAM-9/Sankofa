#!/usr/bin/env node

/**
 * Test Data Setup Script
 * Creates admin and test users for running tests
 */

const { supabaseAdmin } = require('../src/config/supabase');
const bcrypt = require('bcryptjs');

const TEST_USERS = [
  {
    email: 'test@example.com',
    phone: '+233244000001',
    name: 'Test Admin',
    password: 'testpassword123',
    role: 'admin',
    status: 'active',
    is_email_verified: true,
    is_phone_verified: true
  },
  {
    email: 'hubmanager@test.com',
    phone: '+233244000002',
    name: 'Test Hub Manager',
    password: 'testpassword123',
    role: 'hub-manager',
    status: 'active',
    is_email_verified: true,
    is_phone_verified: true
  },
  {
    email: 'collector@test.com',
    phone: '+233244000003',
    name: 'Test Collector',
    password: 'testpassword123',
    role: 'collector',
    status: 'active',
    is_email_verified: true,
    is_phone_verified: true,
    cash: 100.00
  },
  {
    email: 'demo@sankofa.org',
    phone: '+233244567890',
    name: 'Demo User',
    password: 'Demo123!',
    role: 'collector',
    status: 'active',
    is_email_verified: true,
    is_phone_verified: true
  }
];

async function setupTestData() {
  console.log('🔄 Setting up test data...\n');

  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not configured');
    console.error('Set SUPABASE_SERVICE_ROLE_KEY in .env file\n');
    process.exit(1);
  }

  let createdCount = 0;
  let existingCount = 0;
  let errorCount = 0;

  for (const user of TEST_USERS) {
    try {
      console.log(`⚙️  Creating ${user.role}: ${user.email}...`);

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Check if user exists
      const { data: existing, error: checkError } = await supabaseAdmin
        .from('users')
        .select('id, email')
        .eq('email', user.email)
        .single();

      if (existing) {
        console.log(`⏭️  User already exists: ${existing.id}\n`);
        existingCount++;
        continue;
      }

      // Create user
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert({
          ...user,
          password: hashedPassword,
          points: 0,
          level: 1,
          total_earnings: 0,
          total_collections: 0,
          total_weight: 0,
          health_tokens: 0,
          profile: {},
          location: {}
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Duplicate
          console.log(`⏭️  User already exists (unique constraint)\n`);
          existingCount++;
        } else {
          throw error;
        }
      } else {
        console.log(`✅ Created: ${data.id}\n`);
        createdCount++;
      }
    } catch (error) {
      console.error(`❌ Error creating ${user.email}:`, error.message, '\n');
      errorCount++;
    }
  }

  console.log('\n📊 Setup Summary:');
  console.log(`✅ Created: ${createdCount}`);
  console.log(`⏭️  Already exist: ${existingCount}`);
  console.log(`❌ Errors: ${errorCount}\n`);

  if (createdCount + existingCount >= TEST_USERS.length - errorCount) {
    console.log('🎉 Test data setup completed!\n');
    console.log('🔑 Test Credentials:');
    console.log('─────────────────────────────────────────');
    TEST_USERS.forEach(user => {
      console.log(`${user.role.toUpperCase().padEnd(15)} | ${user.email.padEnd(25)} | ${user.password}`);
    });
    console.log('─────────────────────────────────────────\n');
    console.log('Next steps:');
    console.log('1. Run: npm test');
    console.log('2. Tests should now pass authentication\n');
  }

  process.exit(errorCount > 0 ? 1 : 0);
}

// Run
if (require.main === module) {
  setupTestData().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { setupTestData };
