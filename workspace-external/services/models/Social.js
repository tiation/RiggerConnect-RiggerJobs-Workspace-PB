const mongoose = require('mongoose');

// Enums
const postTypeEnum = ['text', 'image', 'video', 'document', 'job_share', 'certification'];
const postVisibilityEnum = ['public', 'connections', 'private'];
const connectionStatusEnum = ['pending', 'accepted', 'declined', 'blocked'];
const messageTypeEnum = ['text', 'image', 'file', 'job_link', 'contact_info'];
const eventTypeEnum = ['training', 'networking', 'safety_briefing', 'industry_update', 'job_fair'];
const notificationTypeEnum = ['job_alert', 'message', 'connection_request', 'post_like', 'event_reminder', 'safety_alert'];

// Sub-schemas
const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video', 'document'], required: true },
  url: { type: String, required: true },
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  }
});

// Post Schema - Social media posts
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 2000 },
  type: { type: String, enum: postTypeEnum, default: 'text' },
  media: [mediaSchema],
  visibility: { type: String, enum: postVisibilityEnum, default: 'public' },
  tags: [String],
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Engagement metrics
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  
  // Job sharing specific fields
  sharedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  sharedCertification: {
    name: String,
    issuingAuthority: String,
    earnedDate: Date
  },
  
  // Moderation
  isActive: { type: Boolean, default: true },
  isReported: { type: Boolean, default: false },
  reportCount: { type: Number, default: 0 },
  
  // Location (optional)
  location: locationSchema
}, {
  timestamps: true
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 500 },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // For nested comments
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isReported: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Connection Schema - Professional networking
const connectionSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: connectionStatusEnum, default: 'pending' },
  message: { type: String, maxlength: 300 }, // Optional message with request
  connectionDate: Date,
  
  // Connection strength (for algorithm)
  interactionScore: { type: Number, default: 0 },
  mutualConnections: { type: Number, default: 0 },
  
  // Categories for organization
  categories: [{ type: String, enum: ['colleague', 'client', 'mentor', 'industry_contact'] }]
}, {
  timestamps: true
});

// Message Schema - Direct messaging
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  type: { type: String, enum: messageTypeEnum, default: 'text' },
  
  // Message status
  isRead: { type: Boolean, default: false },
  readAt: Date,
  
  // Media attachments
  attachments: [mediaSchema],
  
  // Special message types
  sharedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  sharedContact: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Threading
  conversationId: { type: String, required: true }, // Format: "userId1_userId2" (sorted)
  
  // Moderation
  isActive: { type: Boolean, default: true },
  isReported: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Event Schema - Industry events and training
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 2000 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: eventTypeEnum, required: true },
  
  // Date and location
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: locationSchema,
  isVirtual: { type: Boolean, default: false },
  virtualLink: String,
  
  // Event details
  maxAttendees: Number,
  currentAttendees: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  currency: { type: String, default: 'AUD' },
  
  // Registration
  requiresApproval: { type: Boolean, default: false },
  registrationDeadline: Date,
  
  // Attendees
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['registered', 'attended', 'no_show'], default: 'registered' },
    registeredAt: { type: Date, default: Date.now }
  }],
  
  // Event media
  bannerImage: String,
  documents: [mediaSchema],
  
  // Certification offered
  certificationOffered: {
    name: String,
    issuingAuthority: String,
    validityPeriod: Number // in months
  },
  
  // Status
  status: { type: String, enum: ['draft', 'published', 'cancelled', 'completed'], default: 'draft' },
  isActive: { type: Boolean, default: true },
  
  // Safety requirements
  safetyRequirements: [String],
  covidRequirements: String
}, {
  timestamps: true
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional - system notifications don't have sender
  type: { type: String, enum: notificationTypeEnum, required: true },
  title: { type: String, required: true, maxlength: 100 },
  message: { type: String, required: true, maxlength: 300 },
  
  // Related entities
  relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  relatedEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Status
  isRead: { type: Boolean, default: false },
  readAt: Date,
  
  // Action URL for deep linking
  actionUrl: String,
  
  // Priority for sorting
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  
  // Expiry for temporary notifications
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ visibility: 1, isActive: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ 'location.coordinates': '2dsphere' });

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });
connectionSchema.index({ recipient: 1, status: 1 });
connectionSchema.index({ requester: 1, status: 1 });

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });
messageSchema.index({ sender: 1 });

eventSchema.index({ startDate: 1 });
eventSchema.index({ type: 1, status: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ 'location.coordinates': '2dsphere' });

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual fields
postSchema.virtual('isLikedByUser').get(function() {
  return this._currentUserId ? this.likes.includes(this._currentUserId) : false;
});

postSchema.virtual('isLikedByUser').set(function(userId) {
  this._currentUserId = userId;
});

// Static methods
postSchema.statics.getFeed = function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  return this.find({
    $or: [
      { visibility: 'public', isActive: true },
      { author: userId, isActive: true },
      // TODO: Add logic for connection-only posts
    ]
  })
  .populate('author', 'firstName lastName profileImageURL riggerProfile.specializations')
  .populate('sharedJob', 'title location hourlyRate')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

connectionSchema.statics.getConnections = function(userId, status = 'accepted') {
  return this.find({
    $or: [
      { requester: userId, status },
      { recipient: userId, status }
    ]
  })
  .populate('requester', 'firstName lastName profileImageURL riggerProfile clientProfile')
  .populate('recipient', 'firstName lastName profileImageURL riggerProfile clientProfile');
};

messageSchema.statics.getConversation = function(userId1, userId2, page = 1, limit = 50) {
  const conversationId = [userId1, userId2].sort().join('_');
  const skip = (page - 1) * limit;
  
  return this.find({ conversationId, isActive: true })
    .populate('sender', 'firstName lastName profileImageURL')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

eventSchema.statics.getUpcomingEvents = function(location, radius = 50) {
  const query = {
    startDate: { $gte: new Date() },
    status: 'published',
    isActive: true
  };
  
  if (location && location.coordinates) {
    query['location.coordinates'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [location.coordinates.longitude, location.coordinates.latitude]
        },
        $maxDistance: radius * 1000 // Convert km to meters
      }
    };
  }
  
  return this.find(query)
    .populate('organizer', 'firstName lastName clientProfile.companyName')
    .sort({ startDate: 1 });
};

// Instance methods
postSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.indexOf(userId);
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
    this.likesCount = Math.max(0, this.likesCount - 1);
  } else {
    this.likes.push(userId);
    this.likesCount += 1;
  }
  return this.save();
};

connectionSchema.methods.accept = function() {
  this.status = 'accepted';
  this.connectionDate = new Date();
  return this.save();
};

messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

eventSchema.methods.registerUser = function(userId) {
  if (this.maxAttendees && this.currentAttendees >= this.maxAttendees) {
    throw new Error('Event is at maximum capacity');
  }
  
  const existingAttendee = this.attendees.find(a => a.user.toString() === userId.toString());
  if (existingAttendee) {
    throw new Error('User already registered for this event');
  }
  
  this.attendees.push({ user: userId });
  this.currentAttendees += 1;
  return this.save();
};

notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Export models
module.exports = {
  Post: mongoose.model('Post', postSchema),
  Comment: mongoose.model('Comment', commentSchema),
  Connection: mongoose.model('Connection', connectionSchema),
  Message: mongoose.model('Message', messageSchema),
  Event: mongoose.model('Event', eventSchema),
  Notification: mongoose.model('Notification', notificationSchema)
};
