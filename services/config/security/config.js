module.exports = {
  jwt: {
    accessToken: {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      secret: process.env.JWT_SECRET
    },
    refreshToken: {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      secret: process.env.JWT_REFRESH_SECRET
    }
  },
  twoFactor: {
    codeLength: 6,
    codeExpiration: 10 * 60, // 10 minutes in seconds
    maxAttempts: 3,
    blockDuration: 30 * 60 // 30 minutes in seconds
  },
  passwordReset: {
    tokenExpiration: 60 * 60, // 1 hour in seconds
    maxAttempts: 3,
    blockDuration: 24 * 60 * 60 // 24 hours in seconds
  },
  emailVerification: {
    tokenExpiration: 24 * 60 * 60, // 24 hours in seconds
    maxAttempts: 3
  },
  session: {
    maxConcurrentSessions: 5,
    extendSessionOnActivity: true
  },
  rateLimiting: {
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5 // 5 attempts
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3 // 3 attempts
    },
    emailVerification: {
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      max: 5 // 5 attempts
    }
  },
  securityHeaders: {
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    csp: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.stripe.com'],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    }
  }
};
