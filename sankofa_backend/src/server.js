// Load environment variables FIRST before any other modules
require('dotenv').config();

const express = require('express');
// const mongoose = require('mongoose'); // Commented out - using Supabase instead
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('express-async-errors');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const collectionRoutes = require('./routes/collections');
const hubRoutes = require('./routes/hubs');
const healthRoutes = require('./routes/health');
const aiRoutes = require('./routes/ai');
const donationRoutes = require('./routes/donations');
const volunteerRoutes = require('./routes/volunteers');
const analyticsRoutes = require('./routes/analytics');
const paymentRoutes = require('./routes/payments');
const messageRoutes = require('./routes/messages');
const ussdRoutes = require('./routes/ussd');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import services
const socketService = require('./services/socketService');
const redisService = require('./services/redisService');
const { testConnection: testSupabaseConnection } = require('./config/supabase');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',  // Vite default port
    'http://localhost:5174',  // Alternative Vite port
    'http://localhost:4173',  // Vite preview port
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/hubs', hubRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ussd', ussdRoutes);

// Socket.IO integration
socketService.initialize(io);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Database connection - Supabase
const connectDB = async () => {
  try {
    // Test Supabase connection
    const isConnected = await testSupabaseConnection();
    
    if (isConnected) {
      logger.info('✅ Supabase database connected successfully');
    } else {
      logger.warn('⚠️ Supabase connection failed - continuing in development mode');
    }
  } catch (error) {
    logger.error('Database connection error:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      logger.warn('Continuing without database connection in development mode');
    }
  }
};

// Redis connection - COMMENTED OUT for development
const connectRedis = async () => {
  // COMMENTED OUT: Redis connection disabled for development
  logger.warn('Redis connection disabled for development - caching will be skipped');
  return;
  
  /* ORIGINAL CODE - COMMENTED OUT
  try {
    const redisTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Redis connection timeout')), 3000)
    );
    await Promise.race([redisService.connect(), redisTimeout]);
    logger.info('Redis Connected');
  } catch (error) {
    logger.warn('Redis connection warning:', error.message);
    // Continue without Redis - it's optional
  }
  */
};

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('HTTP server closed');
    
    // Disconnect from Redis if needed
    try {
      redisService.disconnect();
    } catch (error) {
      logger.warn('Redis disconnect error:', error.message);
    }
    
    logger.info('All connections closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Changed to 0.0.0.0 for deployment

const startServer = async () => {
  try {
    logger.info('Starting server with Supabase database integration');
    
    // Connect to Supabase database
    await connectDB();
    
    // Connect to Redis (optional)
    await connectRedis();
    
    server.listen(PORT, HOST, () => {
      logger.info(`🚀 Sankofa-Coin Backend Server running on ${HOST}:${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Health check: http://${HOST}:${PORT}/health`);
      logger.info(`🗄️  Database: Supabase (PostgreSQL)`);
      logger.info(`⚠️  Development mode: SMS and Email services are disabled`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Only start server if this file is run directly (not imported for tests)
if (require.main === module) {
  startServer();
}

// Export app for testing (without starting the server)
module.exports = app;
