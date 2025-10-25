#!/usr/bin/env node

/**
 * Supabase Database Test Script
 * Tests the connection and basic operations with Supabase
 */

const { supabase, supabaseAdmin, testConnection, healthCheck, dbUtils } = require('../config/supabase');
const logger = require('../utils/logger');

// Test configuration
const TEST_CONFIG = {
  testUser: {
    name: 'Test User',
    email: 'test@sankofacoin.org',
    phone: '+233123456789',
    password: 'testpassword123',
    role: 'collector'
  },
  testHub: {
    name: 'Test Hub',
    code: 'TEST001',
    description: 'Test collection hub',
    location: {
      coordinates: [-0.1870, 5.6037],
      address: {
        street: 'Test Street',
        city: 'Accra',
        region: 'Greater Accra',
        district: 'Accra Metropolitan',
        postalCode: 'GA-001'
      }
    },
    contact: {
      phone: '+233123456789',
      email: 'test@hub.com',
      website: 'https://test.sankofacoin.org'
    }
  }
};

// Test functions
async function testBasicConnection() {
  console.log('🔍 Testing basic Supabase connection...');
  
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('✅ Supabase connection successful');
      return true;
    } else {
      console.log('❌ Supabase connection failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Connection test error:', error.message);
    return false;
  }
}

async function testHealthCheck() {
  console.log('🔍 Testing Supabase health check...');
  
  try {
    const health = await healthCheck();
    console.log('📊 Health status:', health);
    return health.status === 'healthy';
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

async function testUserOperations() {
  console.log('🔍 Testing user operations...');
  
  try {
    // Test creating a user
    console.log('  Creating test user...');
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: dbUtils.generateId(),
        name: TEST_CONFIG.testUser.name,
        email: TEST_CONFIG.testUser.email,
        phone: TEST_CONFIG.testUser.phone,
        password: TEST_CONFIG.testUser.password,
        role: TEST_CONFIG.testUser.role,
        is_email_verified: true,
        is_phone_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (userError) {
      console.log('❌ User creation failed:', userError.message);
      return false;
    }

    console.log('✅ Test user created:', userData.id);

    // Test reading users
    console.log('  Reading users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, role')
      .limit(5);

    if (usersError) {
      console.log('❌ User reading failed:', usersError.message);
      return false;
    }

    console.log('✅ Users read successfully:', users.length, 'users found');

    // Test updating user
    console.log('  Updating test user...');
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        name: 'Updated Test User',
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.id);

    if (updateError) {
      console.log('❌ User update failed:', updateError.message);
      return false;
    }

    console.log('✅ Test user updated successfully');

    // Clean up test user
    console.log('  Cleaning up test user...');
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userData.id);

    if (deleteError) {
      console.log('⚠️  User cleanup failed:', deleteError.message);
    } else {
      console.log('✅ Test user cleaned up');
    }

    return true;
  } catch (error) {
    console.log('❌ User operations error:', error.message);
    return false;
  }
}

async function testHubOperations() {
  console.log('🔍 Testing hub operations...');
  
  try {
    // Test creating a hub
    console.log('  Creating test hub...');
    const { data: hubData, error: hubError } = await supabaseAdmin
      .from('hubs')
      .insert([{
        id: dbUtils.generateId(),
        name: TEST_CONFIG.testHub.name,
        code: TEST_CONFIG.testHub.code,
        description: TEST_CONFIG.testHub.description,
        location: TEST_CONFIG.testHub.location,
        contact: TEST_CONFIG.testHub.contact,
        manager_id: null, // No manager for test
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (hubError) {
      console.log('❌ Hub creation failed:', hubError.message);
      return false;
    }

    console.log('✅ Test hub created:', hubData.id);

    // Test reading hubs
    console.log('  Reading hubs...');
    const { data: hubs, error: hubsError } = await supabase
      .from('hubs')
      .select('id, name, code, status')
      .limit(5);

    if (hubsError) {
      console.log('❌ Hub reading failed:', hubsError.message);
      return false;
    }

    console.log('✅ Hubs read successfully:', hubs.length, 'hubs found');

    // Clean up test hub
    console.log('  Cleaning up test hub...');
    const { error: deleteError } = await supabase
      .from('hubs')
      .delete()
      .eq('id', hubData.id);

    if (deleteError) {
      console.log('⚠️  Hub cleanup failed:', deleteError.message);
    } else {
      console.log('✅ Test hub cleaned up');
    }

    return true;
  } catch (error) {
    console.log('❌ Hub operations error:', error.message);
    return false;
  }
}

async function testCollectionOperations() {
  console.log('🔍 Testing collection operations...');
  
  try {
    // First create a test user and hub
    const userId = dbUtils.generateId();
    const hubId = dbUtils.generateId();

    // Create test user
    await supabaseAdmin.from('users').insert([{
      id: userId,
      name: 'Collection Test User',
      email: 'collection@test.com',
      phone: '+233123456789',
      password: 'testpass',
      role: 'collector',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);

    // Create test hub
    await supabaseAdmin.from('hubs').insert([{
      id: hubId,
      name: 'Collection Test Hub',
      code: 'CT001',
      location: { coordinates: [-0.1870, 5.6037], address: {} },
      contact: { phone: '+233123456789', email: 'test@hub.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);

    // Test creating a collection
    console.log('  Creating test collection...');
    const { data: collectionData, error: collectionError } = await supabaseAdmin
      .from('collections')
      .insert([{
        id: dbUtils.generateId(),
        collector_id: userId,
        hub_id: hubId,
        plastic_type: 'PET',
        weight: 5.5,
        quantity: 10,
        collection_location: {
          type: 'Point',
          coordinates: [-0.1870, 5.6037],
          address: 'Test Location',
          region: 'Greater Accra'
        },
        base_price: 2.0,
        total_amount: 11.0,
        cash_amount: 7.7,
        health_token_amount: 3.3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (collectionError) {
      console.log('❌ Collection creation failed:', collectionError.message);
      return false;
    }

    console.log('✅ Test collection created:', collectionData.id);

    // Test reading collections
    console.log('  Reading collections...');
    const { data: collections, error: collectionsError } = await supabase
      .from('collections')
      .select('id, plastic_type, weight, status')
      .limit(5);

    if (collectionsError) {
      console.log('❌ Collection reading failed:', collectionsError.message);
      return false;
    }

    console.log('✅ Collections read successfully:', collections.length, 'collections found');

    // Clean up test data
    console.log('  Cleaning up test data...');
    await supabaseAdmin.from('collections').delete().eq('id', collectionData.id);
    await supabaseAdmin.from('hubs').delete().eq('id', hubId);
    await supabaseAdmin.from('users').delete().eq('id', userId);

    console.log('✅ Test data cleaned up');

    return true;
  } catch (error) {
    console.log('❌ Collection operations error:', error.message);
    return false;
  }
}

async function testDatabaseFunctions() {
  console.log('🔍 Testing database functions...');
  
  try {
    // Test user stats function
    console.log('  Testing user stats function...');
    const { data: userStats, error: userStatsError } = await supabase
      .rpc('get_user_stats');

    if (userStatsError) {
      console.log('❌ User stats function failed:', userStatsError.message);
      return false;
    }

    console.log('✅ User stats function working:', userStats);

    // Test collection stats function
    console.log('  Testing collection stats function...');
    const { data: collectionStats, error: collectionStatsError } = await supabase
      .rpc('get_collection_stats');

    if (collectionStatsError) {
      console.log('❌ Collection stats function failed:', collectionStatsError.message);
      return false;
    }

    console.log('✅ Collection stats function working:', collectionStats);

    return true;
  } catch (error) {
    console.log('❌ Database functions error:', error.message);
    return false;
  }
}

async function testPagination() {
  console.log('🔍 Testing pagination...');
  
  try {
    const { from, to } = dbUtils.paginate(1, 10);
    console.log('  Pagination range:', { from, to });

    const { data, error } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range(from, to);

    if (error) {
      console.log('❌ Pagination test failed:', error.message);
      return false;
    }

    console.log('✅ Pagination working:', data.length, 'records returned');
    return true;
  } catch (error) {
    console.log('❌ Pagination error:', error.message);
    return false;
  }
}

async function testErrorHandling() {
  console.log('🔍 Testing error handling...');
  
  try {
    // Test invalid query
    const { data, error } = await supabase
      .from('nonexistent_table')
      .select('*');

    if (error) {
      console.log('✅ Error handling working - caught expected error:', error.code);
      return true;
    } else {
      console.log('⚠️  Expected error not caught');
      return false;
    }
  } catch (error) {
    console.log('✅ Error handling working - caught exception:', error.message);
    return true;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Supabase Database Tests...\n');
  
  const tests = [
    { name: 'Basic Connection', fn: testBasicConnection },
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Operations', fn: testUserOperations },
    { name: 'Hub Operations', fn: testHubOperations },
    { name: 'Collection Operations', fn: testCollectionOperations },
    { name: 'Database Functions', fn: testDatabaseFunctions },
    { name: 'Pagination', fn: testPagination },
    { name: 'Error Handling', fn: testErrorHandling }
  ];

  const results = [];
  
  for (const test of tests) {
    console.log(`\n📋 Running ${test.name}...`);
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
      console.log(result ? '✅ PASSED' : '❌ FAILED');
    } catch (error) {
      console.log('❌ FAILED with error:', error.message);
      results.push({ name: test.name, passed: false, error: error.message });
    }
  }

  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} ${result.name}`);
    if (result.error) {
      console.log(`    Error: ${result.error}`);
    }
  });
  
  console.log(`\n🎯 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Supabase database is working correctly.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check your Supabase configuration.');
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = {
  testBasicConnection,
  testHealthCheck,
  testUserOperations,
  testHubOperations,
  testCollectionOperations,
  testDatabaseFunctions,
  testPagination,
  testErrorHandling,
  runAllTests
};
