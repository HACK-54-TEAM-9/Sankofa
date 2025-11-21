const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  deleteAccount,
  verifyEmail,
  verifyPhone,
  resendVerification,
  resendPhoneVerification,
  forgotPassword,
  resetPassword,
  refreshToken
} = require('../controllers/supabaseAuthController');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const validate = require('../middleware/validate');

const router = express.Router();

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth API endpoint',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      logout: 'POST /api/auth/logout',
      profile: 'GET /api/auth/me'
    }
  });
});

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^\+233\d{9}$/)
    .withMessage('Please provide a valid Ghana phone number (+233XXXXXXXXX)'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['collector', 'hub-manager', 'volunteer', 'donor'])
    .withMessage('Invalid role selected')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updatePasswordValidation = [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const phoneVerificationValidation = [
  body('code')
    .isLength({ min: 4, max: 6 })
    .isNumeric()
    .withMessage('Verification code must be 4-6 digits')
];

// Public routes
router.post('/register', registerValidation, validate, asyncHandler(register));
router.post('/login', loginValidation, validate, asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.post('/forgot-password', forgotPasswordValidation, validate, asyncHandler(forgotPassword));
router.post('/reset-password', resetPasswordValidation, validate, asyncHandler(resetPassword));
router.get('/verify-email', asyncHandler(verifyEmail));
router.post('/resend-verification', forgotPasswordValidation, validate, asyncHandler(resendVerification));
router.post('/verify-phone', phoneVerificationValidation, validate, asyncHandler(verifyPhone));
router.post('/resend-phone-verification', forgotPasswordValidation, validate, asyncHandler(resendPhoneVerification));
router.post('/refresh-token', asyncHandler(refreshToken));

// Protected routes
router.get('/me', protect, asyncHandler(getMe));
router.get('/profile', protect, asyncHandler(getMe)); // Alias for /me
router.put('/profile', protect, asyncHandler(updateProfile));
router.put('/password', protect, updatePasswordValidation, validate, asyncHandler(updatePassword));
router.delete('/account', protect, asyncHandler(deleteAccount));

module.exports = router;
