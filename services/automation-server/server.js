const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { createServer } = require('http');
const { Server: SocketServer } = require('socket.io');
require('dotenv').config();

class RiggerConnectServer {
  constructor() {
    this.app = express();
    this.config = this.loadConfig();
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocket();
  }

  loadConfig() {
    return {
      port: parseInt(process.env.PORT || '3000', 10),
      nodeEnv: process.env.NODE_ENV || 'development',
      mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/riggerconnect',
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
      rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    };
  }

  initializeMiddleware() {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(cors({
      origin: this.config.corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: this.config.rateLimitWindow,
      max: this.config.rateLimitMax,
      message: 'Too many requests from this IP, please try again later.',
    });
    this.app.use('/api', limiter);

    // Body parsing and compression
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.url} - ${req.ip}`);
      next();
    });
  }

  initializeRoutes() {
    // Health check endpoints
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
      });
    });

    this.app.get('/metrics', (req, res) => {
      res.status(200).json({
        requests: {},
        timestamp: new Date().toISOString()
      });
    });

    // API documentation
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'RiggerConnect API',
          version: '1.0.0',
          description: 'Enterprise-grade API for RiggerConnect and RiggerJobs',
          contact: {
            name: 'API Support',
            email: 'support@riggerconnect.com',
          },
        },
        servers: [
          {
            url: `http://localhost:${this.config.port}`,
            description: 'Development server',
          },
        ],
      },
      apis: [],
    };

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

    // Demo API endpoints
    this.app.get('/api/v1/jobs', (req, res) => {
      res.json({
        success: true,
        data: [
          {
            id: '1',
            title: 'Tower Crane Operator',
            location: 'Seattle, WA',
            company: 'Construction Corp',
            salary: '$45/hour',
            description: 'Experienced tower crane operator needed for downtown construction project'
          },
          {
            id: '2',
            title: 'Rigger Specialist',
            location: 'Portland, OR',
            company: 'BuildTech Solutions',
            salary: '$38/hour',
            description: 'Skilled rigger required for high-rise building construction'
          }
        ],
        total: 2
      });
    });

    this.app.get('/api/v1/workers', (req, res) => {
      res.json({
        success: true,
        data: [
          {
            id: '1',
            name: 'John Smith',
            skills: ['Tower Crane', 'Mobile Crane'],
            location: 'Seattle, WA',
            experience: '8 years',
            rating: 4.8
          },
          {
            id: '2',
            name: 'Maria Rodriguez',
            skills: ['Rigging', 'Signal Person'],
            location: 'Portland, OR',
            experience: '5 years',
            rating: 4.9
          }
        ],
        total: 2
      });
    });

    // Authentication endpoints
    this.app.post('/api/v1/auth/login', (req, res) => {
      res.json({
        success: true,
        message: 'Login successful',
        token: 'demo-jwt-token-123',
        user: {
          id: '1',
          email: 'demo@riggerconnect.com',
          role: 'business',
          name: 'Demo User'
        }
      });
    });

    this.app.post('/api/v1/auth/register', (req, res) => {
      res.json({
        success: true,
        message: 'Registration successful',
        user: {
          id: '2',
          email: req.body.email,
          role: req.body.role || 'worker',
          name: req.body.name
        }
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
      });
    });
  }

  initializeErrorHandling() {
    this.app.use((err, req, res, next) => {
      console.error('Error occurred:', err.message);
      res.status(err.statusCode || 500).json({
        success: false,
        error: {
          message: err.message || 'Internal Server Error',
          statusCode: err.statusCode || 500
        }
      });
    });
  }

  initializeSocket() {
    this.server = createServer(this.app);
    this.io = new SocketServer(this.server, {
      cors: {
        origin: this.config.corsOrigin,
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });

      // Demo events
      socket.on('join-job', (jobId) => {
        socket.join(`job-${jobId}`);
        console.log(`User ${socket.id} joined job ${jobId}`);
      });

      socket.on('job-update', (data) => {
        socket.to(`job-${data.jobId}`).emit('job-updated', data);
      });
    });
  }

  async start() {
    try {
      console.log('🚀 Starting RiggerConnect Server...');
      
      // Start server
      this.server.listen(this.config.port, () => {
        console.log(`✅ Server running on port ${this.config.port} in ${this.config.nodeEnv} mode`);
        console.log(`📖 API Documentation: http://localhost:${this.config.port}/api-docs`);
        console.log(`🩺 Health Check: http://localhost:${this.config.port}/health`);
        console.log(`📊 Metrics: http://localhost:${this.config.port}/metrics`);
        console.log(`🔗 Demo API: http://localhost:${this.config.port}/api/v1/jobs`);
        console.log('');
        console.log('🎯 Demo endpoints available:');
        console.log('  GET  /api/v1/jobs - List all jobs');
        console.log('  GET  /api/v1/workers - List all workers');
        console.log('  POST /api/v1/auth/login - User login');
        console.log('  POST /api/v1/auth/register - User registration');
      });

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  async stop() {
    try {
      if (this.server) {
        this.server.close();
      }
      console.log('✅ Server stopped successfully');
    } catch (error) {
      console.error('❌ Error stopping server:', error);
    }
  }
}

// Graceful shutdown handling
const server = new RiggerConnectServer();

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = { RiggerConnectServer };
