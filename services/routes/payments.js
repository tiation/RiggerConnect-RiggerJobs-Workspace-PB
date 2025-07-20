const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const processPaymentValidation = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('currency').optional().isIn(['USD', 'AUD', 'CAD', 'GBP', 'EUR']).withMessage('Invalid currency'),
  body('paymentMethod').isIn(['credit_card', 'bank_transfer', 'escrow']).withMessage('Invalid payment method')
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

// @route   GET /api/payments/stats
// @desc    Get payment statistics for current user
// @access  Private
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  let stats = {};

  if (req.user.userType === 'rigger') {
    // Stats for riggers (earnings)
    const jobs = await Job.find({ 
      assignedTo: req.user._id,
      paymentStatus: 'paid'
    }).select('paymentDetails hourlyRate completionDetails');

    const totalEarnings = jobs.reduce((sum, job) => {
      return sum + (job.paymentDetails?.amount || 0);
    }, 0);

    const totalTips = jobs.reduce((sum, job) => {
      return sum + (job.paymentDetails?.tip || 0);
    }, 0);

    const totalHours = jobs.reduce((sum, job) => {
      return sum + (job.completionDetails?.actualHours || 0);
    }, 0);

    stats = {
      totalEarnings: totalEarnings,
      totalTips: totalTips,
      totalGross: totalEarnings + totalTips,
      totalHours: totalHours,
      averageHourlyRate: totalHours > 0 ? (totalEarnings / totalHours) : 0,
      completedJobs: jobs.length,
      currentMonthEarnings: calculateCurrentMonthEarnings(jobs),
      pendingPayments: await Job.countDocuments({
        assignedTo: req.user._id,
        paymentStatus: 'pending'
      })
    };

  } else if (req.user.userType === 'client') {
    // Stats for clients (spending)
    const jobs = await Job.find({ 
      postedBy: req.user._id,
      paymentStatus: 'paid'
    }).select('paymentDetails hourlyRate');

    const totalSpent = jobs.reduce((sum, job) => {
      return sum + (job.paymentDetails?.totalAmount || 0);
    }, 0);

    stats = {
      totalSpent: totalSpent,
      totalJobs: jobs.length,
      averageJobCost: jobs.length > 0 ? (totalSpent / jobs.length) : 0,
      currentMonthSpending: calculateCurrentMonthSpending(jobs),
      pendingPayments: await Job.countDocuments({
        postedBy: req.user._id,
        paymentStatus: 'pending'
      })
    };
  }

  res.json({
    success: true,
    stats
  });
}));

// @route   GET /api/payments/history
// @desc    Get payment history for current user
// @access  Private
router.get('/history', authenticateToken, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, startDate, endDate } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  let query = {};

  // Build query based on user type
  if (req.user.userType === 'client') {
    query.postedBy = req.user._id;
  } else if (req.user.userType === 'rigger') {
    query.assignedTo = req.user._id;
  }

  // Add additional filters
  if (status) query.paymentStatus = status;
  if (startDate || endDate) {
    query['paymentDetails.processedAt'] = {};
    if (startDate) query['paymentDetails.processedAt'].$gte = new Date(startDate);
    if (endDate) query['paymentDetails.processedAt'].$lte = new Date(endDate);
  }

  const jobs = await Job.find(query)
    .populate('postedBy', 'firstName lastName clientProfile.companyName')
    .populate('assignedTo', 'firstName lastName')
    .select('title hourlyRate duration completionDetails paymentStatus paymentDetails createdAt')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ 'paymentDetails.processedAt': -1 })
    .lean();

  const totalJobs = await Job.countDocuments(query);

  // Calculate summary statistics
  const paidJobs = jobs.filter(job => job.paymentStatus === 'paid');
  const totalEarnings = paidJobs.reduce((sum, job) => {
    return sum + (job.paymentDetails?.amount || 0);
  }, 0);

  const totalTips = paidJobs.reduce((sum, job) => {
    return sum + (job.paymentDetails?.tip || 0);
  }, 0);

  res.json({
    success: true,
    payments: jobs,
    summary: {
      totalEarnings: totalEarnings,
      totalTips: totalTips,
      totalJobs: paidJobs.length,
      pendingPayments: jobs.filter(job => job.paymentStatus === 'pending').length
    },
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalJobs / parseInt(limit)),
      totalJobs,
      hasNext: skip + jobs.length < totalJobs,
      hasPrev: parseInt(page) > 1
    }
  });
}));

// @route   POST /api/payments/jobs/:jobId/process
// @desc    Process payment for a completed job
// @access  Private (Job owner only)
router.post('/jobs/:jobId/process', authenticateToken, requireRole(['client']), processPaymentValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { amount, currency = 'USD', paymentMethod, tip = 0 } = req.body;

  const job = await Job.findOne({ 
    _id: req.params.jobId, 
    postedBy: req.user._id 
  }).populate('assignedTo', 'firstName lastName');

  if (!job) {
    throw new AppError('Job not found or not authorized', 404, 'Job Not Found');
  }

  if (job.status !== 'completed') {
    throw new AppError('Payment can only be processed for completed jobs', 400, 'Job Not Completed');
  }

  if (job.paymentStatus === 'paid') {
    throw new AppError('Payment has already been processed for this job', 400, 'Already Paid');
  }

  // Calculate total hours and expected payment
  const actualHours = job.completionDetails.actualHours || job.duration.estimatedHours || 0;
  const expectedAmount = actualHours * job.hourlyRate;
  const totalAmount = amount + tip;

  // In a real implementation, you would integrate with a payment processor
  // like Stripe, PayPal, or a banking API here
  
  // Simulate payment processing
  const paymentResult = await simulatePaymentProcessing({
    amount: totalAmount,
    currency,
    paymentMethod,
    jobId: req.params.jobId,
    clientId: req.user._id,
    riggerId: job.assignedTo._id
  });

  if (!paymentResult.success) {
    throw new AppError('Payment processing failed', 400, 'Payment Failed');
  }

  // Update job payment information
  job.paymentStatus = 'paid';
  job.paymentDetails = {
    amount: amount,
    tip: tip,
    totalAmount: totalAmount,
    currency: currency,
    method: paymentMethod,
    transactionId: paymentResult.transactionId,
    processedAt: new Date(),
    expectedAmount: expectedAmount,
    actualHours: actualHours
  };

  await job.save();

  // TODO: Send payment confirmation emails
  // TODO: Update user payment history
  // TODO: Handle tax calculations and reporting

  res.json({
    success: true,
    message: 'Payment processed successfully',
    payment: {
      transactionId: paymentResult.transactionId,
      amount: totalAmount,
      currency: currency,
      status: 'completed'
    }
  });
}));

// @route   GET /api/payments/jobs/:jobId
// @desc    Get payment details for a job
// @access  Private (Job owner or assigned rigger)
router.get('/jobs/:jobId', authenticateToken, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId)
    .populate('postedBy', 'firstName lastName clientProfile.companyName')
    .populate('assignedTo', 'firstName lastName');

  if (!job) {
    throw new AppError('Job not found', 404, 'Job Not Found');
  }

  // Check if user has permission to view payment details
  const isJobOwner = job.postedBy._id.toString() === req.user._id.toString();
  const isAssignedRigger = job.assignedTo && job.assignedTo._id.toString() === req.user._id.toString();

  if (!isJobOwner && !isAssignedRigger) {
    throw new AppError('Not authorized to view payment details', 403, 'Unauthorized');
  }

  const paymentInfo = {
    jobId: job._id,
    jobTitle: job.title,
    hourlyRate: job.hourlyRate,
    estimatedHours: job.duration.estimatedHours,
    actualHours: job.completionDetails.actualHours,
    estimatedTotal: (job.duration.estimatedHours || 0) * job.hourlyRate,
    actualTotal: (job.completionDetails.actualHours || 0) * job.hourlyRate,
    paymentStatus: job.paymentStatus,
    paymentDetails: job.paymentDetails || null
  };

  res.json({
    success: true,
    payment: paymentInfo
  });
}));

// @route   POST /api/payments/escrow/:jobId/release
// @desc    Release escrow payment for a job
// @access  Private (Job owner only)
router.post('/escrow/:jobId/release', authenticateToken, requireRole(['client']), asyncHandler(async (req, res) => {
  const job = await Job.findOne({ 
    _id: req.params.jobId, 
    postedBy: req.user._id 
  }).populate('assignedTo', 'firstName lastName');

  if (!job) {
    throw new AppError('Job not found or not authorized', 404, 'Job Not Found');
  }

  if (job.status !== 'completed') {
    throw new AppError('Escrow can only be released for completed jobs', 400, 'Job Not Completed');
  }

  if (job.paymentStatus !== 'escrowed') {
    throw new AppError('No escrow payment found for this job', 400, 'No Escrow Payment');
  }

  // In a real implementation, you would call the escrow service API
  const escrowResult = await simulateEscrowRelease({
    jobId: req.params.jobId,
    clientId: req.user._id,
    riggerId: job.assignedTo._id,
    amount: job.paymentDetails.amount
  });

  if (!escrowResult.success) {
    throw new AppError('Escrow release failed', 400, 'Escrow Release Failed');
  }

  job.paymentStatus = 'paid';
  job.paymentDetails.releasedAt = new Date();
  await job.save();

  res.json({
    success: true,
    message: 'Escrow payment released successfully'
  });
}));

// Helper function to simulate payment processing
// In a real implementation, this would integrate with a payment gateway
async function simulatePaymentProcessing(paymentData) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate 95% success rate
  const success = Math.random() > 0.05;
  
  return {
    success,
    transactionId: success ? `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : null,
    error: success ? null : 'Payment declined by bank'
  };
}

// Helper function to simulate escrow release
async function simulateEscrowRelease(escrowData) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    releaseId: `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
}

// Helper function to calculate current month earnings
function calculateCurrentMonthEarnings(jobs) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return jobs
    .filter(job => {
      const paymentDate = new Date(job.paymentDetails.processedAt);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    })
    .reduce((sum, job) => sum + (job.paymentDetails?.amount || 0), 0);
}

// Helper function to calculate current month spending
function calculateCurrentMonthSpending(jobs) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return jobs
    .filter(job => {
      const paymentDate = new Date(job.paymentDetails.processedAt);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    })
    .reduce((sum, job) => sum + (job.paymentDetails?.totalAmount || 0), 0);
}

module.exports = router;
