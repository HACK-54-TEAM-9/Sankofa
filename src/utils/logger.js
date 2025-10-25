const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which logs to print based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define different log formats
const format = winston.format.combine(
  // Add timestamp
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Add colors
  winston.format.colorize({ all: true }),
  // Define the format of the message
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  })
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs', 'rejections.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom logging methods
logger.logRequest = (req, res, responseTime) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  };

  if (res.statusCode >= 400) {
    logger.error('HTTP Request Error', logData);
  } else {
    logger.http('HTTP Request', logData);
  }
};

logger.logError = (error, req = null) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode || 500,
    timestamp: new Date().toISOString()
  };

  if (req) {
    errorData.request = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    };
  }

  logger.error('Application Error', errorData);
};

logger.logDatabaseOperation = (operation, collection, documentId, userId = null) => {
  logger.info('Database Operation', {
    operation,
    collection,
    documentId,
    userId,
    timestamp: new Date().toISOString()
  });
};

logger.logSecurityEvent = (event, details, userId = null, ip = null) => {
  logger.warn('Security Event', {
    event,
    details,
    userId,
    ip,
    timestamp: new Date().toISOString()
  });
};

logger.logPaymentEvent = (event, amount, currency, userId, transactionId = null) => {
  logger.info('Payment Event', {
    event,
    amount,
    currency,
    userId,
    transactionId,
    timestamp: new Date().toISOString()
  });
};

logger.logAIInteraction = (interactionType, userId, processingTime, tokensUsed = null) => {
  logger.info('AI Interaction', {
    interactionType,
    userId,
    processingTime,
    tokensUsed,
    timestamp: new Date().toISOString()
  });
};

logger.logHealthDataUpdate = (location, riskLevel, dataSource, userId = null) => {
  logger.info('Health Data Update', {
    location,
    riskLevel,
    dataSource,
    userId,
    timestamp: new Date().toISOString()
  });
};

logger.logCollectionEvent = (event, collectorId, hubId, weight, amount) => {
  logger.info('Collection Event', {
    event,
    collectorId,
    hubId,
    weight,
    amount,
    timestamp: new Date().toISOString()
  });
};

// Performance monitoring
logger.logPerformance = (operation, duration, metadata = {}) => {
  const level = duration > 5000 ? 'warn' : 'info'; // Warn if operation takes more than 5 seconds
  logger[level]('Performance Metric', {
    operation,
    duration: `${duration}ms`,
    ...metadata,
    timestamp: new Date().toISOString()
  });
};

// Business metrics
logger.logBusinessMetric = (metric, value, metadata = {}) => {
  logger.info('Business Metric', {
    metric,
    value,
    ...metadata,
    timestamp: new Date().toISOString()
  });
};

// Export the logger
module.exports = logger;
