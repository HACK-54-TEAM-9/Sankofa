const User = require('../models/User');
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
  const user = await User.findById(req.user.id).select('-password');

  res.json({
    success: true,
    data: { user }
  });
});

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

// @desc    Change password
// @route   PATCH /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin)
const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.getUserStats();
  
  res.json({
    success: true,
    data: { stats }
  });
});

// @desc    Get top users
// @route   GET /api/users/top
// @access  Private
const getTopUsers = asyncHandler(async (req, res) => {
  const { limit = 10, metric = 'collections' } = req.query;
  
  const topUsers = await User.getTopUsers(parseInt(limit), metric);
  
  res.json({
    success: true,
    data: { topUsers }
  });
});

// @desc    Get user activity
// @route   GET /api/users/activity
// @access  Private
const getUserActivity = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const activities = await User.getUserActivity(req.user.id, parseInt(page), parseInt(limit));
  
  res.json({
    success: true,
    data: { activities }
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
  getUserActivity
};
