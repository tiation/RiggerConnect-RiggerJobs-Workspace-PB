const express = require('express');
const securityMiddleware = require('./middleware/security');
const emailService = require('./services/emailService');
const tokenBlacklistService = require('./services/tokenBlacklistService');
const { cacheMiddleware } = require('./middleware/cache');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

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
app.use(express.json());

// Apply security middleware
app.use(securityMiddleware);
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

// API routes with caching where appropriate
app.use('/api/auth', authRoutes); // No cache for auth routes
app.use('/api/users', cacheMiddleware(300), userRoutes);
app.use('/api/jobs', cacheMiddleware(300), jobRoutes);
app.use('/api/applications', cacheMiddleware(300), applicationRoutes);
app.use('/api/payments', paymentRoutes); // No cache for payment routes
app.use('/api/agents', cacheMiddleware(300), agentRoutes);
app.use('/api/worksafe', cacheMiddleware(300), worksafeRoutes);
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
