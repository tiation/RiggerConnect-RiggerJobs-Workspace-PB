const express = require('express');
const { body, validationResult } = require('express-validator');
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const createApplicationValidation = [
  body('message').optional().trim().isLength({ max: 1000 }).withMessage('Message must not exceed 1000 characters'),
  body('availabilityInfo').optional().trim().isLength({ max: 500 }).withMessage('Availability info must not exceed 500 characters'),
  body('relevantExperience').optional().trim().isLength({ max: 1000 }).withMessage('Relevant experience must not exceed 1000 characters')
];

const updateApplicationValidation = [
  body('message').optional().trim().isLength({ max: 1000 }).withMessage('Message must not exceed 1000 characters'),
  body('availabilityInfo').optional().trim().isLength({ max: 500 }).withMessage('Availability info must not exceed 500 characters'),
  body('relevantExperience').optional().trim().isLength({ max: 1000 }).withMessage('Relevant experience must not exceed 1000 characters')
];

const rateApplicationValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Review must not exceed 500 characters')
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

// @route   POST /api/applications/:jobId
// @desc    Apply for a job
// @access  Private (Riggers only)
router.post('/:jobId', authenticateToken, requireRole(['rigger']), createApplicationValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { message, availabilityInfo, relevantExperience } = req.body;

  const job = await Job.findById(req.params.jobId);
  if (!job) {
    throw new AppError('Job not found', 404, 'Job Not Found');
  }

  if (job.status !== 'open') {
    throw new AppError('Job is not accepting applications', 400, 'Job Not Open');
  }

  // Check if user already applied
  const existingApplication = await JobApplication.findOne({
    job: req.params.jobId,
    applicant: req.user._id
  });

  if (existingApplication) {
    throw new AppError('You have already applied for this job', 400, 'Duplicate Application');
  }

  // Check if job has reached max applicants
  if (job.maxApplicants && job.currentApplicants >= job.maxApplicants) {
    throw new AppError('Job has reached maximum number of applicants', 400, 'Max Applicants Reached');
  }

  const application = new JobApplication({
    job: req.params.jobId,
    applicant: req.user._id,
    message,
    availabilityInfo,
    relevantExperience
  });

  await application.save();

  // Populate the saved application
  await application.populate('job', 'title description hourlyRate location.address postedBy');
  await application.populate('job.postedBy', 'firstName lastName clientProfile.companyName');

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    application
  });
}));

// @route   GET /api/applications/stats
// @desc    Get application statistics for current user
// @access  Private
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  let stats = {};

  if (req.user.userType === 'rigger') {
    // Stats for riggers
    const applications = await JobApplication.find({ applicant: req.user._id });
    
    stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length,
      acceptedApplications: applications.filter(app => app.status === 'accepted').length,
      rejectedApplications: applications.filter(app => app.status === 'rejected').length,
      withdrawnApplications: applications.filter(app => app.status === 'withdrawn').length,
      averageRating: req.user.riggerProfile?.rating || 0,
      totalRatings: applications.filter(app => app.rating).length
    };

  } else if (req.user.userType === 'client') {
    // Stats for clients
    const clientJobs = await Job.find({ postedBy: req.user._id });
    const jobIds = clientJobs.map(job => job._id);
    const applications = await JobApplication.find({ job: { $in: jobIds } });
    
    stats = {
      totalJobsPosted: clientJobs.length,
      totalApplicationsReceived: applications.length,
      pendingReviews: applications.filter(app => app.status === 'pending').length,
      acceptedApplications: applications.filter(app => app.status === 'accepted').length,
      rejectedApplications: applications.filter(app => app.status === 'rejected').length,
      activeJobs: clientJobs.filter(job => ['open', 'assigned', 'in_progress'].includes(job.status)).length,
      completedJobs: clientJobs.filter(job => job.status === 'completed').length
    };
  }

  res.json({
    success: true,
    stats
  });
}));

// @route   GET /api/applications
// @desc    Get current user's applications (riggers) or applications to their jobs (clients)
// @access  Private
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20, sortBy = 'appliedAt', sortOrder = 'desc' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  let query = {};

  // Build query based on user type
  if (req.user.userType === 'rigger') {
    query.applicant = req.user._id;
  } else if (req.user.userType === 'client') {
    // Find jobs posted by this client
    const clientJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = clientJobs.map(job => job._id);
    query.job = { $in: jobIds };
  }

  if (status) query.status = status;

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  let populateFields;
  if (req.user.userType === 'rigger') {
    populateFields = [
      { path: 'job', select: 'title description location hourlyRate status duration.startDate postedBy type urgency' },
      { path: 'job.postedBy', select: 'firstName lastName clientProfile.companyName clientProfile.rating' }
    ];
  } else {
    populateFields = [
      { path: 'applicant', select: 'firstName lastName riggerProfile.rating riggerProfile.specializations riggerProfile.experienceLevel riggerProfile.completedJobs profilePicture' },
      { path: 'job', select: 'title status type urgency' }
    ];
  }

  const applications = await JobApplication.find(query)
    .populate(populateFields)
    .skip(skip)
    .limit(parseInt(limit))
    .sort(sortOptions)
    .lean();

  const totalApplications = await JobApplication.countDocuments(query);

  res.json({
    success: true,
    applications,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalApplications / parseInt(limit)),
      totalApplications,
      hasNext: skip + applications.length < totalApplications,
      hasPrev: parseInt(page) > 1
    }
  });
}));

// @route   GET /api/applications/:applicationId
// @desc    Get a specific application
// @access  Private (Application owner or job owner)
router.get('/:applicationId', authenticateToken, asyncHandler(async (req, res) => {
  const application = await JobApplication.findById(req.params.applicationId)
    .populate('applicant', 'firstName lastName riggerProfile profilePicture')
    .populate('job', 'title description location hourlyRate status postedBy type urgency duration')
    .populate('job.postedBy', 'firstName lastName clientProfile.companyName')
    .lean();

  if (!application) {
    throw new AppError('Application not found', 404, 'Application Not Found');
  }

  // Check if user has permission to view this application
  const isApplicant = application.applicant._id.toString() === req.user._id.toString();
  const isJobOwner = application.job.postedBy._id.toString() === req.user._id.toString();

  if (!isApplicant && !isJobOwner) {
    throw new AppError('Not authorized to view this application', 403, 'Unauthorized');
  }

  res.json({
    success: true,
    application
  });
}));

// @route   PUT /api/applications/:applicationId
// @desc    Update an application (by applicant only, before review)
// @access  Private (Application owner only)
router.put('/:applicationId', authenticateToken, requireRole(['rigger']), updateApplicationValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const application = await JobApplication.findOne({
    _id: req.params.applicationId,
    applicant: req.user._id
  });

  if (!application) {
    throw new AppError('Application not found or not authorized', 404, 'Application Not Found');
  }

  if (application.status !== 'pending') {
    throw new AppError('Cannot update application that has been reviewed', 400, 'Application Already Reviewed');
  }

  const allowedUpdates = ['message', 'availabilityInfo', 'relevantExperience'];
  const updates = {};

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedApplication = await JobApplication.findByIdAndUpdate(
    req.params.applicationId,
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).populate('job', 'title description hourlyRate location.address');

  res.json({
    success: true,
    message: 'Application updated successfully',
    application: updatedApplication
  });
}));

// @route   DELETE /api/applications/:applicationId
// @desc    Withdraw an application
// @access  Private (Application owner only)
router.delete('/:applicationId', authenticateToken, requireRole(['rigger']), asyncHandler(async (req, res) => {
  const application = await JobApplication.findOne({
    _id: req.params.applicationId,
    applicant: req.user._id
  });

  if (!application) {
    throw new AppError('Application not found or not authorized', 404, 'Application Not Found');
  }

  if (application.status === 'accepted') {
    throw new AppError('Cannot withdraw an accepted application', 400, 'Cannot Withdraw');
  }

  application.status = 'withdrawn';
  application.withdrawnAt = new Date();
  await application.save();

  res.json({
    success: true,
    message: 'Application withdrawn successfully'
  });
}));

// @route   PUT /api/applications/:applicationId/review
// @desc    Review an application (accept/reject)
// @access  Private (Job owner only)
router.put('/:applicationId/review', authenticateToken, requireRole(['client']), asyncHandler(async (req, res) => {
  const { status, message } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    throw new AppError('Invalid status. Must be accepted or rejected', 400, 'Invalid Status');
  }

  const application = await JobApplication.findById(req.params.applicationId)
    .populate('job', 'postedBy status')
    .populate('applicant', 'firstName lastName');

  if (!application) {
    throw new AppError('Application not found', 404, 'Application Not Found');
  }

  // Check if user owns the job
  if (application.job.postedBy.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to review this application', 403, 'Unauthorized');
  }

  if (application.status !== 'pending') {
    throw new AppError('Application has already been reviewed', 400, 'Already Reviewed');
  }

  if (application.job.status !== 'open') {
    throw new AppError('Cannot review applications for jobs that are not open', 400, 'Job Not Open');
  }

  application.status = status;
  application.reviewedAt = new Date();
  if (message) application.reviewMessage = message;

  if (status === 'accepted') {
    // Assign job to the applicant
    const job = await Job.findByIdAndUpdate(
      application.job._id,
      { 
        assignedTo: application.applicant._id,
        status: 'assigned'
      },
      { new: true }
    );

    // Reject all other pending applications for this job
    await JobApplication.updateMany(
      { 
        job: application.job._id, 
        status: 'pending', 
        _id: { $ne: req.params.applicationId } 
      },
      { 
        status: 'rejected', 
        reviewedAt: new Date(),
        rejectionReason: 'Position filled by another candidate'
      }
    );
  }

  await application.save();

  res.json({
    success: true,
    message: `Application ${status} successfully`,
    application
  });
}));

// @route   POST /api/applications/:applicationId/rate
// @desc    Rate an application/rigger after job completion
// @access  Private (Job owner only)
router.post('/:applicationId/rate', authenticateToken, requireRole(['client']), rateApplicationValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { rating, review } = req.body;

  const application = await JobApplication.findById(req.params.applicationId)
    .populate('job', 'postedBy status')
    .populate('applicant', 'firstName lastName');

  if (!application) {
    throw new AppError('Application not found', 404, 'Application Not Found');
  }

  // Check if user owns the job
  if (application.job.postedBy.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to rate this application', 403, 'Unauthorized');
  }

  if (application.status !== 'accepted' || application.job.status !== 'completed') {
    throw new AppError('Can only rate applications for completed jobs', 400, 'Job Not Completed');
  }

  if (application.rating) {
    throw new AppError('Application has already been rated', 400, 'Already Rated');
  }

  application.rating = rating;
  application.review = review;
  application.ratedAt = new Date();
  await application.save();

  // Update rigger's average rating
  const riggerApplications = await JobApplication.find({
    applicant: application.applicant._id,
    rating: { $exists: true, $ne: null }
  });

  const averageRating = riggerApplications.reduce((sum, app) => sum + app.rating, 0) / riggerApplications.length;

  await User.findByIdAndUpdate(
    application.applicant._id,
    { 'riggerProfile.rating': parseFloat(averageRating.toFixed(2)) }
  );

  res.json({
    success: true,
    message: 'Rating submitted successfully',
    application
  });
}));

module.exports = router;
