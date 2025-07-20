const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be between 1-50 characters'),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1-50 characters'),
  body('phoneNumber').optional().trim().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters')
];

const updateRiggerProfileValidation = [
  body('specializations').optional().isArray().withMessage('Specializations must be an array'),
  body('experienceLevel').optional().isIn(['entry', 'intermediate', 'senior', 'expert']).withMessage('Invalid experience level'),
  body('yearsExperience').optional().isInt({ min: 0, max: 50 }).withMessage('Years experience must be between 0-50'),
  body('hourlyRate').optional().isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  body('maximumTravelDistance').optional().isInt({ min: 0 }).withMessage('Maximum travel distance must be positive'),
  body('fifoAvailable').optional().isBoolean().withMessage('FIFO availability must be boolean'),
  body('nightShiftAvailable').optional().isBoolean().withMessage('Night shift availability must be boolean'),
  body('emergencyAvailable').optional().isBoolean().withMessage('Emergency availability must be boolean')
];

const updateClientProfileValidation = [
  body('companyName').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Company name must be between 1-100 characters'),
  body('industry').optional().isIn(['construction', 'mining', 'oil_gas', 'renewable_energy', 'marine', 'entertainment', 'manufacturing', 'other']).withMessage('Invalid industry'),
  body('companySize').optional().isIn(['small', 'medium', 'large', 'enterprise']).withMessage('Invalid company size'),
  body('paymentMethod').optional().isIn(['credit_card', 'bank_transfer', 'invoice', 'escrow']).withMessage('Invalid payment method')
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

// @route   GET /api/users/profile
// @desc    Get current user's complete profile
// @access  Private
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    throw new AppError('User not found', 404, 'User Not Found');
  }

  res.json({
    success: true,
    user: user.toJSON()
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user's basic profile
// @access  Private
router.put('/profile', authenticateToken, updateProfileValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, bio } = req.body;
  
  const updateFields = {};
  if (firstName !== undefined) updateFields.firstName = firstName;
  if (lastName !== undefined) updateFields.lastName = lastName;
  if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;
  if (bio !== undefined) updateFields.bio = bio;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateFields,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404, 'User Not Found');
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: user.toJSON()
  });
}));

// @route   PUT /api/users/rigger-profile
// @desc    Update rigger-specific profile
// @access  Private (Riggers only)
router.put('/rigger-profile', authenticateToken, requireRole(['rigger']), updateRiggerProfileValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const updateFields = {};
  const allowedFields = [
    'specializations', 'experienceLevel', 'yearsExperience', 'hourlyRate', 
    'maximumTravelDistance', 'fifoAvailable', 'nightShiftAvailable', 
    'emergencyAvailable', 'equipmentOwned', 'languages'
  ];

  // Build update object for rigger profile
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateFields[`riggerProfile.${field}`] = req.body[field];
    }
  });

  // Handle nested objects
  if (req.body.availability) {
    Object.keys(req.body.availability).forEach(key => {
      updateFields[`riggerProfile.availability.${key}`] = req.body.availability[key];
    });
  }

  if (req.body.preferredLocations) {
    updateFields['riggerProfile.preferredLocations'] = req.body.preferredLocations;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateFields,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404, 'User Not Found');
  }

  res.json({
    success: true,
    message: 'Rigger profile updated successfully',
    user: user.toJSON()
  });
}));

// @route   PUT /api/users/client-profile
// @desc    Update client-specific profile
// @access  Private (Clients only)
router.put('/client-profile', authenticateToken, requireRole(['client']), updateClientProfileValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const updateFields = {};
  const allowedFields = ['companyName', 'industry', 'companySize', 'paymentMethod'];

  // Build update object for client profile
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateFields[`clientProfile.${field}`] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateFields,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404, 'User Not Found');
  }

  res.json({
    success: true,
    message: 'Client profile updated successfully',
    user: user.toJSON()
  });
}));

// @route   POST /api/users/certifications
// @desc    Add certification to rigger profile
// @access  Private (Riggers only)
router.post('/certifications', authenticateToken, requireRole(['rigger']), asyncHandler(async (req, res) => {
  const { name, issuingAuthority, issueDate, expiryDate, certificateNumber } = req.body;

  if (!name || !issuingAuthority) {
    throw new AppError('Certification name and issuing authority are required', 400, 'Missing Required Fields');
  }

  const certification = {
    name,
    issuingAuthority,
    issueDate: issueDate ? new Date(issueDate) : undefined,
    expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    certificateNumber,
    isVerified: false
  };

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { 'riggerProfile.certifications': certification } },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404, 'User Not Found');
  }

  res.json({
    success: true,
    message: 'Certification added successfully',
    user: user.toJSON()
  });
}));

// @route   DELETE /api/users/certifications/:certificationId
// @desc    Remove certification from rigger profile
// @access  Private (Riggers only)
router.delete('/certifications/:certificationId', authenticateToken, requireRole(['rigger']), asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { 'riggerProfile.certifications': { _id: req.params.certificationId } } },
    { new: true }
  );

  if (!user) {
    throw new AppError('User not found', 404, 'User Not Found');
  }

  res.json({
    success: true,
    message: 'Certification removed successfully',
    user: user.toJSON()
  });
}));

// @route   GET /api/users/search
// @desc    Search for users (riggers for clients, basic info only)
// @access  Private
router.get('/search', authenticateToken, asyncHandler(async (req, res) => {
  const { 
    userType = 'rigger', 
    specialization, 
    experienceLevel, 
    location, 
    maxDistance = 50,
    availability = 'available',
    minRating = 0,
    page = 1,
    limit = 20 
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = { userType, isActive: true, isVerified: true };

  // Build search filters based on user type
  if (userType === 'rigger') {
    if (specialization) {
      query['riggerProfile.specializations'] = { $in: [specialization] };
    }
    if (experienceLevel) {
      query['riggerProfile.experienceLevel'] = experienceLevel;
    }
    if (availability) {
      query['riggerProfile.availability.status'] = availability;
    }
    if (minRating > 0) {
      query['riggerProfile.rating'] = { $gte: parseFloat(minRating) };
    }
    
    // Location-based search would require geospatial queries
    // This is a simplified version
    if (location) {
      // TODO: Implement geospatial search
    }
  }

  const users = await User.find(query)
    .select('firstName lastName profilePicture riggerProfile.specializations riggerProfile.experienceLevel riggerProfile.rating riggerProfile.completedJobs riggerProfile.availability.status')
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const totalUsers = await User.countDocuments(query);

  res.json({
    success: true,
    users,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / parseInt(limit)),
      totalUsers,
      hasNext: skip + users.length < totalUsers,
      hasPrev: parseInt(page) > 1
    }
  });
}));

// @route   GET /api/users/:userId
// @desc    Get public profile of a user
// @access  Private
router.get('/:userId', authenticateToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)
    .select('-email -phoneNumber -createdAt -updatedAt -lastLogin -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires');

  if (!user) {
    throw new AppError('User not found', 404, 'User Not Found');
  }

  if (!user.isActive) {
    throw new AppError('User profile not available', 404, 'Profile Not Available');
  }

  res.json({
    success: true,
    user: user.toJSON()
  });
}));

// @route   PUT /api/users/availability
// @desc    Update rigger availability
// @access  Private (Riggers only)
router.put('/availability', authenticateToken, requireRole(['rigger']), asyncHandler(async (req, res) => {
  const { status, preferredShifts, maximumHoursPerWeek, minimumJobDuration } = req.body;

  const updateFields = {};
  if (status) updateFields['riggerProfile.availability.status'] = status;
  if (preferredShifts) updateFields['riggerProfile.availability.preferredShifts'] = preferredShifts;
  if (maximumHoursPerWeek) updateFields['riggerProfile.availability.maximumHoursPerWeek'] = maximumHoursPerWeek;
  if (minimumJobDuration) updateFields['riggerProfile.availability.minimumJobDuration'] = minimumJobDuration;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateFields,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404, 'User Not Found');
  }

  res.json({
    success: true,
    message: 'Availability updated successfully',
    availability: user.riggerProfile.availability
  });
}));

// @route   DELETE /api/users/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', authenticateToken, asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    throw new AppError('User not found', 404, 'User Not Found');
  }

  res.json({
    success: true,
    message: 'Account deactivated successfully'
  });
}));

module.exports = router;
