// Content Security Policy Configuration
const cspConfig = {
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Required for some third-party scripts
            "'unsafe-eval'",   // Required for Vue/React development
            "https://js.stripe.com", // Payment processing
            "https://www.google-analytics.com",
            "https://maps.googleapis.com"
        ],
        styleSrc: [
            "'self'",
            "'unsafe-inline'", // Required for styled-components
            "https://fonts.googleapis.com"
        ],
        imgSrc: [
            "'self'",
            "data:",
            "blob:",
            "https:",
            "https://maps.googleapis.com",
            "https://www.google-analytics.com"
        ],
        connectSrc: [
            "'self'",
            "https://api.stripe.com",
            "https://maps.googleapis.com",
            "https://www.google-analytics.com",
            process.env.NODE_ENV === 'development' ? 'ws://localhost:*' : null // WebSocket in development
        ].filter(Boolean),
        fontSrc: [
            "'self'",
            "https://fonts.gstatic.com"
        ],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: [
            "'self'",
            "https://js.stripe.com",
            "https://maps.googleapis.com"
        ],
        workerSrc: [
            "'self'",
            "blob:"
        ],
        childSrc: ["'self'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
        blockAllMixedContent: []
    },
    reportUri: process.env.CSP_REPORT_URI
};

// Security Headers Configuration
const securityHeaders = {
    // HSTS Configuration
    strictTransportSecurity: {
        maxAge: parseInt(process.env.STRICT_TRANSPORT_SECURITY_MAX_AGE) || 31536000,
        includeSubDomains: true,
        preload: true
    },

    // Referrer Policy
    referrerPolicy: 'strict-origin-when-cross-origin',

    // Permissions Policy (formerly Feature-Policy)
    permissionsPolicy: {
        geolocation: ['self'],
        camera: ['none'],
        microphone: ['none'],
        payment: ['self', 'https://js.stripe.com'],
        fullscreen: ['self']
    },

    // X-Frame Options
    frameGuard: {
        action: 'deny'
    },

    // X-Content-Type-Options
    noSniff: true,

    // X-XSS-Protection (although modern browsers rely more on CSP)
    xssFilter: true,

    // X-Download-Options (IE specific)
    ieNoOpen: true,

    // X-DNS-Prefetch-Control
    dnsPrefetchControl: {
        allow: false
    },

    // Expect-CT Header
    expectCt: {
        enforce: true,
        maxAge: 86400,
        reportUri: process.env.EXPECT_CT_REPORT_URI
    }
};

// Rate Limiting Configuration
const rateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
};

// CORS Configuration
const corsConfig = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

module.exports = {
    cspConfig,
    securityHeaders,
    rateLimitConfig,
    corsConfig
};
