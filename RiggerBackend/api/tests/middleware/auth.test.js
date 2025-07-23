const jwt = require('jsonwebtoken');
const { protect } = require('../../middleware/auth');
const User = require('../../models/user');

// Mock User model
jest.mock('../../models/user');

describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            headers: {},
            user: null
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('protect middleware', () => {
        it('should return 401 if no token is provided', async () => {
            await protect(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'You are not logged in. Please log in to get access.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 if token is invalid', async () => {
            mockReq.headers.authorization = 'Bearer invalid_token';

            await protect(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Invalid token or session expired'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 if user no longer exists', async () => {
            const token = jwt.sign({ id: 'user_id' }, process.env.JWT_SECRET);
            mockReq.headers.authorization = `Bearer ${token}`;
            User.findById.mockResolvedValue(null);

            await protect(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'The user belonging to this token no longer exists.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 403 if email is not verified', async () => {
            const token = jwt.sign({ id: 'user_id' }, process.env.JWT_SECRET);
            mockReq.headers.authorization = `Bearer ${token}`;
            User.findById.mockResolvedValue({
                id: 'user_id',
                emailVerified: false,
                passwordChangedAfter: () => false
            });

            await protect(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Please verify your email address to access this resource.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next() if token is valid and user exists', async () => {
            const token = jwt.sign({ id: 'user_id' }, process.env.JWT_SECRET);
            mockReq.headers.authorization = `Bearer ${token}`;
            const mockUser = {
                id: 'user_id',
                emailVerified: true,
                twoFactorEnabled: false,
                passwordChangedAfter: () => false
            };
            User.findById.mockResolvedValue(mockUser);

            await protect(mockReq, mockRes, mockNext);

            expect(mockReq.user).toBe(mockUser);
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
        });

        it('should return 403 if 2FA is enabled but not verified', async () => {
            const token = jwt.sign({ id: 'user_id' }, process.env.JWT_SECRET);
            mockReq.headers.authorization = `Bearer ${token}`;
            User.findById.mockResolvedValue({
                id: 'user_id',
                emailVerified: true,
                twoFactorEnabled: true,
                twoFactorVerified: false,
                passwordChangedAfter: () => false
            });

            await protect(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Please complete two-factor authentication.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});
