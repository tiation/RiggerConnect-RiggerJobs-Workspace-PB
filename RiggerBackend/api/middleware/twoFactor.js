const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/user');

const setup2FA = async (req, res) => {
    try {
        const user = req.user;

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `RiggerHireApp:${user.email}`
        });

        // Save secret to user
        user.twoFactorSecret = secret.base32;
        user.twoFactorEnabled = false;
        await user.save();

        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

        res.status(200).json({
            status: 'success',
            data: {
                qrCode: qrCodeUrl,
                secret: secret.base32
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error setting up 2FA'
        });
    }
};

const verify2FASetup = async (req, res) => {
    try {
        const { token } = req.body;
        const user = req.user;

        // Verify token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (!verified) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid 2FA token'
            });
        }

        // Enable 2FA
        user.twoFactorEnabled = true;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: '2FA enabled successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error verifying 2FA setup'
        });
    }
};

const verify2FAToken = async (req, res) => {
    try {
        const { token } = req.body;
        const user = req.user;

        if (!user.twoFactorEnabled) {
            return res.status(400).json({
                status: 'error',
                message: '2FA is not enabled for this user'
            });
        }

        // Verify token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (!verified) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid 2FA token'
            });
        }

        // Mark session as 2FA verified
        user.twoFactorVerified = true;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: '2FA verification successful'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error verifying 2FA token'
        });
    }
};

const disable2FA = async (req, res) => {
    try {
        const user = req.user;

        user.twoFactorSecret = undefined;
        user.twoFactorEnabled = false;
        user.twoFactorVerified = false;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: '2FA disabled successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error disabling 2FA'
        });
    }
};

module.exports = {
    setup2FA,
    verify2FASetup,
    verify2FAToken,
    disable2FA
};
