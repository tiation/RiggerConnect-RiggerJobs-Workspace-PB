import { NotificationChannel, Recipient } from '../types';
import { SendGridService } from './sendgrid.provider';
import { TwilioService } from './twilio.provider';
import { FirebaseService } from './firebase.provider';

export interface NotificationProvider {
  send(recipient: Recipient, subject: string, content: string): Promise<boolean>;
  supports(channel: NotificationChannel): boolean;
}

export class NotificationProviderFactory {
  private providers: Map<NotificationChannel, NotificationProvider>;

  constructor() {
    this.providers = new Map();
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize email provider (SendGrid)
    this.providers.set(NotificationChannel.EMAIL, new SendGridService());

    // Initialize SMS provider (Twilio)
    this.providers.set(NotificationChannel.SMS, new TwilioService());

    // Initialize push notification provider (Firebase)
    this.providers.set(NotificationChannel.PUSH, new FirebaseService());
  }

  getProvider(channel: NotificationChannel): NotificationProvider {
    const provider = this.providers.get(channel);
    if (!provider) {
      throw new Error(`No provider found for channel: ${channel}`);
    }
    return provider;
  }
}
