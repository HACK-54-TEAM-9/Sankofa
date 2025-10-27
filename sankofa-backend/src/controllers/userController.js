const bcrypt = require('bcryptjs');
const User = require('../models/User');
const SupabaseUser = require('../models/SupabaseUser');
const redisService = require('../services/redisService');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;
  
  const filters = {};
  if (role) filters.role = role;
  if (search) {
    filters.search = search; // The User.findAll method will handle search logic
  }
  
  const result = await User.findAll(filters, parseInt(page), parseInt(limit));

  res.json({
    success: true,
    data: {
      users: result.users.map(user => user.toPublicProfile()),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.totalPages
      }
    }
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user: user.toPublicProfile() }
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.update(req.body);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user: user.toPublicProfile() }
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.delete();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user: user.toJSON() }
  });
});

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.update(req.body);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: user.toJSON() }
  });
});

// @desc    Change password
// @route   PATCH /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Use SupabaseUser helper for direct password checks and updates
  const userRecord = await SupabaseUser.findById(req.user.id);

  if (!userRecord) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, userRecord.password);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Hash new password
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await SupabaseUser.update(req.user.id, {
    password: hashedPassword
  });

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin)
const getUserStats = asyncHandler(async (req, res) => {
  // Model exposes getStats()
  const stats = await User.getStats();

  res.json({
    success: true,
    data: { stats }
  });
});

// @desc    Get top users
// @route   GET /api/users/top
// @access  Private
const getTopUsers = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const topUsers = await User.getTopUsers(parseInt(limit));
  
  res.json({
    success: true,
    data: { topUsers: topUsers.map(u => u.toPublicProfile()) }
  });
});

// @desc    Get user activity
// @route   GET /api/users/activity
// @access  Private
const getUserActivity = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  // Activity is stored in Redis (if available)
  const activities = await redisService.getUserActivity(req.user.id, parseInt(limit));

  res.json({
    success: true,
    data: { activities }
  });
});

// @desc    Get collector dashboard data
// @route   GET /api/users/collector/dashboard
// @access  Private (Collector)
const getCollectorDashboard = asyncHandler(async (req, res) => {
  // req.user is already populated by the auth middleware
  const user = req.user;

  if (user.role !== 'collector') {
    throw new AppError('Access denied. This endpoint is for collectors only.', 403);
  }

  // Get recent collections for this collector
  const { supabaseAdmin } = require('../config/supabase');
  const { data: collections, error } = await supabaseAdmin
    .from('collections')
    .select('*')
    .eq('collector_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    logger.error('Error fetching collections:', error);
  }

  // Return dashboard data matching edge function format
  res.json({
    totalCollections: user.total_collections || 0,
    totalKg: parseFloat(user.total_weight) || 0,
    earningsGHS: parseFloat(user.total_earnings) || 0,
    healthPoints: user.health_tokens || 0,
    collections: collections || []
  });
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserStats,
  getTopUsers,
  getUserActivity,
  getCollectorDashboard
};
