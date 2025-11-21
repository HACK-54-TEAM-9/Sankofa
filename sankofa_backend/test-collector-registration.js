const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test credentials
const TEST_USER = {
  email: 'demo@sankofa.org',
  password: 'Demo123!'
};

// Test collector data
const TEST_COLLECTOR = {
  collectorId: `COL${Date.now().toString().slice(-8)}`,
  cardNumber: Math.floor(100000 + Math.random() * 900000).toString(),
  fullName: 'Test Collector ' + Date.now().toString().slice(-4),
  phoneNumber: `0244${Math.floor(100000 + Math.random() * 900000)}`,
  hasPhone: 'yes',
  emergencyContact: '0244123456',
  neighborhood: 'Accra Central',
  landmark: 'Near the big market',
  preferredLanguage: 'Twi',
  canRead: 'no',
  photo: null,
  physicalIdNumber: null,
  notes: 'Test registration from backend',
  registeredBy: null, // Will be filled after login
  registrationDate: new Date().toISOString()
};

async function testCollectorRegistration() {
  console.log('\n===========================================');
  console.log('🧪 TESTING COLLECTOR REGISTRATION');
  console.log('===========================================\n');

  let token;
  let hubId;

  try {
    // Step 1: Login
    console.log('📝 Step 1: Logging in as hub manager...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, TEST_USER);
    
    if (loginRes.data.success) {
      token = loginRes.data.data.accessToken;
      console.log('✅ Login successful!\n');
    } else {
      throw new Error('Login failed');
    }

    // Step 2: Get hubs
    console.log('📝 Step 2: Fetching available hubs...');
    const hubsRes = await axios.get(`${BASE_URL}/hubs`);
    
    if (hubsRes.data.success && hubsRes.data.data.length > 0) {
      hubId = hubsRes.data.data[0].id;
      console.log(`✅ Found hub: ${hubsRes.data.data[0].name} (ID: ${hubId})\n`);
    } else {
      throw new Error('No hubs found');
    }

    // Step 3: Register collector
    console.log('📝 Step 3: Registering new collector...');
    console.log(`   Name: ${TEST_COLLECTOR.fullName}`);
    console.log(`   Phone: ${TEST_COLLECTOR.phoneNumber}`);
    console.log(`   Card #: ${TEST_COLLECTOR.cardNumber}`);
    console.log(`   Neighborhood: ${TEST_COLLECTOR.neighborhood}\n`);

    const registerRes = await axios.post(
      `${BASE_URL}/hubs/${hubId}/register-collector-full`,
      TEST_COLLECTOR,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (registerRes.data.success) {
      console.log('✅ Collector registered successfully!\n');
      console.log('📋 Collector Details:');
      console.log('┌──────────────────────────────────────────────┐');
      console.log(`│ ID:           ${registerRes.data.data.id}      │`);
      console.log(`│ Name:         ${registerRes.data.data.full_name.padEnd(29)}│`);
      console.log(`│ Card Number:  ${registerRes.data.data.card_number.padEnd(29)}│`);
      console.log(`│ Phone:        ${registerRes.data.data.phone.padEnd(29)}│`);
      console.log(`│ Neighborhood: ${registerRes.data.data.neighborhood.padEnd(29)}│`);
      console.log(`│ Language:     ${registerRes.data.data.preferred_language.padEnd(29)}│`);
      console.log(`│ Can Read:     ${registerRes.data.data.can_read.padEnd(29)}│`);
      console.log(`│ Status:       ${registerRes.data.data.status.padEnd(29)}│`);
      console.log('└──────────────────────────────────────────────┘\n');
    }

    // Step 4: Try to register with duplicate phone
    console.log('📝 Step 4: Testing duplicate phone detection...');
    try {
      const duplicateCollector = {
        ...TEST_COLLECTOR,
        collectorId: `COL${Date.now().toString().slice(-8)}`,
        cardNumber: Math.floor(100000 + Math.random() * 900000).toString(),
        fullName: 'Duplicate Test'
      };

      await axios.post(
        `${BASE_URL}/hubs/${hubId}/register-collector-full`,
        duplicateCollector,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('❌ Duplicate detection FAILED - should have rejected duplicate phone\n');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Duplicate phone correctly detected and rejected!\n');
        console.log(`   Error message: "${error.response.data.message}"\n`);
      } else {
        console.log('⚠️  Unexpected error during duplicate test\n');
      }
    }

    console.log('===========================================');
    console.log('✅ ALL COLLECTOR REGISTRATION TESTS PASSED!');
    console.log('===========================================\n');

  } catch (error) {
    console.log('\n===========================================');
    console.log('❌ TEST FAILED');
    console.log('===========================================\n');

    if (error.response) {
      console.log('Error Details:');
      console.log(`  Status: ${error.response.status}`);
      console.log(`  Message: ${error.response.data.message || error.response.data.error}`);
      if (error.response.data.error) {
        console.log(`  Error: ${JSON.stringify(error.response.data.error, null, 2)}`);
      }
    } else {
      console.log(`Error: ${error.message}`);
    }

    console.log('\n💡 Troubleshooting:');
    console.log('   - Make sure backend is running on http://localhost:5000');
    console.log('   - Check that database migration was run in Supabase');
    console.log('   - Verify test user exists (demo@sankofa.org)');
    console.log('   - Check backend logs for errors\n');

    process.exit(1);
  }
}

testCollectorRegistration();
