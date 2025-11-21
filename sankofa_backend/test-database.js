// Load environment variables first
require('dotenv').config();

const { supabase } = require('./src/config/supabase');

async function testDatabaseConnection() {
  console.log('\n🔍 Testing Supabase Database Connection...\n');

  try {
    // Test 1: Check hubs table
    console.log('1️⃣  Testing hubs table...');
    const { data: hubs, error: hubsError } = await supabase
      .from('hubs')
      .select('*')
      .limit(5);
    
    if (hubsError) throw hubsError;
    console.log(`   ✅ Hubs table accessible - Found ${hubs.length} hubs`);
    if (hubs.length > 0) {
      console.log(`   📍 Sample hub: ${hubs[0].name} (${hubs[0].city})`);
    }

    // Test 2: Check health_data table
    console.log('\n2️⃣  Testing health_data table...');
    const { data: healthData, error: healthError } = await supabase
      .from('health_data')
      .select('*')
      .limit(5);
    
    if (healthError) throw healthError;
    console.log(`   ✅ Health data table accessible - Found ${healthData.length} records`);
    if (healthData.length > 0) {
      console.log(`   🏥 Sample: ${healthData[0].region} - Risk: ${healthData[0].malaria_risk_level}`);
    }

    // Test 3: Check users table
    console.log('\n3️⃣  Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) throw usersError;
    console.log('   ✅ Users table accessible');

    // Test 4: Check collectors table
    console.log('\n4️⃣  Testing collectors table...');
    const { data: collectors, error: collectorsError } = await supabase
      .from('collectors')
      .select('count')
      .limit(1);
    
    if (collectorsError) throw collectorsError;
    console.log('   ✅ Collectors table accessible');

    // Test 5: Check collections table
    console.log('\n5️⃣  Testing collections table...');
    const { data: collections, error: collectionsError } = await supabase
      .from('collections')
      .select('count')
      .limit(1);
    
    if (collectionsError) throw collectionsError;
    console.log('   ✅ Collections table accessible');

    // Test 6: Check dashboard view
    console.log('\n6️⃣  Testing dashboard_stats view...');
    const { data: dashboardStats, error: dashError } = await supabase
      .from('dashboard_stats')
      .select('*')
      .limit(1);
    
    if (dashError) throw dashError;
    console.log('   ✅ Dashboard stats view working');
    if (dashboardStats && dashboardStats.length > 0) {
      console.log(`   📊 Active hubs: ${dashboardStats[0].active_hubs}`);
      console.log(`   📊 Active users: ${dashboardStats[0].active_users}`);
    }

    console.log('\n✅ ALL TESTS PASSED! Database is ready! 🎉\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Next steps:');
    console.log('   1. Start backend: npm run dev');
    console.log('   2. Start frontend: npm run dev');
    console.log('   3. Test authentication endpoints');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('\n❌ Database connection test failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   - Check your .env file has correct SUPABASE_URL and keys');
    console.error('   - Verify the SQL schema was executed successfully');
    console.error('   - Check Supabase dashboard for any errors\n');
    process.exit(1);
  }
}

// Run the test
testDatabaseConnection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test script error:', error);
    process.exit(1);
  });
