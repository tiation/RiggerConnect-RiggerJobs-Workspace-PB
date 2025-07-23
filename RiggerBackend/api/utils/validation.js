const { body, param, query } = require('express-validator');

/**
 * Common validation rules for user-related routes
 */
const userValidationRules = {
    // Registration validation
    register: [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/)
            .withMessage('Password must contain at least one lowercase letter')
            .matches(/\d/)
            .withMessage('Password must contain at least one number')
            .matches(/[!@#$%^&*(),.?":{}|<>]/)
            .withMessage('Password must contain at least one special character'),
        body('passwordConfirm')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            })
    ],

    // Login validation
    login: [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],

    // Password reset validation
    resetPassword: [
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/)
            .withMessage('Password must contain at least one lowercase letter')
            .matches(/\d/)
            .withMessage('Password must contain at least one number')
            .matches(/[!@#$%^&*(),.?":{}|<>]/)
            .withMessage('Password must contain at least one special character'),
        body('passwordConfirm')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            })
    ],

    // Email verification validation
    verifyEmail: [
        param('token')
            .notEmpty()
            .withMessage('Verification token is required')
            .isLength({ min: 32, max: 32 })
            .withMessage('Invalid verification token format')
    ]
};

/**
 * Common validation rules for authentication-related routes
 */
const authValidationRules = {
    // 2FA token validation
    verify2FA: [
        body('token')
            .notEmpty()
            .withMessage('2FA token is required')
            .isLength({ min: 6, max: 6 })
            .withMessage('2FA token must be 6 digits')
            .matches(/^\d+$/)
            .withMessage('2FA token must contain only numbers')
    ],

    // API key validation
    apiKey: [
        query('apiKey')
            .optional()
            .isLength({ min: 32, max: 32 })
            .withMessage('Invalid API key format')
            .matches(/^[a-f0-9]{32}$/i)
            .withMessage('Invalid API key format')
    ]
};

/**
 * Common validation rules for session-related routes
 */
const sessionValidationRules = {
    // Session token validation
    validateSession: [
        body('sessionId')
            .notEmpty()
            .withMessage('Session ID is required')
            .isLength({ min: 32 })
            .withMessage('Invalid session ID format')
    ]
};

/**
 * Sanitization rules for user input
 */
const sanitizationRules = {
    // Common fields sanitization
    commonFields: [
        body('email').trim().toLowerCase(),
        body('name').trim().escape(),
        body('description').trim().escape(),
        body('message').trim().escape()
    ]
};

module.exports = {
    userValidationRules,
    authValidationRules,
    sessionValidationRules,
    sanitizationRules
};
