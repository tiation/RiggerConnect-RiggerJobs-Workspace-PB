const {
    sendEmail,
    createVerificationEmailContent,
    createPasswordResetEmailContent
} = require('../../utils/email');
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('Email Utils', () => {
    let mockTransporter;

    beforeEach(() => {
        mockTransporter = {
            sendMail: jest.fn().mockResolvedValue(true)
        };
        nodemailer.createTransport.mockReturnValue(mockTransporter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('sendEmail', () => {
        it('should send email successfully', async () => {
            const emailOptions = {
                email: 'test@example.com',
                subject: 'Test Subject',
                message: 'Test Message',
                html: '<p>Test HTML</p>'
            };

            await sendEmail(emailOptions);

            expect(nodemailer.createTransport).toHaveBeenCalledWith({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: process.env.EMAIL_PORT === '465',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: process.env.EMAIL_FROM,
                to: emailOptions.email,
                subject: emailOptions.subject,
                text: emailOptions.message,
                html: emailOptions.html
            });
        });

        it('should handle email sending errors', async () => {
            mockTransporter.sendMail.mockRejectedValue(new Error('Send failed'));

            await expect(sendEmail({
                email: 'test@example.com',
                subject: 'Test',
                message: 'Test'
            })).rejects.toThrow('Error sending email');
        });
    });

    describe('createVerificationEmailContent', () => {
        it('should create correct verification email content', () => {
            const name = 'John Doe';
            const verificationUrl = 'https://example.com/verify/123';

            const content = createVerificationEmailContent(name, verificationUrl);

            expect(content).toHaveProperty('text');
            expect(content).toHaveProperty('html');

            // Text content checks
            expect(content.text).toContain(name);
            expect(content.text).toContain(verificationUrl);
            expect(content.text).toContain('verify your email');

            // HTML content checks
            expect(content.html).toContain(name);
            expect(content.html).toContain(verificationUrl);
            expect(content.html).toContain('Verify Email');
            expect(content.html).toContain('<div');
            expect(content.html).toContain('</div>');
        });
    });

    describe('createPasswordResetEmailContent', () => {
        it('should create correct password reset email content', () => {
            const name = 'John Doe';
            const resetUrl = 'https://example.com/reset/123';

            const content = createPasswordResetEmailContent(name, resetUrl);

            expect(content).toHaveProperty('text');
            expect(content).toHaveProperty('html');

            // Text content checks
            expect(content.text).toContain(name);
            expect(content.text).toContain(resetUrl);
            expect(content.text).toContain('reset your password');
            expect(content.text).toContain('10 minutes');

            // HTML content checks
            expect(content.html).toContain(name);
            expect(content.html).toContain(resetUrl);
            expect(content.html).toContain('Reset Password');
            expect(content.html).toContain('10 minutes');
            expect(content.html).toContain('<div');
            expect(content.html).toContain('</div>');
        });
    });
});
