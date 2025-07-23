const mongoose = require('mongoose');

// Enums
const jobStatusEnum = ['posted', 'assigned', 'in_progress', 'completed', 'cancelled', 'on_hold'];
const jobTypeEnum = ['crane_operator', 'rigger', 'dogger', 'scaffolder', 'mobile_crane_operator', 'tower_crane_operator', 'signaller'];
const experienceLevelEnum = ['entry', 'intermediate', 'advanced', 'expert'];
const shiftPatternEnum = ['day_shift', 'night_shift', 'swing_shift', 'fifo', 'continuous'];
const durationEnum = ['hourly', 'daily', 'weekly', 'monthly', 'contract'];
const urgencyLevelEnum = ['standard', 'priority', 'urgent', 'emergency'];
const siteTypeEnum = ['mining_site', 'construction', 'industrial', 'port', 'offshore', 'urban'];

// Sub-schemas
const coordinateSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

const locationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postcode: { type: String, required: true },
  country: { type: String, default: 'Australia' },
  siteType: { type: String, enum: siteTypeEnum, required: true },
  coordinate: coordinateSchema
});

// Main Job Schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { type: locationSchema, required: true },
  status: { type: String, enum: jobStatusEnum, default: 'posted' },
  rate: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'AUD' },
  requiredCertifications: [String],
  experienceLevel: { type: String, enum: experienceLevelEnum, default: 'intermediate' },
  jobType: { type: String, enum: jobTypeEnum, required: true },
  equipmentRequired: [String],
  safetyRequirements: [String],
  shiftPattern: { type: String, enum: shiftPatternEnum, default: 'day_shift' },
  duration: { type: String, enum: durationEnum, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedRiggerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  urgencyLevel: { type: String, enum: urgencyLevelEnum, default: 'standard' },
  weatherDependency: { type: Boolean, default: false },
  heightWork: { type: Boolean, default: false },
  insuranceRequired: { type: Number, default: 10000000 }, // $10M default
  
  // Additional fields for job management
  applicationDeadline: Date,
  maxApplicants: { type: Number, default: 50 },
  currentApplicants: { type: Number, default: 0 },
  isUrgent: { type: Boolean, default: false },
  tags: [String],
  
  // Job completion details
  actualStartDate: Date,
  actualEndDate: Date,
  hoursWorked: Number,
  completionNotes: String,
  clientRating: { type: Number, min: 1, max: 5 },
  riggerRating: { type: Number, min: 1, max: 5 },
  
  // Payment details
  totalCost: Number,
  isPaid: { type: Boolean, default: false },
  paymentDate: Date,
  
  // Tracking
  views: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
jobSchema.index({ status: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ clientId: 1 });
jobSchema.index({ assignedRiggerId: 1 });
jobSchema.index({ urgencyLevel: 1 });
jobSchema.index({ startDate: 1 });
jobSchema.index({ isActive: 1 });
jobSchema.index({ 'location.coordinate': '2dsphere' });
jobSchema.index({ rate: 1 });
jobSchema.index({ experienceLevel: 1 });

// Compound indexes
jobSchema.index({ status: 1, isActive: 1, startDate: 1 });
jobSchema.index({ jobType: 1, 'location.state': 1 });
jobSchema.index({ urgencyLevel: 1, startDate: 1 });

// Virtual for formatted rate
jobSchema.virtual('formattedRate').get(function() {
  return `$${this.rate.toFixed(2)}/hr ${this.currency}`;
});

// Virtual for urgency check
jobSchema.virtual('isUrgentJob').get(function() {
  return this.urgencyLevel === 'urgent' || this.urgencyLevel === 'emergency';
});

// Virtual for job duration in days
jobSchema.virtual('durationInDays').get(function() {
  if (this.endDate && this.startDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for distance calculation (requires currentLocation to be set)
jobSchema.virtual('distanceFromLocation').get(function() {
  // This would be calculated in the API based on user's location
  return this._distanceFromLocation;
});

jobSchema.virtual('distanceFromLocation').set(function(distance) {
  this._distanceFromLocation = distance;
});

// Pre-save middleware
jobSchema.pre('save', function(next) {
  // Set isUrgent based on urgencyLevel
  this.isUrgent = this.urgencyLevel === 'urgent' || this.urgencyLevel === 'emergency';
  
  // Set application deadline if not set (default to 1 day before start date)
  if (!this.applicationDeadline && this.startDate) {
    this.applicationDeadline = new Date(this.startDate);
    this.applicationDeadline.setDate(this.applicationDeadline.getDate() - 1);
  }
  
  // Calculate total cost if hours worked is available
  if (this.hoursWorked && this.rate && !this.totalCost) {
    this.totalCost = this.hoursWorked * this.rate;
  }
  
  next();
});

// Static methods
jobSchema.statics.findByLocation = function(lat, lng, maxDistance = 50) {
  return this.find({
    'location.coordinate': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: maxDistance * 1000 // Convert km to meters
      }
    },
    isActive: true,
    status: 'posted'
  });
};

jobSchema.statics.findAvailable = function() {
  return this.find({
    status: 'posted',
    isActive: true,
    startDate: { $gte: new Date() },
    $or: [
      { applicationDeadline: { $exists: false } },
      { applicationDeadline: { $gte: new Date() } }
    ]
  });
};

jobSchema.statics.findByRigger = function(riggerId) {
  return this.find({
    assignedRiggerId: riggerId,
    isActive: true
  });
};

jobSchema.statics.findByClient = function(clientId) {
  return this.find({
    clientId: clientId,
    isActive: true
  });
};

// Instance methods
jobSchema.methods.canApply = function() {
  const now = new Date();
  return this.status === 'posted' &&
         this.isActive &&
         this.startDate > now &&
         (!this.applicationDeadline || this.applicationDeadline > now) &&
         (!this.maxApplicants || this.currentApplicants < this.maxApplicants);
};

jobSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

jobSchema.methods.assignToRigger = function(riggerId) {
  this.assignedRiggerId = riggerId;
  this.status = 'assigned';
  return this.save();
};

jobSchema.methods.startJob = function() {
  this.status = 'in_progress';
  this.actualStartDate = new Date();
  return this.save();
};

jobSchema.methods.completeJob = function(hoursWorked, notes) {
  this.status = 'completed';
  this.actualEndDate = new Date();
  if (hoursWorked) this.hoursWorked = hoursWorked;
  if (notes) this.completionNotes = notes;
  if (this.hoursWorked && this.rate) {
    this.totalCost = this.hoursWorked * this.rate;
  }
  return this.save();
};

jobSchema.methods.cancelJob = function(reason) {
  this.status = 'cancelled';
  this.completionNotes = reason;
  return this.save();
};

module.exports = mongoose.model('Job', jobSchema);
