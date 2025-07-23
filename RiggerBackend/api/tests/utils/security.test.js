const {
    generateSecureToken,
    hashToken,
    validatePasswordStrength,
    sanitizeInput,
    validateApiKey,
    generateSessionId,
    safeCompare
} = require('../../utils/security');

describe('Security Utils', () => {
    describe('generateSecureToken', () => {
        it('should generate a token of specified length', () => {
            const token = generateSecureToken(32);
            expect(token).toHaveLength(64); // hex string is twice the byte length
        });

        it('should generate different tokens each time', () => {
            const token1 = generateSecureToken();
            const token2 = generateSecureToken();
            expect(token1).not.toBe(token2);
        });
    });

    describe('hashToken', () => {
        it('should generate consistent hashes for the same input', () => {
            const input = 'test-token';
            const hash1 = hashToken(input);
            const hash2 = hashToken(input);
            expect(hash1).toBe(hash2);
        });

        it('should generate different hashes for different inputs', () => {
            const hash1 = hashToken('token1');
            const hash2 = hashToken('token2');
            expect(hash1).not.toBe(hash2);
        });
    });

    describe('validatePasswordStrength', () => {
        it('should validate strong passwords', () => {
            const result = validatePasswordStrength('StrongP@ss123');
            expect(result.isValid).toBe(true);
        });

        it('should reject weak passwords', () => {
            const testCases = [
                'short',              // too short
                'nouppercase123!',    // no uppercase
                'NOLOWERCASE123!',    // no lowercase
                'NoSpecialChar123',   // no special char
                'NoNumbers!@#',       // no numbers
            ];

            testCases.forEach(password => {
                const result = validatePasswordStrength(password);
                expect(result.isValid).toBe(false);
                expect(result.message).toBeTruthy();
            });
        });

        it('should provide specific error messages', () => {
            const result = validatePasswordStrength('weak');
            expect(result.message).toContain('Password must be at least 8 characters long');
            expect(result.message).toContain('uppercase letter');
            expect(result.message).toContain('number');
            expect(result.message).toContain('special character');
        });
    });

    describe('sanitizeInput', () => {
        it('should sanitize HTML special characters', () => {
            const input = '<script>alert("xss")</script>';
            const sanitized = sanitizeInput(input);
            expect(sanitized).not.toContain('<');
            expect(sanitized).not.toContain('>');
        });

        it('should handle non-string inputs', () => {
            const inputs = [123, null, undefined, { key: 'value' }];
            inputs.forEach(input => {
                expect(() => sanitizeInput(input)).not.toThrow();
            });
        });
    });

    describe('validateApiKey', () => {
        it('should validate correct API key format', () => {
            const validKey = '1234567890abcdef1234567890abcdef';
            expect(validateApiKey(validKey)).toBe(true);
        });

        it('should reject invalid API key formats', () => {
            const invalidKeys = [
                'short',
                'toolong1234567890abcdef1234567890abcdef',
                '!@#$%^&*()',
                '1234567890abcdef1234567890abcdeg' // 'g' is not hex
            ];

            invalidKeys.forEach(key => {
                expect(validateApiKey(key)).toBe(false);
            });
        });
    });

    describe('generateSessionId', () => {
        it('should generate a base64 string', () => {
            const sessionId = generateSessionId();
            expect(typeof sessionId).toBe('string');
            expect(() => Buffer.from(sessionId, 'base64')).not.toThrow();
        });

        it('should generate unique session IDs', () => {
            const id1 = generateSessionId();
            const id2 = generateSessionId();
            expect(id1).not.toBe(id2);
        });
    });

    describe('safeCompare', () => {
        it('should return true for identical strings', () => {
            expect(safeCompare('test-string', 'test-string')).toBe(true);
        });

        it('should return false for different strings', () => {
            expect(safeCompare('string1', 'string2')).toBe(false);
        });

        it('should handle different length strings', () => {
            expect(safeCompare('short', 'longer-string')).toBe(false);
        });

        it('should handle non-string inputs', () => {
            expect(safeCompare(123, '123')).toBe(false);
            expect(safeCompare(null, 'null')).toBe(false);
            expect(safeCompare(undefined, 'undefined')).toBe(false);
        });
    });
});
