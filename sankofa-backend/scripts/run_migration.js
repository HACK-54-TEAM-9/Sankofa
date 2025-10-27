const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('Starting migration...\n');

  const migrationFile = path.join(__dirname, 'migration_add_frontend_fields.sql');
  const sql = fs.readFileSync(migrationFile, 'utf8');

  // Split into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && s.length > 10);

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';

    // Extract first line for logging
    const firstLine = statement.split('\n')[0].substring(0, 80);

    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        query: statement
      });

      if (error) {
        console.error(`✗ Statement ${i + 1} FAILED: ${firstLine}...`);
        console.error(`  Error: ${error.message}\n`);
        errors.push({ statement: i + 1, error: error.message, sql: firstLine });
        errorCount++;
      } else {
        console.log(`✓ Statement ${i + 1} SUCCESS: ${firstLine}...`);
        successCount++;
      }
    } catch (err) {
      console.error(`✗ Statement ${i + 1} FAILED: ${firstLine}...`);
      console.error(`  Error: ${err.message}\n`);
      errors.push({ statement: i + 1, error: err.message, sql: firstLine });
      errorCount++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Migration Summary:`);
  console.log(`  Total statements: ${statements.length}`);
  console.log(`  ✓ Succeeded: ${successCount}`);
  console.log(`  ✗ Failed: ${errorCount}`);
  console.log(`${'='.repeat(60)}`);

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(({ statement, error, sql }) => {
      console.log(`  Statement ${statement}: ${sql}...`);
      console.log(`    ${error}`);
    });
  }

  process.exit(errorCount > 0 ? 1 : 0);
}

runMigration().catch(err => {
  console.error('Migration failed with error:', err);
  process.exit(1);
});
