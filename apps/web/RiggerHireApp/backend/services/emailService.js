const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify Your RiggerHireApp Account',
      html: `
        <h2>Welcome to RiggerHireApp!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your RiggerHireApp Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email and ensure your account is secure.</p>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendTwoFactorCode(email, code) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your RiggerHireApp Two-Factor Authentication Code',
      html: `
        <h2>Two-Factor Authentication Code</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 4px;">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please secure your account immediately.</p>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();
