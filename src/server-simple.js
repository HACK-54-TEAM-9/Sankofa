const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
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
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    message: 'Sankofa-Coin Backend is running!'
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Sankofa-Coin Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      collections: '/api/collections',
      hubs: '/api/hubs',
      health: '/api/health',
      ai: '/api/ai',
      donations: '/api/donations',
      volunteers: '/api/volunteers',
      analytics: '/api/analytics',
      payments: '/api/payments'
    }
  });
});

// Mock authentication routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication
  if (email && password) {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '1',
        name: 'Test User',
        email: email,
        role: 'collector'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Mock registration
  if (name && email && password) {
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '1',
        name: name,
        email: email,
        role: role || 'collector'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    });
  }
});

// Mock collection routes
app.get('/api/collections', (req, res) => {
  res.json({
    success: true,
    data: {
      collections: [
        {
          id: '1',
          weight: 10.5,
          plasticType: ['PET', 'HDPE'],
          location: 'Accra Central',
          earnings: {
            cash: 70,
            healthTokens: 30
          },
          status: 'verified',
          createdAt: new Date().toISOString()
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1
      }
    }
  });
});

app.post('/api/collections', (req, res) => {
  const { weight, plasticType, location } = req.body;
  
  if (weight && plasticType && location) {
    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: {
        collection: {
          id: Date.now().toString(),
          weight,
          plasticType,
          location,
          earnings: {
            cash: weight * 7,
            healthTokens: weight * 3
          },
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Weight, plastic type, and location are required'
    });
  }
});

// Mock health insights
app.get('/api/health/insights', (req, res) => {
  res.json({
    success: true,
    data: {
      healthData: [
        {
          location: 'Accra Central',
          riskLevel: 'Medium',
          plasticAccumulation: 150,
          healthIssues: [
            {
              disease: 'Malaria',
              cases: 25,
              trend: 'decreasing'
            }
          ],
          preventiveTips: [
            {
              category: 'General',
              tips: ['Stay hydrated', 'Wear protective gear']
            }
          ]
        }
      ]
    }
  });
});

// Mock AI chat
app.post('/api/ai/chat', (req, res) => {
  const { message } = req.body;
  
  if (message) {
    res.json({
      success: true,
      data: {
        response: `AI Response to: "${message}". This is a mock response from the Sankofa AI assistant.`,
        interactionId: Date.now().toString()
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Message is required'
    });
  }
});

// Mock analytics
app.get('/api/analytics/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      stats: {
        totalCollections: 1250,
        totalWeight: 12500,
        totalEarnings: 25000,
        activeCollectors: 150,
        totalHubs: 25,
        healthTokensIssued: 7500,
        totalDonations: 50000,
        activeVolunteers: 75
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Sankofa-Coin Backend Server running on ${HOST}:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://${HOST}:${PORT}/health`);
  console.log(`🔗 API docs: http://${HOST}:${PORT}/api`);
});

module.exports = app;
