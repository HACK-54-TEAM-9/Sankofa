#!/usr/bin/env node

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  console.error('Please add these to your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log(`📍 URL: ${supabaseUrl}\n`);

    // Test connection by querying a simple count
    const { data, error } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .limit(0);
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    console.log('✅ Supabase connection successful!\n');

    // Get list of existing tables by querying information_schema
    console.log('📊 Checking existing tables...\n');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_relations_size_total');
    
    if (!tablesError && tables && tables.length > 0) {
      console.log(`✅ Found ${tables.length} existing tables:`);
      tables.forEach(table => console.log(`   - ${table.relname}`));
    } else {
      console.log('ℹ️  No tables found or unable to query\n');
      console.log('📝 To create tables, run:');
      console.log('   npm run migrate\n');
      console.log('Or manually execute the SQL from: scripts/schema.sql\n');
      console.log('Steps to migrate:');
      console.log('1. Go to Supabase Dashboard');
      console.log('2. Click "SQL Editor" in left sidebar');
      console.log('3. Click "New query"');
      console.log('4. Copy the contents of scripts/schema.sql');
      console.log('5. Paste and run\n');
    }

    console.log('✨ Database connection test completed!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  }
};

testConnection();
