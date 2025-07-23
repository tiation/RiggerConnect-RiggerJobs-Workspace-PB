const crypto = require('crypto');
const User = require('../models/user');
const sendEmail = require('../utils/email');

const forgotPassword = async (req, res) => {
    try {
        // 1. Get user based on email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'There is no user with that email address'
            });
        }

        // 2. Generate random reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // 3. Send it to user's email
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        const message = `
            Forgot your password? Submit a PATCH request with your new password to: \n\n
            ${resetURL}\n\n
            If you didn't forget your password, please ignore this email.
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 minutes)',
                message
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                status: 'error',
                message: 'There was an error sending the email. Try again later!'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error processing password reset request'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        // 1. Get user based on token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        // 2. If token has not expired, and there is user, set the new password
        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Token is invalid or has expired'
            });
        }

        // 3. Update password and remove reset token
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // 4. Log the user in, send JWT
        const token = user.generateAuthToken();

        res.status(200).json({
            status: 'success',
            token
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error resetting password'
        });
    }
};

module.exports = {
    forgotPassword,
    resetPassword
};
