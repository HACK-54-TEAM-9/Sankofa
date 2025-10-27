const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const logger = require('../utils/logger');
const { supabase, supabaseAdmin } = require('../config/supabase');
const generateToken = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  // Check if user already exists by email
  const existingUserByEmail = await User.findByEmail(email);
  if (existingUserByEmail) {
    throw new AppError('User with this email already exists', 400);
  }

  // Check if user already exists by phone
  const existingUserByPhone = await User.findByPhone(phone);
  if (existingUserByPhone) {
    throw new AppError('User with this phone number already exists', 400);
  }

  // Hash password using bcrypt
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user profile in our users table
  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: role || 'collector',
    is_email_verified: false,
    is_phone_verified: false,
    status: 'active' // Auto-activate for demo purposes
  });

  // Send phone verification code (optional - don't fail if SMS service is down)
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Store verification code (you'd need to add this field to User model)
    // await user.update({ phone_verification_code: verificationCode });

    await sendSMS({
      to: user.phone,
      message: `Your Sankofa verification code is: ${verificationCode}. Valid for 10 minutes.`
    });
  } catch (error) {
    logger.warn('SMS verification send failed:', error.message);
    // Don't fail registration if SMS fails
  }

  // Generate JWT tokens
  const accessToken = generateToken(user.id, user.email, user.role, '7d');
  const refreshToken = generateToken(user.id, user.email, user.role, '30d');

  logger.info('User registered successfully', { userId: user.id, email: user.email, role: user.role });

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: {
      user: user.toPublicProfile(),
      accessToken,
      refreshToken
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findByEmail(email);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password using bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is active
  if (user.status !== 'active' && user.status !== 'pending') {
    throw new AppError('Account is not active. Please contact support.', 401);
  }

  // Update last login
  await user.updateLastLogin();

  // Generate JWT tokens
  const accessToken = generateToken(user.id, user.email, user.role, '7d');
  const refreshToken = generateToken(user.id, user.email, user.role, '30d');

  logger.info('User logged in successfully', { userId: user.id, email: user.email });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toPublicProfile(),
      accessToken,
      refreshToken
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // Use Supabase Auth to sign out
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AppError('Logout failed', 500);
  }

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // Get the current session from Supabase Auth
  const { data: { user: authUser }, error } = await supabase.auth.getUser();

  if (error || !authUser) {
    throw new AppError('Unauthorized', 401);
  }

  // Get user profile from our users table
  const user = await User.findById(authUser.id);

  if (!user) {
    throw new AppError('User profile not found', 404);
  }

  res.json({
    success: true,
    data: {
      user: user.toPublicProfile()
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  // Get the current session from Supabase Auth
  const { data: { user: authUser }, error } = await supabase.auth.getUser();

  if (error || !authUser) {
    throw new AppError('Unauthorized', 401);
  }

  const allowedUpdates = ['name', 'address', 'preferences'];
  const updates = {};

  // Filter allowed updates
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // Get user profile
  const user = await User.findById(authUser.id);

  if (!user) {
    throw new AppError('User profile not found', 404);
  }

  // Add role-specific updates
  if (user.role === 'collector' && req.body.collectorProfile) {
    updates.collectorProfile = { ...user.collectorProfile, ...req.body.collectorProfile };
  }

  if (user.role === 'hub-manager' && req.body.hubManagerProfile) {
    updates.hubManagerProfile = { ...user.hubManagerProfile, ...req.body.hubManagerProfile };
  }

  if (user.role === 'volunteer' && req.body.volunteerProfile) {
    updates.volunteerProfile = { ...user.volunteerProfile, ...req.body.volunteerProfile };
  }

  if (user.role === 'donor' && req.body.donorProfile) {
    updates.donorProfile = { ...user.donorProfile, ...req.body.donorProfile };
  }

  await user.update(updates);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.toPublicProfile()
    }
  });
});

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  // Get the current session from Supabase Auth
  const { data: { user: authUser }, error } = await supabase.auth.getUser();

  if (error || !authUser) {
    throw new AppError('Unauthorized', 401);
  }

  // Use Supabase Auth to update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (updateError) {
    throw new AppError(updateError.message, 400);
  }

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Use Supabase Auth to send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${req.protocol}://${req.get('host')}/reset-password`
  });

  if (error) {
    throw new AppError('Password reset email could not be sent', 500);
  }

  res.json({
    success: true,
    message: 'Password reset email sent'
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  // Get the current session from Supabase Auth
  const { data: { user: authUser }, error } = await supabase.auth.getUser();

  if (error || !authUser) {
    throw new AppError('Invalid or expired reset token', 401);
  }

  // Use Supabase Auth to update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: password
  });

  if (updateError) {
    throw new AppError(updateError.message, 400);
  }

  res.json({
    success: true,
    message: 'Password reset successful'
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  // Get the current session from Supabase Auth
  const { data: { user: authUser }, error } = await supabase.auth.getUser();

  if (error || !authUser) {
    throw new AppError('Invalid or expired verification token', 401);
  }

  // Get user profile and verify email
  const user = await User.findById(authUser.id);
  if (!user) {
    throw new AppError('User profile not found', 404);
  }

  await user.verifyEmail();

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    throw new AppError('No user found with this email address', 404);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email is already verified', 400);
  }

  // Use Supabase Auth to resend verification email
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email
  });

  if (error) {
    throw new AppError('Verification email could not be sent', 500);
  }

  res.json({
    success: true,
    message: 'Verification email sent'
  });
});

// @desc    Verify phone number
// @route   POST /api/auth/verify-phone
// @access  Public
const verifyPhone = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    throw new AppError('No user found with this email address', 404);
  }

  if (user.isPhoneVerified) {
    throw new AppError('Phone number is already verified', 400);
  }

  if (!user.phoneVerificationCode) {
    throw new AppError('No verification code found. Please request a new one.', 400);
  }

  if (user.phoneVerificationCode !== code) {
    throw new AppError('Invalid verification code', 400);
  }

  // Verify phone
  await user.verifyPhone();

  res.json({
    success: true,
    message: 'Phone number verified successfully'
  });
});

// @desc    Resend phone verification
// @route   POST /api/auth/resend-phone-verification
// @access  Public
const resendPhoneVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    throw new AppError('No user found with this email address', 404);
  }

  if (user.isPhoneVerified) {
    throw new AppError('Phone number is already verified', 400);
  }

  // Generate new verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  await user.update({ phoneVerificationCode: verificationCode });

  // Send SMS
  try {
    await sendSMS({
      to: user.phone,
      message: `Your Sankofa-Coin verification code is: ${verificationCode}. Valid for 10 minutes.`
    });
  } catch (error) {
    logger.error('SMS verification resend failed:', error);
    throw new AppError('SMS could not be sent', 500);
  }

  res.json({
    success: true,
    message: 'Verification code sent'
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  // Get the current session from Supabase Auth
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    throw new AppError('No valid session found', 401);
  }

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      session: session
    }
  });
});

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
  // Get the current session from Supabase Auth
  const { data: { user: authUser }, error } = await supabase.auth.getUser();

  if (error || !authUser) {
    throw new AppError('Unauthorized', 401);
  }

  // Get user profile
  const user = await User.findById(authUser.id);

  if (!user) {
    throw new AppError('User profile not found', 404);
  }

  // Soft delete - mark as inactive instead of actually deleting
  await user.update({
    status: 'inactive',
    email: `deleted_${Date.now()}_${user.email}`,
    phone: `deleted_${Date.now()}_${user.phone}`
  });

  // Sign out from Supabase Auth
  await supabase.auth.signOut();

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  verifyPhone,
  resendPhoneVerification,
  refreshToken,
  deleteAccount
};
