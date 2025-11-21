const logger = require('../utils/logger');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle different types of errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥', err);

    res.status(500).json({
      success: false,
      message: 'Something went wrong!'
    });
  }
};

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

// Handle unhandled routes
const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation error handler
const handleValidationError = (errors) => {
  const formattedErrors = errors.array().map(error => ({
    field: error.param,
    message: error.msg,
    value: error.value
  }));

  return new AppError(`Validation failed: ${formattedErrors.map(e => e.message).join(', ')}`, 400);
};

// Database connection error handler
const handleDatabaseError = (err) => {
  logger.error('Database error:', err);
  
  if (err.name === 'MongoNetworkError') {
    return new AppError('Database connection failed. Please try again later.', 503);
  }
  
  if (err.name === 'MongoTimeoutError') {
    return new AppError('Database operation timed out. Please try again.', 504);
  }
  
  return new AppError('Database error occurred. Please try again later.', 500);
};

// File upload error handler
const handleFileUploadError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large. Please upload a smaller file.', 400);
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files. Please upload fewer files.', 400);
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected file field.', 400);
  }
  
  return new AppError('File upload error. Please try again.', 500);
};

// Rate limit error handler
const handleRateLimitError = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: req.rateLimit?.resetTime || 900 // 15 minutes default
  });
};

// CORS error handler
const handleCORSError = (err, req, res, next) => {
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation. Access denied.'
    });
  }
  next(err);
};

// Security error handler
const handleSecurityError = (err, req, res, next) => {
  if (err.message.includes('helmet')) {
    return res.status(403).json({
      success: false,
      message: 'Security policy violation.'
    });
  }
  next(err);
};

// Payment error handler
const handlePaymentError = (err) => {
  if (err.type === 'card_error') {
    return new AppError('Payment failed: Invalid card information.', 400);
  }
  
  if (err.type === 'invalid_request_error') {
    return new AppError('Payment failed: Invalid request.', 400);
  }
  
  if (err.type === 'api_error') {
    return new AppError('Payment service temporarily unavailable.', 503);
  }
  
  return new AppError('Payment processing failed. Please try again.', 500);
};

// AI service error handler
const handleAIError = (err) => {
  if (err.code === 'insufficient_quota') {
    return new AppError('AI service quota exceeded. Please try again later.', 503);
  }
  
  if (err.code === 'rate_limit_exceeded') {
    return new AppError('AI service rate limit exceeded. Please try again later.', 429);
  }
  
  if (err.code === 'invalid_api_key') {
    return new AppError('AI service configuration error.', 500);
  }
  
  return new AppError('AI service temporarily unavailable.', 503);
};

// Log error details
const logError = (err, req) => {
  const errorInfo = {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  };
  
  logger.error('Error occurred:', errorInfo);
};

// Error response formatter
const formatErrorResponse = (err, req) => {
  const response = {
    success: false,
    message: err.message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };
  
  // Add request ID if available
  if (req.requestId) {
    response.requestId = req.requestId;
  }
  
  // Add error code for client-side handling
  if (err.code) {
    response.code = err.code;
  }
  
  // Add validation errors if available
  if (err.errors) {
    response.errors = err.errors;
  }
  
  return response;
};

module.exports = errorHandler;
module.exports.AppError = AppError;
module.exports.notFound = notFound;
module.exports.asyncHandler = asyncHandler;
module.exports.handleValidationError = handleValidationError;
module.exports.handleDatabaseError = handleDatabaseError;
module.exports.handleFileUploadError = handleFileUploadError;
module.exports.handleRateLimitError = handleRateLimitError;
module.exports.handleCORSError = handleCORSError;
module.exports.handleSecurityError = handleSecurityError;
module.exports.handlePaymentError = handlePaymentError;
module.exports.handleAIError = handleAIError;
module.exports.logError = logError;
module.exports.formatErrorResponse = formatErrorResponse;
