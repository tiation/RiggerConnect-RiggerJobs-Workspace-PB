const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const {
    cspConfig,
    securityHeaders,
    rateLimitConfig,
    corsConfig
} = require('../config/security');

const setupSecurity = (app) => {
    // 1. Basic security headers with Helmet
    app.use(helmet());

    // 2. Content Security Policy
    app.use(helmet.contentSecurityPolicy(cspConfig));

    // 3. Strict Transport Security
    app.use(helmet.hsts(securityHeaders.strictTransportSecurity));

    // 4. Referrer Policy
    app.use(helmet.referrerPolicy({
        policy: securityHeaders.referrerPolicy
    }));

    // 5. Permissions Policy
    app.use((req, res, next) => {
        const permissions = Object.entries(securityHeaders.permissionsPolicy)
            .map(([feature, allowlist]) => `${feature}=(${allowlist.join(' ')})`)
            .join(', ');
        res.setHeader('Permissions-Policy', permissions);
        next();
    });

    // 6. Frame Guard (X-Frame-Options)
    app.use(helmet.frameguard(securityHeaders.frameGuard));

    // 7. No Sniff (X-Content-Type-Options)
    app.use(helmet.noSniff());

    // 8. XSS Protection
    app.use(xss());

    // 9. NoSQL Injection Protection
    app.use(mongoSanitize());

    // 10. Parameter Pollution Prevention
    app.use(hpp());

    // 11. DNS Prefetch Control
    app.use(helmet.dnsPrefetchControl(securityHeaders.dnsPrefetchControl));

    // 12. Expect-CT Header
    if (securityHeaders.expectCt.reportUri) {
        app.use((req, res, next) => {
            res.setHeader(
                'Expect-CT',
                `max-age=${securityHeaders.expectCt.maxAge}, enforce, report-uri="${securityHeaders.expectCt.reportUri}"`
            );
            next();
        });
    }

    // 13. Rate Limiting
    // General API rate limit
    const apiLimiter = rateLimit(rateLimitConfig);
    app.use('/api/', apiLimiter);

    // Stricter rate limiting for authentication routes
    const authLimiter = rateLimit({
        ...rateLimitConfig,
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5 // 5 requests per hour
    });
    app.use('/api/auth/', authLimiter);

    // 14. CORS
    app.use(cors(corsConfig));

    // 15. Remove sensitive headers and add security headers
    app.use((req, res, next) => {
        // Remove sensitive headers
        res.removeHeader('X-Powered-By');
        res.removeHeader('Server');

        // Add security headers
        res.setHeader('X-Content-Security-Policy', 'default-src \'self\'');
        res.setHeader('X-WebKit-CSP', 'default-src \'self\'');
        res.setHeader('X-Download-Options', 'noopen');
        res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

        next();
    });

    // 16. Security Error Handler
    app.use((err, req, res, next) => {
        if (err.code === 'EBADCSRFTOKEN') {
            return res.status(403).json({
                status: 'error',
                message: 'Invalid or missing CSRF token'
            });
        }
        if (err.name === 'UnauthorizedError') {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid or missing authentication token'
            });
        }
        next(err);
    });
};

module.exports = setupSecurity;
