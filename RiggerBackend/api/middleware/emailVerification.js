const crypto = require('crypto');
const sendEmail = require('../utils/email');

const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

const sendVerificationEmail = async (user, verificationUrl) => {
    const message = `
        Welcome to RiggerHireApp! Please verify your email address by clicking the link below:\n\n
        ${verificationUrl}\n\n
        If you didn't create an account, please ignore this email.
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Email Verification - RiggerHireApp',
            message
        });

        return true;
    } catch (error) {
        console.error('Email verification error:', error);
        return false;
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        
        // Find user with verification token
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Token is invalid or has expired'
            });
        }

        // Update user verification status
        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        return res.status(200).json({
            status: 'success',
            message: 'Email verified successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error verifying email'
        });
    }
};

module.exports = {
    generateVerificationToken,
    sendVerificationEmail,
    verifyEmail
};
