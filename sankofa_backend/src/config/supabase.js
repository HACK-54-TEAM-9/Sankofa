const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log configuration status on startup
logger.info('Supabase configuration check:', {
  hasUrl: !!supabaseUrl,
  hasAnonKey: !!supabaseKey,
  hasServiceKey: !!supabaseServiceKey,
  url: supabaseUrl || 'MISSING',
  anonKeyPrefix: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'MISSING',
  serviceKeyPrefix: supabaseServiceKey ? supabaseServiceKey.substring(0, 20) + '...' : 'MISSING'
});

// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing required Supabase environment variables');
  logger.error('Required: SUPABASE_URL, SUPABASE_ANON_KEY');
  logger.error('Optional: SUPABASE_SERVICE_ROLE_KEY');
}

// Create Supabase client for general use (with RLS)
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      },
      global: {
        fetch: (...args) => {
          return fetch(...args).catch(err => {
            logger.error('Supabase fetch error:', err.message);
            throw err;
          });
        }
      }
    })
  : null;

// Create Supabase client for admin operations (bypasses RLS)
const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        fetch: (...args) => {
          return fetch(...args).catch(err => {
            logger.error('Supabase admin fetch error:', err.message);
            throw err;
          });
        }
      }
    })
  : null;

// Database connection test with retries
const testConnection = async (retries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!supabaseUrl || !supabaseKey) {
        logger.error('❌ Missing Supabase configuration - cannot connect');
        return false;
      }

      if (!supabase) {
        logger.error('❌ Supabase client not initialized');
        return false;
      }

      logger.info(`🔍 Testing Supabase connection (attempt ${attempt}/${retries})...`);

      // Use admin client if available (bypasses RLS), otherwise use regular client
      const client = supabaseAdmin || supabase;
      
      // Simple connection test with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 10s')), 10000)
      );
      
      const queryPromise = client
        .from('hubs')
        .select('id')
        .limit(1);

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error) {
        logger.warn('Supabase query error:', {
          code: error.code,
          message: error.message,
          attempt: `${attempt}/${retries}`
        });
        
        // If table doesn't exist, that's still a successful connection
        if (error.code === 'PGRST116' || error.code === '42P01') {
          logger.info('✅ Supabase connection successful (table not found is ok)');
          return true;
        }
        
        if (attempt === retries) {
          throw error;
        }
        
        logger.info(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      logger.info('✅ Supabase connection successful', { rowsFound: data?.length || 0 });
      return true;
    } catch (error) {
      if (attempt === retries) {
        logger.error('❌ Supabase connection failed after all retries:', {
          message: error.message,
          name: error.name,
          attempts: retries
        });
        return false;
      }
      
      logger.warn(`⚠️ Attempt ${attempt} failed: ${error.message}. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return false;
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
