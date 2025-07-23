const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      status: 404,
      message,
      error: 'Not Found'
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = {
      status: 400,
      message,
      error: 'Duplicate Field Value'
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      status: 400,
      message,
      error: 'Validation Error'
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = {
      status: 401,
      message,
      error: 'Unauthorized'
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = {
      status: 401,
      message,
      error: 'Unauthorized'
    };
  }

  // Custom application errors
  if (err.status) {
    error = {
      status: err.status,
      message: err.message,
      error: err.error || 'Application Error'
    };
  }

  // Default error
  const statusCode = error.status || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: error.error || 'Server Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode, error = 'Application Error') {
    super(message);
    this.status = statusCode;
    this.error = error;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  AppError,
  asyncHandler
};
