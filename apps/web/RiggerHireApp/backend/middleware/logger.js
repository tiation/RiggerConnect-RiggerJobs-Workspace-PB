const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log request
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${req.ip}`);
  
  // Log request body in development (excluding sensitive data)
  if (process.env.NODE_ENV === 'development' && req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    // Remove sensitive fields
    delete sanitizedBody.password;
    delete sanitizedBody.token;
    delete sanitizedBody.refreshToken;
    
    if (Object.keys(sanitizedBody).length > 0) {
      console.log(`[${timestamp}] Request Body:`, JSON.stringify(sanitizedBody, null, 2));
    }
  }
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    
    // Log response in development (for errors or specific status codes)
    if (process.env.NODE_ENV === 'development' && (res.statusCode >= 400 || req.query.debug)) {
      console.log(`[${timestamp}] Response:`, JSON.stringify(data, null, 2));
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = logger;
