const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Enums
const userTypeEnum = ['rigger', 'client', 'admin'];
const experienceLevelEnum = ['entry', 'intermediate', 'advanced', 'expert'];
const jobTypeEnum = ['crane_operator', 'rigger', 'dogger', 'scaffolder', 'mobile_crane_operator', 'tower_crane_operator', 'signaller'];
const shiftPatternEnum = ['day_shift', 'night_shift', 'swing_shift', 'fifo', 'continuous'];
const durationEnum = ['hourly', 'daily', 'weekly', 'monthly', 'contract'];
const availabilityStatusEnum = ['available', 'busy', 'vacation', 'unavailable'];
const incidentSeverityEnum = ['minor', 'moderate', 'serious', 'critical'];
const safetyRatingEnum = ['excellent', 'good', 'fair', 'poor'];
const industryEnum = ['mining', 'construction', 'manufacturing', 'energy', 'infrastructure', 'marine', 'aviation'];
const companySizeEnum = ['startup', 'small', 'medium', 'large', 'enterprise'];
const paymentMethodEnum = ['credit_card', 'bank_transfer', 'invoice', 'cryptocurrency'];

// Sub-schemas
const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuingAuthority: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  isValid: { type: Boolean, default: true },
  documentURL: String
});

const safetyIncidentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  severity: { type: String, enum: incidentSeverityEnum, required: true },
  description: { type: String, required: true },
  preventiveMeasures: String
});

const safetyRecordSchema = new mongoose.Schema({
  incidentFreeHours: { type: Number, default: 0 },
  lastIncidentDate: Date,
  safetyTrainingDate: Date,
  safetyRating: { type: String, enum: safetyRatingEnum, default: 'good' },
  incidentHistory: [safetyIncidentSchema]
});

const availabilitySchema = new mongoose.Schema({
  status: { type: String, enum: availabilityStatusEnum, default: 'available' },
  startDate: Date,
  endDate: Date,
  preferredShifts: [{ type: String, enum: shiftPatternEnum }],
  maximumHoursPerWeek: { type: Number, default: 40 },
  minimumJobDuration: { type: String, enum: durationEnum, default: 'daily' },
  notes: String
});

const riggerProfileSchema = new mongoose.Schema({
  specializations: [{ type: String, enum: jobTypeEnum }],
  experienceLevel: { type: String, enum: experienceLevelEnum, default: 'intermediate' },
  yearsExperience: { type: Number, default: 0 },
  certifications: [certificationSchema],
  availability: availabilitySchema,
  preferredLocations: [String],
  maximumTravelDistance: { type: Number, default: 50 }, // in km
  hourlyRate: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  completedJobs: { type: Number, default: 0 },
  insuranceCoverage: { type: Number, default: 0 },
  equipmentOwned: [String],
  safetyRecord: safetyRecordSchema,
  languages: { type: [String], default: ['English'] },
  fifoAvailable: { type: Boolean, default: false },
  nightShiftAvailable: { type: Boolean, default: false },
  emergencyAvailable: { type: Boolean, default: false }
});

const clientProfileSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  abn: String,
  industry: { type: String, enum: industryEnum, required: true },
  companySize: { type: String, enum: companySizeEnum, default: 'small' },
  primaryLocation: String,
  operatingLocations: [String],
  paymentMethod: { type: String, enum: paymentMethodEnum, default: 'invoice' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalJobsPosted: { type: Number, default: 0 },
  activeJobs: { type: Number, default: 0 },
  companyDescription: String,
  website: String,
  establishedYear: Number,
  safetyRating: { type: String, enum: safetyRatingEnum, default: 'good' }
});

// Main User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { type: String, required: true, minlength: 6 },
  phoneNumber: { type: String, required: true },
  profileImageURL: String,
  userType: { type: String, enum: userTypeEnum, required: true },
  riggerProfile: riggerProfileSchema,
  clientProfile: clientProfileSchema,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,
  twoFactorBackupCodes: [String],
  twoFactorVerificationToken: String,
  twoFactorVerificationExpires: Date
}, {
  timestamps: true
});

// Indexes
// Note: email index is automatically created due to unique: true constraint
userSchema.index({ userType: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ 'riggerProfile.specializations': 1 });
userSchema.index({ 'riggerProfile.availability.status': 1 });
userSchema.index({ 'clientProfile.industry': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  const fullName = this.fullName;
  return fullName.trim() || this.email;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Instance method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Instance method to generate two-factor authentication secret
userSchema.methods.generateTwoFactorSecret = function() {
  const crypto = require('crypto');
  const secret = crypto.randomBytes(16).toString('hex');
  this.twoFactorSecret = secret;
  return secret;
};

// Instance method to generate two-factor backup codes
userSchema.methods.generateTwoFactorBackupCodes = function() {
  const crypto = require('crypto');
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  this.twoFactorBackupCodes = codes;
  return codes;
};

// Instance method to generate two-factor verification token (for SMS/Email)
userSchema.methods.generateTwoFactorVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomInt(100000, 999999).toString(); // 6-digit code
  
  this.twoFactorVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  this.twoFactorVerificationExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  
  return token;
};

// Instance method to verify two-factor code
userSchema.methods.verifyTwoFactorCode = function(code) {
  if (!this.twoFactorEnabled) {
    return false;
  }
  
  // Check backup codes first
  const backupCodeIndex = this.twoFactorBackupCodes.indexOf(code.toUpperCase());
  if (backupCodeIndex !== -1) {
    // Remove used backup code
    this.twoFactorBackupCodes.splice(backupCodeIndex, 1);
    return true;
  }
  
  // For TOTP verification (would need speakeasy library in production)
  // This is a simplified version for demonstration
  return false;
};

// Instance method to verify SMS/Email token
userSchema.methods.verifyTwoFactorToken = function(token) {
  if (!this.twoFactorVerificationToken || !this.twoFactorVerificationExpires) {
    return false;
  }
  
  if (Date.now() > this.twoFactorVerificationExpires) {
    return false;
  }
  
  const crypto = require('crypto');
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  return hashedToken === this.twoFactorVerificationToken;
};

// Transform output (remove password from JSON responses)
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpires;
  delete userObject.twoFactorSecret;
  delete userObject.twoFactorBackupCodes;
  delete userObject.twoFactorVerificationToken;
  delete userObject.twoFactorVerificationExpires;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
