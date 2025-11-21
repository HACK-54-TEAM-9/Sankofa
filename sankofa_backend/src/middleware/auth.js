const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// Protect routes - verify JWT token and attach user
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      logger.info(`Token verified for user: ${decoded.email}`);

      // Fetch user from database
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        logger.warn('User not found for token:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is not active. Please contact support.'
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.'
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format.'
        });
      }

      logger.error('Token verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', decoded.id)
          .single();

        if (user && user.status === 'active') {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        logger.warn('Invalid token in optional auth:', error.message);
      }
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error.message);
    next(); // Continue even if there's an error
  }
};

// Check if user owns resource or is admin
const checkOwnership = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate first.'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.resource ? req.resource[resourceUserIdField] : req.params.userId;

    if (req.user.id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

// Rate limiting for specific user actions
const userRateLimit = (maxRequests = 10, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user.id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    if (requests.has(userId)) {
      const userRequests = requests.get(userId).filter(time => time > windowStart);
      requests.set(userId, userRequests);
    } else {
      requests.set(userId, []);
    }

    const userRequests = requests.get(userId);

    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    userRequests.push(now);
    next();
  };
};

// Verify email token
const verifyEmailToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Email verification token is required.'
      });
    }

    // Lookup user by email verification token in Supabase
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email_verification_token', token)
      .single();

    if (error || !data) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired email verification token.'
      });
    }

    req.user = data;
    next();
  } catch (error) {
    logger.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during email verification.'
    });
  }
};

// Verify password reset token
const verifyPasswordResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is required.'
      });
    }

    // Lookup user by password reset token and ensure not expired
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('password_reset_token', token)
      .single();

    if (error || !data) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.'
      });
    }

    // Check expiration if field exists
    if (data.password_reset_expires && new Date(data.password_reset_expires) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.'
      });
    }

    req.user = data;
    next();
  } catch (error) {
    logger.error('Password reset verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during password reset verification.'
    });
  }
};

// Check if user has verified email
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please authenticate first.'
    });
  }

  if (!req.user.is_email_verified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address before accessing this resource.'
    });
  }

  next();
};

// Check if user has verified phone
const requirePhoneVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please authenticate first.'
    });
  }

  if (!req.user.is_phone_verified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your phone number before accessing this resource.'
    });
  }

  next();
};

// Generate new access token using refresh token
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Fetch user from database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.'
      });
    }

    // Generate new tokens
    const generateToken = require('../utils/generateToken');
    const newAccessToken = generateToken(user.id, user.email, user.role, '7d');
    const newRefreshToken = generateToken(user.id, user.email, user.role, '30d');

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has expired. Please login again.'
      });
    }

    logger.error('Token refresh error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token.'
    });
  }
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  checkOwnership,
  userRateLimit,
  verifyEmailToken,
  verifyPasswordResetToken,
  requireEmailVerification,
  requirePhoneVerification,
  refreshToken
};
