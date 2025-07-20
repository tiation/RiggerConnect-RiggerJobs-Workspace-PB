const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const createJobValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10-2000 characters'),
  body('location.address').trim().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5-200 characters'),
  body('location.coordinates').optional().isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of [longitude, latitude]'),
  body('hourlyRate').isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  body('type').isIn(['crane_operation', 'rigging', 'scaffolding', 'heavy_lifting', 'load_planning', 'safety_supervision', 'equipment_maintenance', 'inspection', 'other']).withMessage('Invalid job type'),
  body('urgency').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid urgency level'),
  body('duration.estimatedHours').optional().isInt({ min: 1 }).withMessage('Estimated hours must be at least 1'),
  body('duration.startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('duration.endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('certificationRequirements').optional().isArray().withMessage('Certification requirements must be an array'),
  body('safetyRequirements').optional().isArray().withMessage('Safety requirements must be an array'),
  body('shift.type').optional().isIn(['day', 'night', 'swing', 'rotating']).withMessage('Invalid shift type'),
  body('maxApplicants').optional().isInt({ min: 1, max: 100 }).withMessage('Max applicants must be between 1-100')
];

const updateJobValidation = [
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3-100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10-2000 characters'),
  body('hourlyRate').optional().isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  body('urgency').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid urgency level'),
  body('maxApplicants').optional().isInt({ min: 1, max: 100 }).withMessage('Max applicants must be between 1-100')
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

// @route   GET /api/jobs/my/applications
// @desc    Get current user's job applications
// @access  Private (Riggers only)
router.get('/my/applications', authenticateToken, requireRole(['rigger']), asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = { applicant: req.user._id };

  if (status) query.status = status;

  const applications = await JobApplication.find(query)
    .populate('job', 'title description location hourlyRate status duration.startDate postedBy')
    .populate('job.postedBy', 'firstName lastName clientProfile.companyName')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ appliedAt: -1 })
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

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Clients only)
router.post('/', authenticateToken, requireRole(['client']), createJobValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const jobData = {
    ...req.body,
    postedBy: req.user._id
  };

  // Validate coordinates if provided
  if (jobData.location.coordinates) {
    const [longitude, latitude] = jobData.location.coordinates;
    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      throw new AppError('Invalid coordinates provided', 400, 'Invalid Coordinates');
    }
  }

  // Validate date range
  if (jobData.duration.endDate && new Date(jobData.duration.startDate) >= new Date(jobData.duration.endDate)) {
    throw new AppError('Start date must be before end date', 400, 'Invalid Date Range');
  }

  const job = new Job(jobData);
  await job.save();

  // Update client's active jobs count
  await User.findByIdAndUpdate(
    req.user._id,
    { $inc: { 'clientProfile.activeJobs': 1, 'clientProfile.totalJobsPosted': 1 } }
  );

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    job
  });
}));

// @route   GET /api/jobs
// @desc    Get jobs with filtering and pagination
// @access  Private
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const {
    status,
    type,
    urgency,
    minRate,
    maxRate,
    location,
    maxDistance = 50,
    startDate,
    endDate,
    certificationRequired,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = {};

  // Build search filters
  if (status) query.status = status;
  if (type) query.type = type;
  if (urgency) query.urgency = urgency;
  if (minRate || maxRate) {
    query.hourlyRate = {};
    if (minRate) query.hourlyRate.$gte = parseFloat(minRate);
    if (maxRate) query.hourlyRate.$lte = parseFloat(maxRate);
  }
  if (startDate) query['duration.startDate'] = { $gte: new Date(startDate) };
  if (endDate) query['duration.endDate'] = { $lte: new Date(endDate) };
  if (certificationRequired) query.certificationRequirements = { $in: [certificationRequired] };

  // For riggers, only show open jobs
  if (req.user.userType === 'rigger') {
    query.status = 'open';
  }

  // For clients, show only their own jobs
  if (req.user.userType === 'client') {
    query.postedBy = req.user._id;
  }

  // TODO: Location-based search would require geospatial queries
  // This is a placeholder for now
  
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const jobs = await Job.find(query)
    .populate('postedBy', 'firstName lastName clientProfile.companyName clientProfile.rating')
    .populate('assignedTo', 'firstName lastName riggerProfile.rating')
    .skip(skip)
    .limit(parseInt(limit))
    .sort(sortOptions)
    .lean();

  const totalJobs = await Job.countDocuments(query);

  res.json({
    success: true,
    jobs,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalJobs / parseInt(limit)),
      totalJobs,
      hasNext: skip + jobs.length < totalJobs,
      hasPrev: parseInt(page) > 1
    }
  });
}));

// @route   GET /api/jobs/:jobId
// @desc    Get a specific job by ID
// @access  Private
router.get('/:jobId', authenticateToken, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId)
    .populate('postedBy', 'firstName lastName clientProfile.companyName clientProfile.rating clientProfile.industry')
    .populate('assignedTo', 'firstName lastName riggerProfile.rating riggerProfile.specializations riggerProfile.experienceLevel')
    .lean();

  if (!job) {
    throw new AppError('Job not found', 404, 'Job Not Found');
  }

  // Check if user has permission to view this job
  if (req.user.userType === 'client' && job.postedBy._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to view this job', 403, 'Unauthorized');
  }

  // Add application status for riggers
  if (req.user.userType === 'rigger') {
    const application = await JobApplication.findOne({
      job: req.params.jobId,
      applicant: req.user._id
    }).lean();

    job.userApplication = application ? {
      status: application.status,
      appliedAt: application.appliedAt
    } : null;
  }

  res.json({
    success: true,
    job
  });
}));

// @route   PUT /api/jobs/:jobId
// @desc    Update a job
// @access  Private (Job owner only)
router.put('/:jobId', authenticateToken, requireRole(['client']), updateJobValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });

  if (!job) {
    throw new AppError('Job not found or not authorized', 404, 'Job Not Found');
  }

  if (job.status !== 'open') {
    throw new AppError('Cannot edit job that is not in open status', 400, 'Invalid Status');
  }

  const allowedUpdates = ['title', 'description', 'hourlyRate', 'urgency', 'maxApplicants', 'certificationRequirements', 'safetyRequirements'];
  const updates = {};

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.jobId,
    updates,
    { new: true, runValidators: true }
  ).populate('postedBy', 'firstName lastName clientProfile.companyName');

  res.json({
    success: true,
    message: 'Job updated successfully',
    job: updatedJob
  });
}));

// @route   DELETE /api/jobs/:jobId
// @desc    Cancel/Delete a job
// @access  Private (Job owner only)
router.delete('/:jobId', authenticateToken, requireRole(['client']), asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });

  if (!job) {
    throw new AppError('Job not found or not authorized', 404, 'Job Not Found');
  }

  if (job.status === 'completed') {
    throw new AppError('Cannot cancel a completed job', 400, 'Invalid Status');
  }

  job.status = 'cancelled';
  await job.save();

  // Update client's active jobs count
  await User.findByIdAndUpdate(
    req.user._id,
    { $inc: { 'clientProfile.activeJobs': -1 } }
  );

  // Notify all applicants about job cancellation
  // TODO: Send notifications

  res.json({
    success: true,
    message: 'Job cancelled successfully'
  });
}));

// @route   POST /api/jobs/:jobId/apply
// @desc    Apply for a job
// @access  Private (Riggers only)
router.post('/:jobId/apply', authenticateToken, requireRole(['rigger']), asyncHandler(async (req, res) => {
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

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    application
  });
}));

// @route   GET /api/jobs/:jobId/applications
// @desc    Get applications for a job
// @access  Private (Job owner only)
router.get('/:jobId/applications', authenticateToken, requireRole(['client']), asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
  
  if (!job) {
    throw new AppError('Job not found or not authorized', 404, 'Job Not Found');
  }

  const { status, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = { job: req.params.jobId };

  if (status) query.status = status;

  const applications = await JobApplication.find(query)
    .populate('applicant', 'firstName lastName riggerProfile.rating riggerProfile.specializations riggerProfile.experienceLevel riggerProfile.completedJobs')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ appliedAt: -1 })
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

// @route   PUT /api/jobs/:jobId/applications/:applicationId
// @desc    Update application status (accept/reject)
// @access  Private (Job owner only)
router.put('/:jobId/applications/:applicationId', authenticateToken, requireRole(['client']), asyncHandler(async (req, res) => {
  const { status, message } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    throw new AppError('Invalid status. Must be accepted or rejected', 400, 'Invalid Status');
  }

  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
  if (!job) {
    throw new AppError('Job not found or not authorized', 404, 'Job Not Found');
  }

  const application = await JobApplication.findOne({
    _id: req.params.applicationId,
    job: req.params.jobId
  }).populate('applicant', 'firstName lastName');

  if (!application) {
    throw new AppError('Application not found', 404, 'Application Not Found');
  }

  if (application.status !== 'pending') {
    throw new AppError('Application has already been reviewed', 400, 'Already Reviewed');
  }

  application.status = status;
  application.reviewedAt = new Date();
  if (message) application.reviewMessage = message;

  if (status === 'accepted') {
    // Assign job to the applicant
    job.assignedTo = application.applicant._id;
    job.status = 'assigned';
    await job.save();

    // Reject all other pending applications
    await JobApplication.updateMany(
      { job: req.params.jobId, status: 'pending', _id: { $ne: req.params.applicationId } },
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

// @route   PUT /api/jobs/:jobId/start
// @desc    Start a job (mark as in progress)
// @access  Private (Assigned rigger only)
router.put('/:jobId/start', authenticateToken, requireRole(['rigger']), asyncHandler(async (req, res) => {
  const job = await Job.findOne({ 
    _id: req.params.jobId, 
    assignedTo: req.user._id,
    status: 'assigned'
  });

  if (!job) {
    throw new AppError('Job not found or not authorized', 404, 'Job Not Found');
  }

  job.status = 'in_progress';
  job.actualStartDate = new Date();
  await job.save();

  res.json({
    success: true,
    message: 'Job started successfully',
    job
  });
}));

// @route   PUT /api/jobs/:jobId/complete
// @desc    Complete a job
// @access  Private (Assigned rigger only)
router.put('/:jobId/complete', authenticateToken, requireRole(['rigger']), asyncHandler(async (req, res) => {
  const { completionNotes, actualHours } = req.body;

  const job = await Job.findOne({ 
    _id: req.params.jobId, 
    assignedTo: req.user._id,
    status: 'in_progress'
  });

  if (!job) {
    throw new AppError('Job not found or not authorized', 404, 'Job Not Found');
  }

  job.status = 'completed';
  job.actualEndDate = new Date();
  if (completionNotes) job.completionDetails.notes = completionNotes;
  if (actualHours) job.completionDetails.actualHours = actualHours;

  await job.save();

  // Update rigger's completed jobs count
  await User.findByIdAndUpdate(
    req.user._id,
    { $inc: { 'riggerProfile.completedJobs': 1 } }
  );

  // Update client's active jobs count
  await User.findByIdAndUpdate(
    job.postedBy,
    { $inc: { 'clientProfile.activeJobs': -1 } }
  );

  res.json({
    success: true,
    message: 'Job completed successfully',
    job
  });
}));

module.exports = router;
