const SupabaseUser = require('../models/SupabaseUser');
const { AppError } = require('./errorHandler');
const logger = require('../utils/logger');
const { supabase } = require('../config/supabase');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token with Supabase
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data || !data.user) {
        logger.warn('Supabase token verification failed', error && error.message);
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      // Get user from database
      const user = await SupabaseUser.findById(data.user.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification error:', error.message || error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Authorize by role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized for this resource`
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await SupabaseUser.findById(decoded.id);

        if (user) {
          req.user = user;
        }
      } catch (error) {
        logger.debug('Optional auth token invalid, continuing without auth');
        // Continue without auth
      }
    }

    next();

  } catch (error) {
    logger.error('Optional auth error:', error);
    next();
  }
};

// Check ownership
const checkOwnership = (req, res, next) => {
  const resourceOwnerId = req.params.id || req.body.user_id;

  if (req.user.id !== resourceOwnerId && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this resource'
    });
  }

  next();
};

// Authenticate with Supabase - alternative method using Supabase Auth
const authenticateSupabase = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    // Verify with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Get full user profile from database
    const userProfile = await SupabaseUser.findById(user.id);

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    req.user = userProfile;
    next();

  } catch (error) {
    logger.error('Supabase auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  checkOwnership,
  authenticateSupabase,
  // Aliases for compatibility
  authorizeRole: authorize,
  requireAdmin: (req, res, next) => authorize('admin')(req, res, next),
  requireHubManager: (req, res, next) => authorize('hub-manager', 'admin')(req, res, next),
  requireCollector: (req, res, next) => authorize('collector', 'hub-manager', 'volunteer', 'donor', 'admin')(req, res, next)
};
