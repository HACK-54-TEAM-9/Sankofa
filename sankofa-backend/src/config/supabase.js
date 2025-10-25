const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing required Supabase environment variables');
  logger.error('Required: SUPABASE_URL, SUPABASE_ANON_KEY');
  logger.error('Optional: SUPABASE_SERVICE_ROLE_KEY');
}

// Create Supabase client for general use (with RLS)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Create Supabase client for admin operations (bypasses RLS)
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Database connection test
const testConnection = async () => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    // Test connection by querying a simple table
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (expected in new setup)
      throw error;
    }

    logger.info('✅ Supabase connection successful');
    return true;
  } catch (error) {
    logger.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};

// Health check for Supabase
const healthCheck = async () => {
  try {
    const { data, error } = await supabase
      .from('_health_check')
      .select('*')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return {
      status: 'healthy',
      connected: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Database utilities
const dbUtils = {
  // Convert MongoDB ObjectId format to UUID (for compatibility)
  generateId: () => {
    return crypto.randomUUID();
  },

  // Handle Supabase errors
  handleError: (error) => {
    logger.error('Supabase error:', error);
    
    if (error.code === 'PGRST301') {
      return { message: 'Unauthorized access', status: 401 };
    }
    if (error.code === 'PGRST116') {
      return { message: 'Resource not found', status: 404 };
    }
    if (error.code === '23505') {
      return { message: 'Duplicate entry', status: 409 };
    }
    if (error.code === '23503') {
      return { message: 'Foreign key constraint violation', status: 400 };
    }
    
    return { message: 'Database error', status: 500 };
  },

  // Pagination helper
  paginate: (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return { from, to };
  },

  // Build filters for queries
  buildFilters: (filters = {}) => {
    let query = supabase;
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'object' && value.operator) {
          // Handle operators like { operator: 'gte', value: 10 }
          query = query.filter(key, value.operator, value.value);
        } else {
          query = query.eq(key, value);
        }
      }
    });
    
    return query;
  }
};

module.exports = {
  supabase,
  supabaseAdmin,
  testConnection,
  healthCheck,
  dbUtils
};
