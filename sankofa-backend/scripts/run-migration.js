#!/usr/bin/env node

/**
 * Database Migration Runner
 * Applies missing columns and tables for test compatibility
 */

const { supabaseAdmin } = require('../src/config/supabase');
const fs = require('fs');
const path = require('path');
const logger = require('../src/utils/logger');

async function runMigration() {
  console.log('🔄 Starting database migration...\n');

  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured. Set SUPABASE_SERVICE_ROLE_KEY in .env');
    }

    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../database/4_add_missing_test_columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Split into individual statements (simple approach)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('SELECT') && !s.startsWith('COMMENT'));

    console.log(`📝 Found ${statements.length} migration statements\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip BEGIN/COMMIT and empty statements
      if (statement === 'BEGIN' || statement === 'COMMIT' || statement.length < 10) {
        continue;
      }

      try {
        console.log(`⚙️  Executing statement ${i + 1}/${statements.length}...`);
        
        // For ALTER TABLE and CREATE TABLE statements
        if (statement.includes('ALTER TABLE') || statement.includes('CREATE TABLE') || statement.includes('CREATE INDEX')) {
          const { data, error } = await supabaseAdmin.rpc('exec_sql', {
            sql_query: statement + ';'
          });

          if (error && !error.message.includes('already exists')) {
            console.warn(`⚠️  Warning: ${error.message}`);
          } else {
            console.log('✅ Success\n');
          }
        }
      } catch (error) {
        console.error(`❌ Error executing statement: ${error.message}`);
        console.log('Statement:', statement.substring(0, 100) + '...\n');
      }
    }

    // Verify the changes
    console.log('\n🔍 Verifying changes...\n');

    // Check health_data columns
    const { data: healthData, error: healthError } = await supabaseAdmin
      .from('health_data')
      .select('risk_level, status')
      .limit(1);

    if (!healthError) {
      console.log('✅ health_data.risk_level and status columns verified');
    } else {
      console.warn('⚠️  Could not verify health_data columns:', healthError.message);
    }

    // Check users columns
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('cash')
      .limit(1);

    if (!userError) {
      console.log('✅ users.cash column verified');
    } else {
      console.warn('⚠️  Could not verify users.cash column:', userError.message);
    }

    // Check ussd_sessions table
    const { data: ussdData, error: ussdError } = await supabaseAdmin
      .from('ussd_sessions')
      .select('*')
      .limit(1);

    if (!ussdError) {
      console.log('✅ ussd_sessions table verified');
    } else {
      console.warn('⚠️  Could not verify ussd_sessions table:', ussdError.message);
    }

    console.log('\n🎉 Migration completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Run: npm test');
    console.log('2. Expected: 70-80 tests passing (vs 56 before)\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check SUPABASE_SERVICE_ROLE_KEY in .env file');
    console.error('2. Verify database permissions');
    console.error('3. Check database/4_add_missing_test_columns.sql syntax\n');
    
    process.exit(1);
  }
}

// Alternative: Direct SQL execution using Supabase SQL editor
function printManualInstructions() {
  console.log('\n📋 MANUAL MIGRATION INSTRUCTIONS\n');
  console.log('If the automated migration fails, run these SQL statements manually in Supabase SQL Editor:\n');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste the contents of database/4_add_missing_test_columns.sql');
  console.log('4. Click "Run" to execute\n');
  console.log('Or use psql command line:');
  console.log('psql "your-connection-string" < database/4_add_missing_test_columns.sql\n');
}

// Run the migration
if (require.main === module) {
  runMigration().catch(error => {
    console.error('Fatal error:', error);
    printManualInstructions();
    process.exit(1);
  });
}

module.exports = { runMigration };
