import { NotificationProvider } from './index';
import { NotificationChannel, Recipient } from '../types';
import sgMail from '@sendgrid/mail';

export class SendGridService implements NotificationProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async send(recipient: Recipient, subject: string, content: string): Promise<boolean> {
    if (!recipient.email) {
      throw new Error('Recipient email is required');
    }

    try {
      const msg = {
        to: recipient.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'notifications@riggerhireapp.com',
        subject,
        html: content,
        customArgs: {
          recipientId: recipient.id,
          timezone: recipient.timezone
        },
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true }
        }
      };

      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.error('SendGrid error:', error);
      return false;
    }
  }

  supports(channel: NotificationChannel): boolean {
    return channel === NotificationChannel.EMAIL;
  }
}
