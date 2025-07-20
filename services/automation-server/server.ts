import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { connectDatabase } from './Database/DatabaseManager';
import { logger } from './Utils/Logger';
import { errorHandler } from './API/Middleware/ErrorHandler';
import { authMiddleware } from './API/Middleware/AuthMiddleware';
import { validateRequest } from './API/Middleware/ValidationMiddleware';
import { setupRoutes } from './API/Routes';
import { initializeServices } from './Services';
import { HealthCheckService } from './Monitoring/HealthCheck/HealthCheckService';
import { MetricsService } from './Monitoring/Metrics/MetricsService';
import { setupSocketHandlers } from './Socket/SocketHandlers';

// Load environment variables
config();

interface ServerConfig {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  jwtSecret: string;
  corsOrigin: string;
  rateLimitWindow: number;
  rateLimitMax: number;
}

class RiggerConnectServer {
  private app: Application;
  private server: any;
  private io: SocketServer;
  private config: ServerConfig;
  private healthCheckService: HealthCheckService;
  private metricsService: MetricsService;

  constructor() {
    this.app = express();
    this.config = this.loadConfig();
    this.healthCheckService = new HealthCheckService();
    this.metricsService = new MetricsService();
    
    this.initializeMiddleware();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocket();
  }

  private loadConfig(): ServerConfig {
    return {
      port: parseInt(process.env.PORT || '3000', 10),
      nodeEnv: process.env.NODE_ENV || 'development',
      mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/riggerconnect',
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
      rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    };
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

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
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api', limiter);

    // Body parsing and compression
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });
      next();
    });

    // Metrics collection
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.metricsService.recordRequestMetrics(req.method, req.route?.path || req.url, res.statusCode, duration);
      });
      
      next();
    });
  }

  private initializeSwagger(): void {
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
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      apis: ['./AutomationServer/API/Routes/*.ts', './AutomationServer/API/Controllers/*.ts'],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private initializeRoutes(): void {
    // Health check endpoints
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json(this.healthCheckService.getHealthStatus());
    });

    this.app.get('/metrics', (req: Request, res: Response) => {
      res.status(200).json(this.metricsService.getMetrics());
    });

    // API routes
    setupRoutes(this.app);

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private initializeSocket(): void {
    this.server = createServer(this.app);
    this.io = new SocketServer(this.server, {
      cors: {
        origin: this.config.corsOrigin,
        methods: ['GET', 'POST'],
      },
    });

    setupSocketHandlers(this.io);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase(this.config.mongoUri);
      logger.info('Database connected successfully');

      // Initialize services
      await initializeServices();
      logger.info('Services initialized successfully');

      // Start server
      this.server.listen(this.config.port, () => {
        logger.info(`Server running on port ${this.config.port} in ${this.config.nodeEnv} mode`);
        logger.info(`API Documentation available at http://localhost:${this.config.port}/api-docs`);
        logger.info(`Health check available at http://localhost:${this.config.port}/health`);
      });

      // Start health monitoring
      this.healthCheckService.startMonitoring();
      
      // Start metrics collection
      this.metricsService.startCollection();

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    try {
      this.healthCheckService.stopMonitoring();
      this.metricsService.stopCollection();
      
      if (this.server) {
        this.server.close();
      }
      
      logger.info('Server stopped successfully');
    } catch (error) {
      logger.error('Error stopping server:', error);
    }
  }
}

// Graceful shutdown handling
const server = new RiggerConnectServer();

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
server.start().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export { RiggerConnectServer };
