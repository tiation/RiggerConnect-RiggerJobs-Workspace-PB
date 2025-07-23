const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sessionConfig } = require('./config/session');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const session = require('express-session');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const paymentRoutes = require('./routes/payments');
const agentRoutes = require('./routes/agents');
const worksafeRoutes = require('./routes/worksafe');
// const contactRoutes = require('./routes/contact');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const setupSecurity = require('./middleware/security');
const { protect } = require('./middleware/auth');
const { verifyEmail } = require('./middleware/emailVerification');
const { forgotPassword, resetPassword } = require('./middleware/passwordReset');
const { setup2FA, verify2FASetup, verify2FAToken, disable2FA } = require('./middleware/twoFactor');

const app = express();
const PORT = process.env.PORT || 3000;

// Apply security middleware
setupSecurity(app);

// Apply session management
app.use(session(sessionConfig));

// Data sanitization
app.use(mongoSanitize()); // Against NoSQL query injection
app.use(xss()); // Against XSS
app.use(hpp()); // Prevent parameter pollution

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(logger);

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Serve static files
app.use(express.static('.'));
app.use('/assets', express.static('assets'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API routes
// Auth routes - no protection needed
app.use('/api/auth', authRoutes);

// Email verification routes
app.get('/api/verify-email/:token', verifyEmail);
app.post('/api/forgot-password', forgotPassword);
app.patch('/api/reset-password/:token', resetPassword);

// 2FA routes
app.post('/api/2fa/setup', protect, setup2FA);
app.post('/api/2fa/verify-setup', protect, verify2FASetup);
app.post('/api/2fa/verify', protect, verify2FAToken);
app.delete('/api/2fa/disable', protect, disable2FA);

// Protected routes
app.use('/api/users', protect, userRoutes);
app.use('/api/jobs', protect, jobRoutes);
app.use('/api/applications', protect, applicationRoutes);
app.use('/api/payments', protect, paymentRoutes);
app.use('/api/agents', protect, agentRoutes);
app.use('/api/worksafe', protect, worksafeRoutes);
// app.use('/api/contact', contactRoutes);

// API documentation route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to RiggerHire API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      jobs: '/api/jobs',
      applications: '/api/applications',
      payments: '/api/payments',
      contact: '/api/contact',
      worksafe: '/api/worksafe',
      health: '/health'
    }
  });
});

// Default route - serve website
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler - moved after other routes
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({
      error: 'Route not found',
      message: `Cannot ${req.method} ${req.originalUrl}`
    });
  } else {
    // Serve index.html for frontend routes
    res.sendFile('index.html', { root: __dirname });
  }
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/riggerhire')
.then(() => {
  console.log('Connected to MongoDB');
  
  // Start server
  app.listen(PORT, () => {
    console.log(`RiggerHire API server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
})
.catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Graceful shutdown initiated...');
  
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

module.exports = app;
