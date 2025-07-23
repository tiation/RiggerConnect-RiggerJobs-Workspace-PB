const helmet = require('helmet');

// Configure Content Security Policy
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.stripe.com', process.env.SUPABASE_URL],
    frameSrc: ["'self'", 'https://js.stripe.com'],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
};

// Security middleware
const securityMiddleware = [
  // Basic security headers
  helmet(),
  
  // Custom CSP
  helmet.contentSecurityPolicy(cspConfig),
  
  // Prevent clickjacking
  helmet.frameguard({ action: 'deny' }),
  
  // XSS protection
  helmet.xssFilter(),
  
  // Prevent MIME type sniffing
  helmet.noSniff(),
  
  // HSTS
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }),
  
  // Disable client-side caching for authenticated routes
  (req, res, next) => {
    if (req.user) {
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    next();
  }
];

module.exports = securityMiddleware;
