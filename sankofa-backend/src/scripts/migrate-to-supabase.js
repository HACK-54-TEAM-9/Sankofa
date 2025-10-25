#!/usr/bin/env node

/**
 * Migration Script: MongoDB to Supabase
 * This script helps migrate data from MongoDB to Supabase
 */

const { supabase, supabaseAdmin, dbUtils } = require('../config/supabase');
const logger = require('../utils/logger');

// Migration configuration
const MIGRATION_CONFIG = {
  batchSize: 100, // Process records in batches
  delayBetweenBatches: 1000, // 1 second delay between batches
  dryRun: false, // Set to true to test without making changes
  skipExisting: true, // Skip records that already exist
  logProgress: true // Log progress during migration
};

// Sample data for testing (replace with your actual MongoDB data)
const SAMPLE_DATA = {
  users: [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+233123456789',
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K',
      role: 'collector',
      is_email_verified: true,
      is_phone_verified: true,
      profile: {
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Plastic collector from Accra'
      },
      location: {
        coordinates: [-0.1870, 5.6037],
        address: 'Accra, Ghana'
      },
      health_tokens: 150.50,
      total_earnings: 2500.75,
      total_collections: 45,
      total_weight: 125.5,
      status: 'active'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+233123456790',
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K',
      role: 'hub-manager',
      is_email_verified: true,
      is_phone_verified: true,
      profile: {
        avatar: 'https://example.com/avatar2.jpg',
        bio: 'Hub manager in Kumasi'
      },
      location: {
        coordinates: [-1.6244, 6.6885],
        address: 'Kumasi, Ghana'
      },
      health_tokens: 0,
      total_earnings: 0,
      total_collections: 0,
      total_weight: 0,
      status: 'active'
    }
  ],
  hubs: [
    {
      name: 'Accra Central Hub',
      code: 'AC0001',
      description: 'Main collection hub in Accra Central',
      location: {
        coordinates: [-0.1870, 5.6037],
        address: {
          street: 'Independence Avenue',
          city: 'Accra',
          region: 'Greater Accra',
          district: 'Accra Metropolitan',
          postalCode: 'GA-001'
        }
      },
      contact: {
        phone: '+233123456789',
        email: 'accra@hub.com',
        website: 'https://accra.sankofacoin.org'
      },
      operating_hours: {
        monday: { open: '08:00', close: '18:00', isOpen: true },
        tuesday: { open: '08:00', close: '18:00', isOpen: true },
        wednesday: { open: '08:00', close: '18:00', isOpen: true },
        thursday: { open: '08:00', close: '18:00', isOpen: true },
        friday: { open: '08:00', close: '18:00', isOpen: true },
        saturday: { open: '09:00', close: '15:00', isOpen: true },
        sunday: { open: '09:00', close: '15:00', isOpen: false }
      },
      capacity: {
        dailyWeightLimit: 1000,
        storageCapacity: 5000,
        currentStock: 250
      },
      equipment: {
        weighingScales: 2,
        sortingTables: 3,
        storageContainers: 15,
        hasCompactor: true,
        hasShredder: false
      },
      services: {
        plasticCollection: true,
        weighing: true,
        sorting: true,
        payment: true,
        nhisEnrollment: true,
        healthEducation: false
      },
      pricing: {
        pet: 2.0,
        hdpe: 1.8,
        ldpe: 1.5,
        pp: 1.6,
        ps: 1.2,
        other: 1.0
      },
      status: 'active',
      performance: {
        totalCollections: 150,
        totalWeight: 500.5,
        totalPayments: 150,
        averageDailyWeight: 3.33,
        customerSatisfaction: 4.2,
        lastCollectionDate: new Date().toISOString()
      }
    }
  ],
  collections: [
    {
      plastic_type: 'PET',
      weight: 5.5,
      quantity: 10,
      quality: 'good',
      contamination: 5,
      notes: 'Clean PET bottles from residential area',
      collection_location: {
        type: 'Point',
        coordinates: [-0.1870, 5.6037],
        address: 'Accra Central',
        region: 'Greater Accra',
        district: 'Accra Metropolitan'
      },
      base_price: 2.0,
      quality_multiplier: 1.0,
      total_amount: 11.0,
      cash_amount: 7.7,
      health_token_amount: 3.3,
      status: 'verified',
      payment_method: 'mobile_money',
      payment_reference: 'MTN123456789',
      payment_status: 'completed',
      health_impact: {
        diseasesPrevented: ['Malaria', 'Dengue'],
        riskReduction: 15,
        communityBenefit: 20
      },
      environmental_impact: {
        co2Reduced: 13.75,
        waterSaved: 275,
        energySaved: 27.5
      },
      images: [
        {
          url: 'https://example.com/collection1.jpg',
          caption: 'Collection site photo',
          uploadedAt: new Date().toISOString()
        }
      ]
    }
  ]
};

// Migration functions
async function migrateUsers(usersData) {
  console.log('🔄 Migrating users...');
  
  if (MIGRATION_CONFIG.dryRun) {
    console.log('📝 DRY RUN: Would migrate', usersData.length, 'users');
    return { success: true, count: usersData.length };
  }

  let successCount = 0;
  let errorCount = 0;

  for (const user of usersData) {
    try {
      // Check if user already exists
      if (MIGRATION_CONFIG.skipExisting) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();

        if (existingUser) {
          console.log('⏭️  Skipping existing user:', user.email);
          continue;
        }
      }

      // Prepare user data for Supabase
      const userData = {
        id: dbUtils.generateId(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        role: user.role,
        is_email_verified: user.is_email_verified || false,
        is_phone_verified: user.is_phone_verified || false,
        profile: user.profile || {},
        location: user.location || {},
        health_tokens: user.health_tokens || 0,
        total_earnings: user.total_earnings || 0,
        total_collections: user.total_collections || 0,
        total_weight: user.total_weight || 0,
        status: user.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert user
      const { error } = await supabaseAdmin
        .from('users')
        .insert([userData]);

      if (error) {
        console.error('❌ Error migrating user:', user.email, error.message);
        errorCount++;
      } else {
        successCount++;
        if (MIGRATION_CONFIG.logProgress) {
          console.log('✅ Migrated user:', user.email);
        }
      }

      // Add delay between records
      if (MIGRATION_CONFIG.delayBetweenBatches > 0) {
        await new Promise(resolve => setTimeout(resolve, MIGRATION_CONFIG.delayBetweenBatches));
      }

    } catch (error) {
      console.error('❌ Exception migrating user:', user.email, error.message);
      errorCount++;
    }
  }

  console.log(`📊 Users migration complete: ${successCount} success, ${errorCount} errors`);
  return { success: errorCount === 0, count: successCount, errors: errorCount };
}

async function migrateHubs(hubsData) {
  console.log('🔄 Migrating hubs...');
  
  if (MIGRATION_CONFIG.dryRun) {
    console.log('📝 DRY RUN: Would migrate', hubsData.length, 'hubs');
    return { success: true, count: hubsData.length };
  }

  let successCount = 0;
  let errorCount = 0;

  for (const hub of hubsData) {
    try {
      // Check if hub already exists
      if (MIGRATION_CONFIG.skipExisting) {
        const { data: existingHub } = await supabase
          .from('hubs')
          .select('id')
          .eq('code', hub.code)
          .single();

        if (existingHub) {
          console.log('⏭️  Skipping existing hub:', hub.code);
          continue;
        }
      }

      // Prepare hub data for Supabase
      const hubData = {
        id: dbUtils.generateId(),
        name: hub.name,
        code: hub.code,
        description: hub.description,
        location: hub.location,
        contact: hub.contact,
        manager_id: hub.manager_id || null,
        operating_hours: hub.operating_hours || {},
        capacity: hub.capacity || {},
        equipment: hub.equipment || {},
        services: hub.services || {},
        pricing: hub.pricing || {},
        status: hub.status || 'active',
        performance: hub.performance || {},
        staff: hub.staff || [],
        quality_standards: hub.quality_standards || {},
        health_safety: hub.health_safety || {},
        environmental_impact: hub.environmental_impact || {},
        images: hub.images || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert hub
      const { error } = await supabaseAdmin
        .from('hubs')
        .insert([hubData]);

      if (error) {
        console.error('❌ Error migrating hub:', hub.code, error.message);
        errorCount++;
      } else {
        successCount++;
        if (MIGRATION_CONFIG.logProgress) {
          console.log('✅ Migrated hub:', hub.code);
        }
      }

      // Add delay between records
      if (MIGRATION_CONFIG.delayBetweenBatches > 0) {
        await new Promise(resolve => setTimeout(resolve, MIGRATION_CONFIG.delayBetweenBatches));
      }

    } catch (error) {
      console.error('❌ Exception migrating hub:', hub.code, error.message);
      errorCount++;
    }
  }

  console.log(`📊 Hubs migration complete: ${successCount} success, ${errorCount} errors`);
  return { success: errorCount === 0, count: successCount, errors: errorCount };
}

async function migrateCollections(collectionsData) {
  console.log('🔄 Migrating collections...');
  
  if (MIGRATION_CONFIG.dryRun) {
    console.log('📝 DRY RUN: Would migrate', collectionsData.length, 'collections');
    return { success: true, count: collectionsData.length };
  }

  let successCount = 0;
  let errorCount = 0;

  for (const collection of collectionsData) {
    try {
      // Prepare collection data for Supabase
      const collectionData = {
        id: dbUtils.generateId(),
        collector_id: collection.collector_id || null,
        hub_id: collection.hub_id || null,
        plastic_type: collection.plastic_type,
        weight: collection.weight,
        quantity: collection.quantity,
        quality: collection.quality || 'good',
        contamination: collection.contamination || 0,
        notes: collection.notes,
        collection_location: collection.collection_location,
        base_price: collection.base_price,
        quality_multiplier: collection.quality_multiplier || 1.0,
        total_amount: collection.total_amount,
        cash_amount: collection.cash_amount,
        health_token_amount: collection.health_token_amount,
        status: collection.status || 'pending',
        verification_date: collection.verification_date,
        processed_date: collection.processed_date,
        paid_date: collection.paid_date,
        verified_by: collection.verified_by || null,
        verification_notes: collection.verification_notes,
        rejection_reason: collection.rejection_reason,
        payment_method: collection.payment_method || 'mobile_money',
        payment_reference: collection.payment_reference,
        payment_status: collection.payment_status || 'pending',
        health_impact: collection.health_impact || {},
        environmental_impact: collection.environmental_impact || {},
        images: collection.images || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert collection
      const { error } = await supabaseAdmin
        .from('collections')
        .insert([collectionData]);

      if (error) {
        console.error('❌ Error migrating collection:', collection.id, error.message);
        errorCount++;
      } else {
        successCount++;
        if (MIGRATION_CONFIG.logProgress) {
          console.log('✅ Migrated collection:', collection.id);
        }
      }

      // Add delay between records
      if (MIGRATION_CONFIG.delayBetweenBatches > 0) {
        await new Promise(resolve => setTimeout(resolve, MIGRATION_CONFIG.delayBetweenBatches));
      }

    } catch (error) {
      console.error('❌ Exception migrating collection:', collection.id, error.message);
      errorCount++;
    }
  }

  console.log(`📊 Collections migration complete: ${successCount} success, ${errorCount} errors`);
  return { success: errorCount === 0, count: successCount, errors: errorCount };
}

// Main migration function
async function runMigration() {
  console.log('🚀 Starting MongoDB to Supabase Migration...\n');
  
  // Check connection
  console.log('🔍 Testing Supabase connection...');
  const isConnected = await require('../config/supabase').testConnection();
  if (!isConnected) {
    console.error('❌ Supabase connection failed. Please check your configuration.');
    process.exit(1);
  }
  console.log('✅ Supabase connection successful\n');

  // Migration results
  const results = {
    users: { success: false, count: 0, errors: 0 },
    hubs: { success: false, count: 0, errors: 0 },
    collections: { success: false, count: 0, errors: 0 }
  };

  try {
    // Migrate users
    if (SAMPLE_DATA.users && SAMPLE_DATA.users.length > 0) {
      results.users = await migrateUsers(SAMPLE_DATA.users);
    }

    // Migrate hubs
    if (SAMPLE_DATA.hubs && SAMPLE_DATA.hubs.length > 0) {
      results.hubs = await migrateHubs(SAMPLE_DATA.hubs);
    }

    // Migrate collections
    if (SAMPLE_DATA.collections && SAMPLE_DATA.collections.length > 0) {
      results.collections = await migrateCollections(SAMPLE_DATA.collections);
    }

    // Summary
    console.log('\n📊 Migration Summary:');
    console.log('====================');
    
    Object.entries(results).forEach(([table, result]) => {
      const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
      console.log(`${status} ${table}: ${result.count} records, ${result.errors} errors`);
    });

    const totalSuccess = Object.values(results).reduce((sum, result) => sum + result.count, 0);
    const totalErrors = Object.values(results).reduce((sum, result) => sum + result.errors, 0);
    
    console.log(`\n🎯 Total: ${totalSuccess} records migrated, ${totalErrors} errors`);
    
    if (totalErrors === 0) {
      console.log('🎉 Migration completed successfully!');
    } else {
      console.log('⚠️  Migration completed with errors. Please review the logs.');
    }

  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  }
}

// Configuration helpers
function setDryRun(enabled) {
  MIGRATION_CONFIG.dryRun = enabled;
  console.log('🔧 Dry run mode:', enabled ? 'ENABLED' : 'DISABLED');
}

function setSkipExisting(enabled) {
  MIGRATION_CONFIG.skipExisting = enabled;
  console.log('🔧 Skip existing records:', enabled ? 'ENABLED' : 'DISABLED');
}

function setBatchSize(size) {
  MIGRATION_CONFIG.batchSize = size;
  console.log('🔧 Batch size set to:', size);
}

function setDelay(delay) {
  MIGRATION_CONFIG.delayBetweenBatches = delay;
  console.log('🔧 Delay between batches set to:', delay, 'ms');
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  args.forEach(arg => {
    if (arg === '--dry-run') setDryRun(true);
    if (arg === '--no-skip-existing') setSkipExisting(false);
    if (arg.startsWith('--batch-size=')) setBatchSize(parseInt(arg.split('=')[1]));
    if (arg.startsWith('--delay=')) setDelay(parseInt(arg.split('=')[1]));
    if (arg === '--help') {
      console.log(`
Usage: node src/scripts/migrate-to-supabase.js [options]

Options:
  --dry-run              Test migration without making changes
  --no-skip-existing     Don't skip existing records
  --batch-size=N         Set batch size (default: 100)
  --delay=N              Set delay between batches in ms (default: 1000)
  --help                 Show this help message

Examples:
  node src/scripts/migrate-to-supabase.js --dry-run
  node src/scripts/migrate-to-supabase.js --batch-size=50 --delay=500
      `);
      process.exit(0);
    }
  });

  runMigration().catch(error => {
    console.error('💥 Migration runner failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runMigration,
  migrateUsers,
  migrateHubs,
  migrateCollections,
  setDryRun,
  setSkipExisting,
  setBatchSize,
  setDelay
};
