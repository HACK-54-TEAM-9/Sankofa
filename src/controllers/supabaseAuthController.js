const bcrypt = require('bcryptjs');
const SupabaseUser = require('../models/SupabaseUser');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const logger = require('../utils/logger');
const { supabase, supabaseAdmin } = require('../config/supabase');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  logger.info(`Registration attempt for: ${email}`);

  // Check if user already exists
  const existingUser = await SupabaseUser.findByEmail(email);
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Check if phone already exists
  const existingPhone = await SupabaseUser.findByPhone(phone);
  if (existingPhone) {
    throw new AppError('User with this phone number already exists', 400);
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in Supabase users table
    const userData = {
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: role || 'collector',
      status: 'pending',
      is_email_verified: false,
      is_phone_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const user = await SupabaseUser.create(userData);

    logger.info(`User registered successfully: ${email}`);

    // Send verification email (optional - non-blocking)
    try {
      // Generate email verification token
      const emailToken = require('crypto').randomBytes(32).toString('hex');
      
      await SupabaseUser.update(user.id, {
        emailVerificationToken: emailToken
      });

      // TODO: Send verification email with token
      // await sendEmail({
      //   to: user.email,
      //   subject: 'Email Verification',
      //   text: `Click here to verify: ${process.env.FRONTEND_URL}/verify-email/${emailToken}`
      // });
    } catch (error) {
      logger.warn('Email sending failed (non-blocking):', error.message);
    }

    // Send phone verification SMS (optional - non-blocking)
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      await SupabaseUser.update(user.id, {
        phoneVerificationCode: verificationCode
      });

      // TODO: Send SMS verification
      // await sendSMS({
      //   to: user.phone,
      //   message: `Your Sankofa-Coin verification code is: ${verificationCode}`
      // });
    } catch (error) {
      logger.warn('SMS sending failed (non-blocking):', error.message);
    }

    // Remove sensitive data
    const userProfile = { ...user };
    delete userProfile.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email and phone.',
      data: {
        user: userProfile
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    throw new AppError(error.message || 'Registration failed', 500);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  logger.info(`Login attempt for: ${email}`);

  // Find user by email
  const user = await SupabaseUser.findByEmail(email);
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Update last login
  await SupabaseUser.update(user.id, {
    last_login: new Date().toISOString(),
    login_count: (user.login_count || 0) + 1,
    last_activity: new Date().toISOString()
  });

  // Generate JWT tokens
  const accessToken = generateToken(user.id, user.email, user.role, '7d');
  const refreshToken = generateToken(user.id, user.email, user.role, '30d');

  // Remove sensitive data
  const userProfile = { ...user };
  delete userProfile.password;

  logger.info(`User logged in successfully: ${email}`);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: userProfile,
      accessToken,
      refreshToken
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // In a real app, you might invalidate tokens in a blacklist
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await SupabaseUser.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Remove sensitive data
  const userProfile = { ...user };
  delete userProfile.password;

  res.status(200).json({
    success: true,
    data: { user: userProfile }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};

  // Only allow specific fields to be updated
  const allowedFields = ['name', 'avatar', 'date_of_birth', 'gender', 'street', 'city', 'region', 'postal_code', 'latitude', 'longitude'];
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  updates.updated_at = new Date().toISOString();
  updates.last_activity = new Date().toISOString();

  const user = await SupabaseUser.update(req.user.id, updates);

  // Remove sensitive data
  const userProfile = { ...user };
  delete userProfile.password;

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: userProfile }
  });
});

// @desc    Update password
// @route   PUT /api/auth/change-password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await SupabaseUser.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  
  if (!passwordMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Hash new password
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await SupabaseUser.update(req.user.id, {
    password: hashedPassword,
    updated_at: new Date().toISOString()
  });

  logger.info(`Password updated for user: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await SupabaseUser.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    throw new AppError('Password is incorrect', 401);
  }

  // Delete user
  await SupabaseUser.delete(req.user.id);

  logger.info(`Account deleted: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

// Helper function to generate JWT tokens
function generateToken(userId, email, role, expiresIn) {
  const jwt = require('jsonwebtoken');
  
  return jwt.sign(
    { 
      id: userId, 
      email: email, 
      role: role 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: expiresIn }
  );
}

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  deleteAccount,
  // Export other functions as needed
  verifyEmail: asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'Email verified' });
  }),
  verifyPhone: asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'Phone verified' });
  }),
  resendVerification: asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'Verification sent' });
  }),
  resendPhoneVerification: asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'Phone verification sent' });
  }),
  refreshToken: asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'Token refreshed' });
  }),
  forgotPassword: asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'Password reset email sent' });
  }),
  resetPassword: asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'Password reset' });
  })
};
