import {
  NotificationRequest,
  NotificationTemplate,
  DeliveryStatus,
  NotificationChannel,
  NotificationPriority,
  NotificationBatch
} from '../types';
import { NotificationProviderFactory } from '../providers';
import { Channel, Connection } from 'amqplib';

export class NotificationService {
  private providerFactory: NotificationProviderFactory;
  private channel: Channel;
  private readonly QUEUE_NAME = 'notifications';

  constructor(connection: Connection) {
    this.providerFactory = new NotificationProviderFactory();
    this.initializeQueue(connection);
  }

  private async initializeQueue(connection: Connection): Promise<void> {
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.QUEUE_NAME, {
      durable: true,
      deadLetterExchange: 'dlx.notifications'
    });
  }

  /**
   * Send a notification through specified channels
   */
  async send(request: NotificationRequest): Promise<DeliveryStatus[]> {
    const deliveryStatuses: DeliveryStatus[] = [];

    for (const recipient of request.recipients) {
      // Check recipient preferences and unsubscribed categories
      const channels = this.getEligibleChannels(recipient, request);
      
      for (const channel of channels) {
        try {
          const provider = this.providerFactory.getProvider(channel);
          const success = await provider.send(
            recipient,
            this.interpolateTemplate(request.template, request.variables),
            request.content
          );

          deliveryStatuses.push({
            notificationId: request.id,
            recipientId: recipient.id,
            channel,
            status: success ? 'DELIVERED' : 'FAILED',
            attemptCount: 1,
            lastAttempt: new Date()
          });
        } catch (error) {
          deliveryStatuses.push({
            notificationId: request.id,
            recipientId: recipient.id,
            channel,
            status: 'FAILED',
            attemptCount: 1,
            lastAttempt: new Date(),
            error: error.message
          });
        }
      }
    }

    return deliveryStatuses;
  }

  /**
   * Queue a notification for later delivery
   */
  async queue(request: NotificationRequest): Promise<void> {
    await this.channel.sendToQueue(
      this.QUEUE_NAME,
      Buffer.from(JSON.stringify(request)),
      {
        persistent: true,
        priority: this.getPriorityValue(request.priority)
      }
    );
  }

  /**
   * Process a batch of notifications
   */
  async processBatch(batch: NotificationBatch): Promise<void> {
    let processedCount = 0;
    let failedCount = 0;

    for (const notification of batch.notifications) {
      try {
        await this.send(notification);
        processedCount++;
      } catch (error) {
        failedCount++;
      }
    }

    // Update batch status
    batch.processedCount = processedCount;
    batch.failedCount = failedCount;
    batch.status = failedCount === 0 ? 'COMPLETED' : 'FAILED';
    batch.completedAt = new Date();
  }

  /**
   * Get eligible channels based on recipient preferences
   */
  private getEligibleChannels(recipient: Recipient, request: NotificationRequest): NotificationChannel[] {
    // Filter out channels the recipient has unsubscribed from
    return recipient.preferredChannels.filter(channel => {
      if (recipient.unsubscribedCategories?.includes(request.category)) {
        return false;
      }

      // Verify recipient has necessary contact info for channel
      switch (channel) {
        case NotificationChannel.EMAIL:
          return !!recipient.email;
        case NotificationChannel.SMS:
          return !!recipient.phone;
        case NotificationChannel.PUSH:
          return !!recipient.pushToken;
        default:
          return true;
      }
    });
  }

  /**
   * Get priority value for message queue
   */
  private getPriorityValue(priority: NotificationPriority): number {
    switch (priority) {
      case NotificationPriority.URGENT:
        return 10;
      case NotificationPriority.HIGH:
        return 7;
      case NotificationPriority.MEDIUM:
        return 5;
      case NotificationPriority.LOW:
        return 1;
      default:
        return 1;
    }
  }

  /**
   * Interpolate template variables
   */
  private interpolateTemplate(template: NotificationTemplate, variables: Record<string, string>): string {
    let content = template.content;
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return content;
  }
}
