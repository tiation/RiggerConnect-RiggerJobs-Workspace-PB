import { Queue } from 'bull';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import nodemailer from 'nodemailer';

// Email Queue Configuration
export const emailQueue = new Queue('email-notifications', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Email Queue Process
emailQueue.process(async (job) => {
  const { to, subject, html } = job.data;
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    
    return { messageId: info.messageId, status: 'sent' };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
});

// Monitor failed jobs
emailQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
  // Implement retry logic or alert system here
});
