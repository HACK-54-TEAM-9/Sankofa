const express = require('express');
const { body } = require('express-validator');
const {
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
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const userUpdateValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .matches(/^\+233\d{9}$/)
    .withMessage('Please provide a valid Ghana phone number')
];

const passwordChangeValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
];

// All routes are protected
router.use(protect);

// Collector-specific routes
router.get('/collector/dashboard', asyncHandler(getCollectorDashboard));

// User management routes
router.get('/', authorize('admin'), asyncHandler(getUsers));
router.get('/stats', authorize('admin'), asyncHandler(getUserStats));
router.get('/top', asyncHandler(getTopUsers));
router.get('/profile', asyncHandler(getUserProfile));
router.get('/activity', asyncHandler(getUserActivity));
router.get('/:id', asyncHandler(getUserById));
router.put('/profile', userUpdateValidation, asyncHandler(updateUserProfile));
router.put('/:id', authorize('admin'), userUpdateValidation, asyncHandler(updateUser));
router.patch('/change-password', passwordChangeValidation, asyncHandler(changePassword));
router.delete('/:id', authorize('admin'), asyncHandler(deleteUser));

module.exports = router;