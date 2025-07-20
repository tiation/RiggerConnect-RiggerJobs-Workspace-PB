const PushNotificationAdapter = require('../Notifications/PushNotificationAdapter');

class NotificationService {
    static async sendNotification(recipientId, message) {
        const result = await PushNotificationAdapter.send(recipientId, message);
        return result;
    }
}

module.exports = NotificationService;

