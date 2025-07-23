import { Request, Response, NextFunction } from 'express';
import { logger } from '../../Utils/Logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    statusCode,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Don't expose internal errors in production
  const isProduction = process.env.NODE_ENV === 'production';
  const responseMessage = isProduction && statusCode === 500 ? 'Internal Server Error' : message;

  res.status(statusCode).json({
    success: false,
    error: {
      message: responseMessage,
      statusCode,
      ...(isProduction ? {} : { stack: err.stack })
    }
  });
};
