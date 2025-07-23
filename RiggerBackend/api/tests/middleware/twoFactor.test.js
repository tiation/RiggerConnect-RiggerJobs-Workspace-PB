const { setup2FA, verify2FASetup, verify2FAToken, disable2FA } = require('../../middleware/twoFactor');
const User = require('../../models/user');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

jest.mock('../../models/user');
jest.mock('speakeasy');
jest.mock('qrcode');

describe('Two-Factor Authentication Middleware', () => {
    let mockReq;
    let mockRes;
    let mockUser;

    beforeEach(() => {
        mockUser = {
            email: 'test@example.com',
            twoFactorSecret: null,
            twoFactorEnabled: false,
            twoFactorVerified: false,
            save: jest.fn().mockResolvedValue(true)
        };

        mockReq = {
            user: mockUser,
            body: {}
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('setup2FA', () => {
        it('should generate and save 2FA secret', async () => {
            const mockSecret = {
                base32: 'TESTBASE32SECRET',
                otpauth_url: 'otpauth://totp/test'
            };
            const mockQRCode = 'data:image/png;base64,mockQRCode';

            speakeasy.generateSecret.mockReturnValue(mockSecret);
            QRCode.toDataURL.mockResolvedValue(mockQRCode);

            await setup2FA(mockReq, mockRes);

            expect(speakeasy.generateSecret).toHaveBeenCalledWith({
                name: `RiggerHireApp:${mockUser.email}`
            });
            expect(mockUser.twoFactorSecret).toBe(mockSecret.base32);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'success',
                data: {
                    qrCode: mockQRCode,
                    secret: mockSecret.base32
                }
            });
        });

        it('should handle errors during setup', async () => {
            const error = new Error('Setup failed');
            mockUser.save.mockRejectedValue(error);

            await setup2FA(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Error setting up 2FA'
            });
        });
    });

    describe('verify2FASetup', () => {
        beforeEach(() => {
            mockUser.twoFactorSecret = 'TESTBASE32SECRET';
            mockReq.body.token = '123456';
        });

        it('should enable 2FA when token is valid', async () => {
            speakeasy.totp.verify.mockReturnValue(true);

            await verify2FASetup(mockReq, mockRes);

            expect(speakeasy.totp.verify).toHaveBeenCalledWith({
                secret: mockUser.twoFactorSecret,
                encoding: 'base32',
                token: mockReq.body.token
            });
            expect(mockUser.twoFactorEnabled).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'success',
                message: '2FA enabled successfully'
            });
        });

        it('should reject invalid tokens', async () => {
            speakeasy.totp.verify.mockReturnValue(false);

            await verify2FASetup(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Invalid 2FA token'
            });
            expect(mockUser.twoFactorEnabled).toBe(false);
        });
    });

    describe('verify2FAToken', () => {
        beforeEach(() => {
            mockUser.twoFactorEnabled = true;
            mockUser.twoFactorSecret = 'TESTBASE32SECRET';
            mockReq.body.token = '123456';
        });

        it('should verify valid 2FA tokens', async () => {
            speakeasy.totp.verify.mockReturnValue(true);

            await verify2FAToken(mockReq, mockRes);

            expect(mockUser.twoFactorVerified).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'success',
                message: '2FA verification successful'
            });
        });

        it('should reject invalid tokens', async () => {
            speakeasy.totp.verify.mockReturnValue(false);

            await verify2FAToken(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Invalid 2FA token'
            });
            expect(mockUser.twoFactorVerified).toBe(false);
        });

        it('should handle disabled 2FA', async () => {
            mockUser.twoFactorEnabled = false;

            await verify2FAToken(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'error',
                message: '2FA is not enabled for this user'
            });
        });
    });

    describe('disable2FA', () => {
        it('should disable 2FA successfully', async () => {
            await disable2FA(mockReq, mockRes);

            expect(mockUser.twoFactorSecret).toBeUndefined();
            expect(mockUser.twoFactorEnabled).toBe(false);
            expect(mockUser.twoFactorVerified).toBe(false);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'success',
                message: '2FA disabled successfully'
            });
        });

        it('should handle errors during disable', async () => {
            const error = new Error('Disable failed');
            mockUser.save.mockRejectedValue(error);

            await disable2FA(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Error disabling 2FA'
            });
        });
    });
});
