const crypto = require('crypto');

/**
 * Generates a cryptographically secure random token
 * @param {number} bytes - Number of bytes for the token
 * @returns {string} Hex string of the token
 */
const generateSecureToken = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hashes a token using SHA-256
 * @param {string} token - Token to hash
 * @returns {string} Hashed token
 */
const hashToken = token => {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with status and message
 */
const validatePasswordStrength = password => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const validations = [
        {
            isValid: password.length >= minLength,
            message: 'Password must be at least 8 characters long'
        },
        {
            isValid: hasUpperCase,
            message: 'Password must contain at least one uppercase letter'
        },
        {
            isValid: hasLowerCase,
            message: 'Password must contain at least one lowercase letter'
        },
        {
            isValid: hasNumbers,
            message: 'Password must contain at least one number'
        },
        {
            isValid: hasSpecialChar,
            message: 'Password must contain at least one special character'
        }
    ];

    const failedValidations = validations.filter(v => !v.isValid);

    return {
        isValid: failedValidations.length === 0,
        message: failedValidations.map(v => v.message).join(', ')
    };
};

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
const sanitizeInput = input => {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Validates API key format and requirements
 * @param {string} apiKey - API key to validate
 * @returns {boolean} Whether the API key is valid
 */
const validateApiKey = apiKey => {
    // API key should be 32 characters long and contain only hex characters
    const apiKeyRegex = /^[a-f0-9]{32}$/i;
    return apiKeyRegex.test(apiKey);
};

/**
 * Generates a secure session ID
 * @returns {string} Secure session ID
 */
const generateSessionId = () => {
    return crypto.randomBytes(32).toString('base64');
};

/**
 * Safely compares two strings in constant time to prevent timing attacks
 * @param {string} a - First string to compare
 * @param {string} b - Second string to compare
 * @returns {boolean} Whether the strings are equal
 */
const safeCompare = (a, b) => {
    if (typeof a !== 'string' || typeof b !== 'string') {
        return false;
    }
    
    if (a.length !== b.length) {
        return false;
    }
    
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

module.exports = {
    generateSecureToken,
    hashToken,
    validatePasswordStrength,
    sanitizeInput,
    validateApiKey,
    generateSessionId,
    safeCompare
};
