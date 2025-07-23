const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // 3) Actually send the email
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email send error:', error);
        throw new Error('Error sending email');
    }
};

const createVerificationEmailContent = (name, verificationUrl) => {
    return {
        text: `
            Welcome to RiggerHireApp, ${name}!
            
            Please verify your email address by clicking the link below:
            ${verificationUrl}
            
            If you did not create an account, please ignore this email.
            
            Best regards,
            The RiggerHireApp Team
        `,
        html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="background-color: white; padding: 20px; border-radius: 10px;">
                    <h2>Welcome to RiggerHireApp, ${name}!</h2>
                    <p>Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="background-color: #4CAF50; color: white; padding: 15px 32px; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Verify Email
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        If you did not create an account, please ignore this email.
                    </p>
                    <hr style="border: 1px solid #f6f6f6;">
                    <p style="color: #666; font-size: 12px;">
                        Best regards,<br>
                        The RiggerHireApp Team
                    </p>
                </div>
            </div>
        `
    };
};

const createPasswordResetEmailContent = (name, resetUrl) => {
    return {
        text: `
            Hi ${name},
            
            You recently requested to reset your password for your RiggerHireApp account.
            Click the link below to reset it:
            ${resetUrl}
            
            If you did not request a password reset, please ignore this email or contact support if you have concerns.
            This password reset link is only valid for 10 minutes.
            
            Best regards,
            The RiggerHireApp Team
        `,
        html: `
            <div style="background-color: #f6f6f6; padding: 20px;">
                <div style="background-color: white; padding: 20px; border-radius: 10px;">
                    <h2>Password Reset Request</h2>
                    <p>Hi ${name},</p>
                    <p>You recently requested to reset your password for your RiggerHireApp account.
                       Click the button below to reset it:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #4CAF50; color: white; padding: 15px 32px; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        If you did not request a password reset, please ignore this email or contact support if you have concerns.<br>
                        This password reset link is only valid for 10 minutes.
                    </p>
                    <hr style="border: 1px solid #f6f6f6;">
                    <p style="color: #666; font-size: 12px;">
                        Best regards,<br>
                        The RiggerHireApp Team
                    </p>
                </div>
            </div>
        `
    };
};

module.exports = {
    sendEmail,
    createVerificationEmailContent,
    createPasswordResetEmailContent
};
