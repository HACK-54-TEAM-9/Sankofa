#!/usr/bin/env node

/**
 * Simple Database Migration Runner
 * Adds missing columns and tables one by one
 */

const { supabaseAdmin } = require('../src/config/supabase');

async function runSimpleMigration() {
  console.log('🔄 Starting database migration...\n');

  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not configured');
    console.error('Set SUPABASE_SERVICE_ROLE_KEY in .env file\n');
    process.exit(1);
  }

  const migrations = [
    {
      name: 'Add risk_level to health_data',
      sql: `ALTER TABLE health_data ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'low'`
    },
    {
      name: 'Add cash to users',
      sql: `ALTER TABLE users ADD COLUMN IF NOT EXISTS cash DECIMAL(10,2) DEFAULT 0`
    },
    {
      name: 'Create ussd_sessions table',
      sql: `
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
        )
      `
    },
    {
      name: 'Create index on ussd_sessions.phone_number',
      sql: `CREATE INDEX IF NOT EXISTS idx_ussd_sessions_phone ON ussd_sessions(phone_number)`
    },
    {
      name: 'Create index on ussd_sessions.expires_at',
      sql: `CREATE INDEX IF NOT EXISTS idx_ussd_sessions_expires ON ussd_sessions(expires_at)`
    },
    {
      name: 'Create index on health_data.risk_level',
      sql: `CREATE INDEX IF NOT EXISTS idx_health_data_risk_level ON health_data(risk_level)`
    },
    {
      name: 'Create index on users.cash',
      sql: `CREATE INDEX IF NOT EXISTS idx_users_cash ON users(cash)`
    }
  ];

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const migration of migrations) {
    try {
      console.log(`⚙️  ${migration.name}...`);
      
      // Use the SQL endpoint directly
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ query: migration.sql })
      });

      if (response.ok) {
        console.log('✅ Success\n');
        successCount++;
      } else {
        const error = await response.text();
        if (error.includes('already exists') || error.includes('duplicate')) {
          console.log('⏭️  Already exists (skipped)\n');
          skipCount++;
        } else {
          console.error('❌ Error:', error, '\n');
          errorCount++;
        }
      }
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⏭️  Already exists (skipped)\n');
        skipCount++;
      } else {
        console.error('❌ Error:', error.message, '\n');
        errorCount++;
      }
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`⏭️  Skipped: ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}\n`);

  if (errorCount > 0) {
    console.log('⚠️  Some migrations failed. You may need to run them manually in Supabase SQL Editor.\n');
    console.log('📋 Manual Steps:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Copy contents of database/4_add_missing_test_columns.sql');
    console.log('3. Execute the SQL\n');
  } else {
    console.log('🎉 All migrations completed successfully!\n');
    console.log('Next steps:');
    console.log('Run: npm test');
    console.log('Expected: 70-80 tests passing\n');
  }

  process.exit(errorCount > 0 ? 1 : 0);
}

// Run
if (require.main === module) {
  runSimpleMigration().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { runSimpleMigration };
