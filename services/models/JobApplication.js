const mongoose = require('mongoose');

// Enums
const applicationStatusEnum = ['pending', 'accepted', 'rejected', 'withdrawn'];

// Job Application Schema
const jobApplicationSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  applicantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Application details
  status: { 
    type: String, 
    enum: applicationStatusEnum, 
    default: 'pending' 
  },
  message: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  proposedRate: Number, // If applicant wants to negotiate rate
  
  // Experience and qualifications
  relevantExperience: String,
  certificationIds: [String], // References to certifications in user profile
  portfolioItems: [String], // URLs to portfolio/work samples
  
  // Availability
  availableStartDate: Date,
  canWorkWeekends: { type: Boolean, default: false },
  canWorkNights: { type: Boolean, default: false },
  canTravelDistance: Number, // in km
  
  // Application tracking
  applicationDate: { type: Date, default: Date.now },
  reviewedDate: Date,
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  // Client response
  clientResponse: String,
  rejectionReason: String,
  
  // Ratings and feedback (filled after job completion)
  applicantRating: { type: Number, min: 1, max: 5 },
  clientRating: { type: Number, min: 1, max: 5 },
  feedback: String,
  
  // Metadata
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 }, // Higher priority applications shown first
  tags: [String]
}, {
  timestamps: true
});

// Indexes
jobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true }); // Prevent duplicate applications
// Note: { jobId: 1, status: 1 } is redundant with compound index below
jobApplicationSchema.index({ applicantId: 1, status: 1 });
jobApplicationSchema.index({ clientId: 1, status: 1 });
jobApplicationSchema.index({ applicationDate: 1 });
jobApplicationSchema.index({ isActive: 1 });

// Compound indexes (these provide coverage for simple queries too)
jobApplicationSchema.index({ jobId: 1, status: 1, applicationDate: 1 });
jobApplicationSchema.index({ applicantId: 1, applicationDate: -1 });

// Virtual for days since application
jobApplicationSchema.virtual('daysSinceApplication').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.applicationDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for response time (if reviewed)
jobApplicationSchema.virtual('responseTimeInDays').get(function() {
  if (!this.reviewedDate) return null;
  const diffTime = Math.abs(this.reviewedDate - this.applicationDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
jobApplicationSchema.pre('save', async function(next) {
  // Auto-populate clientId from job if not set
  if (!this.clientId && this.jobId) {
    const Job = mongoose.model('Job');
    const job = await Job.findById(this.jobId).select('clientId');
    if (job) {
      this.clientId = job.clientId;
    }
  }
  
  // Set reviewed date when status changes from pending
  if (this.isModified('status') && this.status !== 'pending' && !this.reviewedDate) {
    this.reviewedDate = new Date();
  }
  
  next();
});

// Post-save middleware to update job application count
jobApplicationSchema.post('save', async function(doc) {
  if (doc.isModified('status') || doc.isNew) {
    const Job = mongoose.model('Job');
    const job = await Job.findById(doc.jobId);
    if (job) {
      const applicationCount = await mongoose.model('JobApplication').countDocuments({
        jobId: doc.jobId,
        status: { $in: ['pending', 'accepted'] },
        isActive: true
      });
      job.currentApplicants = applicationCount;
      await job.save();
    }
  }
});

// Static methods
jobApplicationSchema.statics.findByJob = function(jobId, status = null) {
  const query = { jobId, isActive: true };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('applicantId', 'firstName lastName email phoneNumber profileImageURL riggerProfile')
    .sort({ applicationDate: -1 });
};

jobApplicationSchema.statics.findByApplicant = function(applicantId, status = null) {
  const query = { applicantId, isActive: true };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('jobId')
    .populate('clientId', 'firstName lastName email clientProfile')
    .sort({ applicationDate: -1 });
};

jobApplicationSchema.statics.findByClient = function(clientId, status = null) {
  const query = { clientId, isActive: true };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('jobId')
    .populate('applicantId', 'firstName lastName email phoneNumber profileImageURL riggerProfile')
    .sort({ applicationDate: -1 });
};

jobApplicationSchema.statics.getPendingApplicationsCount = function(clientId) {
  return this.countDocuments({
    clientId,
    status: 'pending',
    isActive: true
  });
};

// Instance methods
jobApplicationSchema.methods.accept = async function(reviewerId, response) {
  this.status = 'accepted';
  this.reviewedBy = reviewerId;
  this.reviewedDate = new Date();
  this.clientResponse = response;
  
  // Update job status and assign rigger
  const Job = mongoose.model('Job');
  const job = await Job.findById(this.jobId);
  if (job) {
    await job.assignToRigger(this.applicantId);
  }
  
  // Reject all other pending applications for this job
  await mongoose.model('JobApplication').updateMany(
    { 
      jobId: this.jobId, 
      _id: { $ne: this._id }, 
      status: 'pending' 
    },
    { 
      status: 'rejected', 
      reviewedDate: new Date(),
      rejectionReason: 'Position filled by another candidate'
    }
  );
  
  return this.save();
};

jobApplicationSchema.methods.reject = function(reviewerId, reason) {
  this.status = 'rejected';
  this.reviewedBy = reviewerId;
  this.reviewedDate = new Date();
  this.rejectionReason = reason;
  return this.save();
};

jobApplicationSchema.methods.withdraw = function() {
  this.status = 'withdrawn';
  this.reviewedDate = new Date();
  return this.save();
};

jobApplicationSchema.methods.canWithdraw = function() {
  return this.status === 'pending';
};

jobApplicationSchema.methods.canReview = function() {
  return this.status === 'pending';
};

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
