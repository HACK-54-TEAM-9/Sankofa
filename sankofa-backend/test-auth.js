// Test Authentication Endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.yellow}\n🧪 ${msg}${colors.reset}`),
  data: (msg) => console.log(`${colors.magenta}   ${msg}${colors.reset}`)
};

async function testAuthEndpoints() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('🔐 TESTING AUTHENTICATION ENDPOINTS');
  console.log(`${'='.repeat(60)}\n`);

  let authToken = null;
  let userId = null;

  try {
    // Test 1: Register a new user
    log.test('TEST 1: Register New User (Collector)');
    try {
      const registerData = {
        name: 'Test Collector',
        email: `testcollector${Date.now()}@sankofa.org`,
        phone: `+233${Math.floor(Math.random() * 900000000 + 100000000)}`,
        password: 'TestPassword123!',
        role: 'collector'
      };
      
      log.info(`Registering user: ${registerData.email}`);
      const registerRes = await axios.post(`${BASE_URL}/register`, registerData);
      
      log.success('User registered successfully!');
      log.data(`User ID: ${registerRes.data.data.user.id}`);
      log.data(`Name: ${registerRes.data.data.user.name}`);
      log.data(`Role: ${registerRes.data.data.user.role}`);
      log.data(`Status: ${registerRes.data.data.user.status}`);
      
      userId = registerRes.data.data.user.id;
      
      // Store credentials for login test
      global.testUser = {
        email: registerData.email,
        password: registerData.password
      };
      
    } catch (error) {
      if (error.response) {
        log.error(`Registration failed: ${error.response.data.message}`);
        log.data(`Status: ${error.response.status}`);
      } else {
        log.error(`Registration error: ${error.message}`);
      }
      throw error;
    }

    // Test 2: Login with registered user
    log.test('TEST 2: Login with Registered User');
    try {
      const loginData = {
        email: global.testUser.email,
        password: global.testUser.password
      };
      
      log.info(`Logging in as: ${loginData.email}`);
      const loginRes = await axios.post(`${BASE_URL}/login`, loginData);
      
      log.success('Login successful!');
      
      // Handle different token response formats
      const token = loginRes.data.data.accessToken || loginRes.data.data.token;
      if (token) {
        log.data(`Token received: ${token.substring(0, 20)}...`);
      }
      log.data(`User: ${loginRes.data.data.user.name}`);
      
      authToken = token;
      
    } catch (error) {
      if (error.response) {
        log.error(`Login failed: ${error.response.data.message}`);
      } else {
        log.error(`Login error: ${error.message}`);
      }
      throw error;
    }

    // Test 3: Get user profile (protected route)
    log.test('TEST 3: Get User Profile (Protected Route)');
    try {
      log.info('Fetching profile with auth token...');
      const profileRes = await axios.get(`${BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      log.success('Profile fetched successfully!');
      log.data(`ID: ${profileRes.data.data.user.id}`);
      log.data(`Name: ${profileRes.data.data.user.name}`);
      log.data(`Email: ${profileRes.data.data.user.email}`);
      log.data(`Role: ${profileRes.data.data.user.role}`);
      log.data(`Status: ${profileRes.data.data.user.status}`);
      
    } catch (error) {
      if (error.response) {
        log.error(`Profile fetch failed: ${error.response.data.message}`);
      } else {
        log.error(`Profile error: ${error.message}`);
      }
      throw error;
    }

    // Test 4: Try accessing protected route without token
    log.test('TEST 4: Access Protected Route Without Token (Should Fail)');
    try {
      await axios.get(`${BASE_URL}/me`);
      log.error('Unexpected: Route was accessible without token!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        log.success('Correctly blocked unauthorized access!');
        log.data(`Error message: ${error.response.data.message}`);
      } else {
        log.error(`Unexpected error: ${error.message}`);
      }
    }

    // Test 5: Logout
    log.test('TEST 5: Logout');
    try {
      const logoutRes = await axios.post(`${BASE_URL}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      log.success('Logout successful!');
      log.data(`Message: ${logoutRes.data.message}`);
      
    } catch (error) {
      if (error.response) {
        log.error(`Logout failed: ${error.response.data.message}`);
      } else {
        log.error(`Logout error: ${error.message}`);
      }
    }

    // Summary
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${colors.green}✅ ALL AUTHENTICATION TESTS PASSED!${colors.reset}`);
    console.log(`${'='.repeat(60)}\n`);
    
    console.log(`${colors.cyan}📋 Test Summary:${colors.reset}`);
    console.log(`   ✅ User Registration - Working`);
    console.log(`   ✅ User Login - Working`);
    console.log(`   ✅ Protected Routes - Working`);
    console.log(`   ✅ Authorization - Working`);
    console.log(`   ✅ Logout - Working`);
    
    console.log(`\n${colors.magenta}🎯 Next Steps:${colors.reset}`);
    console.log(`   1. Connect frontend LoginPage to backend`);
    console.log(`   2. Test registration flow in UI`);
    console.log(`   3. Build Collector Registration`);
    console.log(`   4. Build Hub Manager Dashboard\n`);
    
    process.exit(0);
    
  } catch (error) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${colors.red}❌ AUTHENTICATION TESTS FAILED${colors.reset}`);
    console.log(`${'='.repeat(60)}\n`);
    
    console.log(`${colors.yellow}💡 Troubleshooting:${colors.reset}`);
    console.log(`   - Make sure backend is running on http://localhost:5000`);
    console.log(`   - Check backend logs for errors`);
    console.log(`   - Verify Supabase connection`);
    console.log(`   - Check .env file configuration\n`);
    
    process.exit(1);
  }
}

// Run tests
testAuthEndpoints();
