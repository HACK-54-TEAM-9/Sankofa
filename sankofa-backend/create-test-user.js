const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Test credentials you can use in the frontend
const TEST_USER = {
  name: 'Demo User',
  email: 'demo@sankofa.org',
  phone: '+233244567890',
  password: 'Demo123!',
  role: 'collector'
};

async function createTestUser() {
  console.log('\n===========================================');
  console.log('🔧 CREATING TEST USER FOR FRONTEND');
  console.log('===========================================\n');
  
  try {
    console.log('📝 Creating user with credentials:');
    console.log(`   Email: ${TEST_USER.email}`);
    console.log(`   Password: ${TEST_USER.password}`);
    console.log(`   Name: ${TEST_USER.name}`);
    console.log(`   Role: ${TEST_USER.role}\n`);
    
    const response = await axios.post(`${BASE_URL}/register`, TEST_USER);
    
    if (response.data.success) {
      console.log('✅ Test user created successfully!\n');
      console.log('🎯 Use these credentials in the frontend:');
      console.log('┌──────────────────────────────────────┐');
      console.log(`│ Email:    ${TEST_USER.email.padEnd(23)}│`);
      console.log(`│ Password: ${TEST_USER.password.padEnd(23)}│`);
      console.log('└──────────────────────────────────────┘\n');
      console.log('User details:');
      console.log(`   ID: ${response.data.data.user.id}`);
      console.log(`   Status: ${response.data.data.user.status}`);
      console.log(`   Email Verified: ${response.data.data.user.is_email_verified}`);
      console.log(`   Phone Verified: ${response.data.data.user.is_phone_verified}\n`);
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400 && error.response.data.message.includes('already exists')) {
        console.log('ℹ️  Test user already exists!\n');
        console.log('🎯 Use these credentials in the frontend:');
        console.log('┌──────────────────────────────────────┐');
        console.log(`│ Email:    ${TEST_USER.email.padEnd(23)}│`);
        console.log(`│ Password: ${TEST_USER.password.padEnd(23)}│`);
        console.log('└──────────────────────────────────────┘\n');
      } else {
        console.log(`❌ Error: ${error.response.data.message}`);
      }
    } else {
      console.log(`❌ Error: ${error.message}`);
      console.log('\n💡 Make sure the backend is running on http://localhost:5000');
    }
  }
  
  console.log('===========================================\n');
}

createTestUser();
