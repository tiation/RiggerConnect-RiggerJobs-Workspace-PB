const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email transporter configuration
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Validation middleware
const contactValidation = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('company')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Company name must be between 2 and 100 characters'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters'),
    body('type')
        .optional()
        .isIn(['general_inquiry', 'support', 'partnership', 'sales'])
        .withMessage('Invalid inquiry type')
];

/**
 * @route   POST /api/contact
 * @desc    Handle contact form submissions
 * @access  Public
 */
router.post('/', contactValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { firstName, lastName, email, company, message, type = 'general_inquiry' } = req.body;

        // Create email transporter
        const transporter = createTransporter();

        // Email content
        const emailContent = {
            from: process.env.SMTP_USER,
            to: process.env.CONTACT_EMAIL || 'hello@riggerhire.com.au',
            subject: `New Contact Form Submission - ${type.replace('_', ' ').toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #00d4ff 0%, #ff0080 100%); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🏗️ RiggerHire Contact Form</h1>
                    </div>
                    
                    <div style="padding: 30px; background: #f8f9fa;">
                        <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #00d4ff; margin-top: 0;">Contact Information</h3>
                            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p><strong>Company:</strong> ${company}</p>
                            <p><strong>Inquiry Type:</strong> ${type.replace('_', ' ').toUpperCase()}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleString('en-AU')}</p>
                        </div>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px;">
                            <h3 style="color: #00d4ff; margin-top: 0;">Message</h3>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #00d4ff;">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="mailto:${email}" style="background: linear-gradient(135deg, #00d4ff 0%, #ff0080 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                                Reply to ${firstName}
                            </a>
                        </div>
                    </div>
                    
                    <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
                        <p>This email was sent from the RiggerHire website contact form.</p>
                        <p>© ${new Date().getFullYear()} RiggerHire - Western Australia's Premier Labour Solutions</p>
                    </div>
                </div>
            `,
            text: `
                New Contact Form Submission - ${type.replace('_', ' ').toUpperCase()}
                
                Contact Information:
                Name: ${firstName} ${lastName}
                Email: ${email}
                Company: ${company}
                Inquiry Type: ${type.replace('_', ' ').toUpperCase()}
                Date: ${new Date().toLocaleString('en-AU')}
                
                Message:
                ${message}
                
                ---
                This email was sent from the RiggerHire website contact form.
            `
        };

        // Auto-reply email to sender
        const autoReplyContent = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Thank you for contacting RiggerHire - We\'ll be in touch soon!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #00d4ff 0%, #ff0080 100%); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🏗️ RiggerHire</h1>
                        <p style="color: white; margin: 10px 0 0 0;">Premium Labour Solutions for Western Australia</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f8f9fa;">
                        <h2 style="color: #333;">Thank you for your inquiry, ${firstName}!</h2>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p>We've received your message and our team will review it shortly. Here's what you can expect:</p>
                            
                            <ul style="color: #666; line-height: 1.6;">
                                <li><strong>Response Time:</strong> We typically respond within 24 hours during business days</li>
                                <li><strong>Business Hours:</strong> Monday - Friday: 7:00 AM - 6:00 PM AWST</li>
                                <li><strong>Emergency Support:</strong> For urgent matters, call +61 8 1234 5678</li>
                            </ul>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 0, 128, 0.1) 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #00d4ff; margin-top: 0;">Your Message Summary</h3>
                            <p><strong>Company:</strong> ${company}</p>
                            <p><strong>Inquiry Type:</strong> ${type.replace('_', ' ').toUpperCase()}</p>
                            <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-AU')}</p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <h3 style="color: #333;">While you wait, explore our services:</h3>
                            <div style="margin: 20px 0;">
                                <a href="https://riggerhire.com.au/services" style="background: #00d4ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 5px;">Our Services</a>
                                <a href="https://riggerhire.com.au/safety" style="background: #ff0080; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 5px;">Safety Standards</a>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #333; color: white; padding: 20px; text-align: center;">
                        <h3 style="color: #00d4ff; margin-top: 0;">Contact Information</h3>
                        <p><strong>Email:</strong> hello@riggerhire.com.au</p>
                        <p><strong>Phone:</strong> +61 8 1234 5678</p>
                        <p><strong>Office:</strong> Perth, Western Australia</p>
                        
                        <div style="margin-top: 20px; font-size: 12px; color: #ccc;">
                            <p>© ${new Date().getFullYear()} RiggerHire. All rights reserved.</p>
                            <p>Built with ❤️ for Western Australia's workforce</p>
                        </div>
                    </div>
                </div>
            `,
            text: `
                Thank you for your inquiry, ${firstName}!
                
                We've received your message and our team will review it shortly. Here's what you can expect:
                
                • Response Time: We typically respond within 24 hours during business days
                • Business Hours: Monday - Friday: 7:00 AM - 6:00 PM AWST  
                • Emergency Support: For urgent matters, call +61 8 1234 5678
                
                Your Message Summary:
                Company: ${company}
                Inquiry Type: ${type.replace('_', ' ').toUpperCase()}
                Submitted: ${new Date().toLocaleString('en-AU')}
                
                Contact Information:
                Email: hello@riggerhire.com.au
                Phone: +61 8 1234 5678
                Office: Perth, Western Australia
                
                © ${new Date().getFullYear()} RiggerHire. All rights reserved.
                Built with ❤️ for Western Australia's workforce
            `
        };

        // Send emails
        try {
            // Send notification to admin
            await transporter.sendMail(emailContent);
            
            // Send auto-reply to user
            await transporter.sendMail(autoReplyContent);

            res.status(200).json({
                success: true,
                message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
                data: {
                    firstName,
                    lastName,
                    email,
                    company,
                    type,
                    submittedAt: new Date().toISOString()
                }
            });

        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            
            // Still return success to user, but log the error
            res.status(200).json({
                success: true,
                message: 'Thank you for your message! We\'ll get back to you soon.',
                warning: 'Email notification may be delayed'
            });
        }

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your message. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route   GET /api/contact/test
 * @desc    Test email configuration
 * @access  Private (development only)
 */
router.get('/test', async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({
            success: false,
            message: 'Test endpoint only available in development'
        });
    }

    try {
        const transporter = createTransporter();
        await transporter.verify();
        
        res.status(200).json({
            success: true,
            message: 'Email configuration is valid',
            config: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                user: process.env.SMTP_USER ? '***configured***' : 'not configured'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Email configuration test failed',
            error: error.message
        });
    }
});

module.exports = router;
