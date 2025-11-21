#!/usr/bin/env node

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const runMigration = async () => {
  try {
    console.log('🚀 Starting database migration...\n');
    console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Schema file loaded');
    console.log(`📊 SQL size: ${(schemaSql.length / 1024).toFixed(2)} KB\n`);

    // Split SQL into individual statements and execute
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements\n`);

    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty lines
      if (statement.startsWith('--') || !statement) {
        skipCount++;
        continue;
      }

      try {
        // Add semicolon if not present
        const fullStatement = statement.endsWith(';') ? statement : statement + ';';
        
        // Execute using rpc function for raw SQL
        // Note: This requires a database function to execute raw SQL
        // For now, we'll show instructions for manual execution
        
        if (statement.includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)?.[1] || 'Unknown';
          console.log(`  ⏳ ${tableName}...`);
        } else if (statement.includes('CREATE INDEX')) {
          const indexName = statement.match(/CREATE INDEX (\w+)/i)?.[1] || 'Unknown';
          console.log(`  ⏳ ${indexName}...`);
        } else if (statement.includes('ALTER TABLE')) {
          const tableName = statement.match(/ALTER TABLE (\w+)/i)?.[1] || 'Unknown';
          console.log(`  ⏳ ALTER ${tableName}...`);
        }
        
        successCount++;
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
      }
    }

    console.log('\n❌ Direct SQL execution not available via JavaScript SDK');
    console.log('ℹ️  Please follow these steps to create the tables:\n');
    
    console.log('📋 Option 1: Using Supabase Dashboard (Recommended)');
    console.log('─────────────────────────────────────────────────────');
    console.log('1. Go to: https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor" in the left sidebar');
    console.log('4. Click "+ New query"');
    console.log('5. Copy the contents of: scripts/schema.sql');
    console.log('6. Paste the SQL and click "Run"\n');

    console.log('📋 Option 2: Using psql command line');
    console.log('─────────────────────────────────────');
    console.log('First, get your connection string from Supabase:');
    console.log('  - Dashboard > Project Settings > Database > Connection string\n');
    console.log('Then run:');
    console.log(`  psql "your-connection-string" < scripts/schema.sql\n`);

    console.log('📋 Option 3: Using Node.js (for future automation)');
    console.log('─────────────────────────────────────────────────');
    console.log('You need to create a database function in Supabase:\n');
    console.log('```sql');
    console.log('CREATE OR REPLACE FUNCTION exec(sql text)');
    console.log('RETURNS TABLE(exec_status text) AS $$');
    console.log('BEGIN');
    console.log('  EXECUTE sql;');
    console.log('  RETURN QUERY SELECT \'OK\'::text;');
    console.log('END;');
    console.log('$$ LANGUAGE plpgsql;');
    console.log('```\n');

    console.log('✨ Schema file location: ./scripts/schema.sql');
    console.log('🔗 Supabase Project: https://app.supabase.com/project/' + (supabaseUrl.match(/supabase\.co\/(\w+)/)?.[1] || 'your-project'));
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
};

runMigration();
