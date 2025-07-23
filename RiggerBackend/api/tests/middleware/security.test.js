const setupSecurity = require('../../middleware/security');
const express = require('express');

describe('Security Middleware', () => {
    let app;
    let mockUse;

    beforeEach(() => {
        mockUse = jest.fn();
        app = {
            use: mockUse
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set up all security middleware', () => {
        setupSecurity(app);

        // Verify helmet and its configurations are applied
        expect(mockUse).toHaveBeenCalledTimes(6); // helmet, rate limiter, mongoSanitize, xss, hpp, CSP

        // Verify rate limiting configuration
        const rateLimitCall = mockUse.mock.calls.find(call => 
            call[0] === '/api' && typeof call[1] === 'function'
        );
        expect(rateLimitCall).toBeTruthy();

        // Verify Content Security Policy
        const cspCall = mockUse.mock.calls.find(call => 
            call[1] && call[1].directives && call[1].directives.defaultSrc
        );
        expect(cspCall).toBeTruthy();
        
        const cspConfig = cspCall[1];
        expect(cspConfig.directives).toEqual({
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.stripe.com"],
            frameSrc: ["'self'", "https://js.stripe.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        });
    });

    it('should configure session security correctly', () => {
        setupSecurity(app);

        const sessionCall = mockUse.mock.calls.find(call => 
            call[1] && call[1].name === 'sessionId'
        );
        expect(sessionCall).toBeTruthy();

        const sessionConfig = sessionCall[1];
        expect(sessionConfig).toEqual(expect.objectContaining({
            name: 'sessionId',
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            }
        }));
    });

    // Test rate limiting configuration
    it('should configure rate limiting correctly', () => {
        setupSecurity(app);

        const rateLimitCall = mockUse.mock.calls.find(call => 
            call[0] === '/api' && typeof call[1] === 'function'
        );
        expect(rateLimitCall).toBeTruthy();

        const rateLimitConfig = rateLimitCall[1];
        expect(rateLimitConfig).toBeDefined();
        expect(rateLimitConfig.windowMs).toBe(60 * 60 * 1000); // 1 hour
        expect(rateLimitConfig.max).toBe(100);
    });

    // Test XSS protection
    it('should apply XSS protection', () => {
        setupSecurity(app);

        const xssCall = mockUse.mock.calls.find(call => 
            call[1] && typeof call[1] === 'function' && call[1].name === 'xss'
        );
        expect(xssCall).toBeTruthy();
    });

    // Test MongoDB query injection protection
    it('should apply MongoDB query injection protection', () => {
        setupSecurity(app);

        const mongoSanitizeCall = mockUse.mock.calls.find(call => 
            call[1] && typeof call[1] === 'function' && call[1].name === 'mongoSanitize'
        );
        expect(mongoSanitizeCall).toBeTruthy();
    });

    // Test parameter pollution protection
    it('should apply parameter pollution protection', () => {
        setupSecurity(app);

        const hppCall = mockUse.mock.calls.find(call => 
            call[1] && typeof call[1] === 'function' && call[1].name === 'hpp'
        );
        expect(hppCall).toBeTruthy();
    });
});
