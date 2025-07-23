const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { generateTokens, verifyRefreshToken, authenticateToken } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const signUpValidation = [
  body('firstName').trim().isLength({ min: 1, max: 50 }).withMessage('First name must be between 1-50 characters'),
  body('lastName').trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phoneNumber').trim().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('userType').isIn(['rigger', 'client']).withMessage('User type must be rigger or client')
];

const signInValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please check your input',
      details: errors.array()
    });
  }
  next();
};

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', signUpValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, userType } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 400, 'Duplicate Email');
  }

  // Create user
  const user = new User({
    firstName,
    lastName,
    email,
    password, // Will be hashed by pre-save middleware
    phoneNumber,
    userType
  });

  // Initialize profile based on user type
  if (userType === 'rigger') {
    user.riggerProfile = {
      specializations: [],
      experienceLevel: 'entry',
      yearsExperience: 0,
      certifications: [],
      availability: {
        status: 'available',
        preferredShifts: [],
        maximumHoursPerWeek: 40,
        minimumJobDuration: 'daily'
      },
      preferredLocations: [],
      maximumTravelDistance: 50,
      hourlyRate: 0,
      rating: 0,
      completedJobs: 0,
      insuranceCoverage: 0,
      equipmentOwned: [],
      safetyRecord: {
        incidentFreeHours: 0,
        safetyRating: 'good',
        incidentHistory: []
      },
      languages: ['English'],
      fifoAvailable: false,
      nightShiftAvailable: false,
      emergencyAvailable: false
    };
  } else if (userType === 'client') {
    user.clientProfile = {
      companyName: `${firstName} ${lastName}`,
      industry: 'construction', // Default
      companySize: 'small',
      paymentMethod: 'invoice',
      rating: 0,
      totalJobsPosted: 0,
      activeJobs: 0,
      safetyRating: 'good'
    };
  }

  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save();

  // TODO: Send verification email
  // await sendVerificationEmail(user.email, verificationToken);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    accessToken,
    refreshToken,
    user: user.toJSON(),
    requiresTwoFactorAuth: false
  });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', signInValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'Authentication Failed');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new AppError('Account is deactivated', 401, 'Account Deactivated');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401, 'Authentication Failed');
  }

  // Check if two-factor authentication is enabled
  if (user.twoFactorEnabled) {
    // Generate 2FA verification token and send via SMS/Email
    const twoFactorToken = user.generateTwoFactorVerificationToken();
    await user.save();
    
    // TODO: Send 2FA token via SMS/Email
    // await sendTwoFactorToken(user.phoneNumber, user.email, twoFactorToken);
    
    return res.json({
      success: true,
      message: 'Two-factor authentication required',
      requiresTwoFactorAuth: true,
      userId: user._id, // Temporary ID for 2FA verification
      twoFactorMethod: 'sms_email' // Could be 'totp', 'sms', 'email'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    accessToken,
    refreshToken,
    user: user.toJSON(),
    requiresTwoFactorAuth: false
  });
}));

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Refresh token is required', 400, 'Missing Token');
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401, 'Invalid Token');
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.json({
      success: true,
      accessToken,
      refreshToken
    });
  } catch (error) {
    throw new AppError('Invalid refresh token', 401, 'Invalid Token');
  }
}));

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', forgotPasswordValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists or not for security
    return res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save();

  // TODO: Send reset email
  // await sendPasswordResetEmail(user.email, resetToken);

  res.json({
    success: true,
    message: 'If the email exists, a password reset link has been sent'
  });
}));

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', resetPasswordValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  // Hash the token to compare with stored version
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', 400, 'Invalid Token');
  }

  // Update password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password has been reset successfully'
  });
}));

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
}));

// @route   POST /api/auth/verify-email
// @desc    Verify email with token
// @access  Public
router.post('/verify-email', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Verification token is required', 400, 'Missing Token');
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', 400, 'Invalid Token');
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
}));

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // In a JWT implementation, logout is typically handled client-side
  // by removing the token. Server-side blacklisting can be implemented
  // if needed for enhanced security.
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

module.exports = router;
