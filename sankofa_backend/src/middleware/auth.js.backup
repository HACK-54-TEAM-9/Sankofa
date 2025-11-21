const User = require('../models/User');
const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// Protect routes - verify Supabase access token and attach user
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
      const client = supabaseAdmin || supabase;

      // Verify token via Supabase
      const { data, error } = await client.auth.getUser(token);

      if (error || !data || !data.user) {
        logger.warn('Supabase token verification failed', error && error.message);
        return res.status(401).json({ success: false, message: 'Invalid token.' });
      }

      // Lookup application user by auth user id
      const user = await User.findById(data.user.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is valid but user no longer exists.'
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is not active. Please contact support.'
        });
      }

      // Update last login (non-blocking)
      try {
        await user.updateLastLogin();
      } catch (err) {
        logger.warn('Failed to update last login:', err.message);
      }

      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification error:', error.message || error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error.message || error);
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
        const client = supabaseAdmin || supabase;
        const { data, error } = await client.auth.getUser(token);

        if (data && data.user) {
          const user = await User.findById(data.user.id);
          if (user && user.status === 'active') {
            req.user = user;
          }
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        logger.warn('Invalid token in optional auth:', error.message || error);
      }
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error.message || error);
    next(); // Continue even if there's an error
  }
};

// Check if user owns resource or is admin
const checkOwnership = (resourceUserIdField = 'user') => {
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
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('emailVerificationToken', token)
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
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('passwordResetToken', token)
      .single();

    if (error || !data) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.'
      });
    }

    // Check expiration if field exists
    if (data.passwordResetExpires && new Date(data.passwordResetExpires) <= new Date()) {
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

  if (!req.user.isEmailVerified) {
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

  if (!req.user.isPhoneVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your phone number before accessing this resource.'
    });
  }

  next();
};

// Generate new access token using refresh token
const refreshToken = async (req, res, next) => {
  // Supabase manages refresh tokens via its auth client. Server-side refresh handling
  // is not implemented here. Clients should use the Supabase client to refresh sessions.
  return res.status(501).json({
    success: false,
    message: 'Refresh token rotation is handled by Supabase. Please use client-side refresh or implement server-side via Supabase admin APIs.'
  });
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
