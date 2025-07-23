const DatabaseManager = require('../Database/DatabaseManager');

class FeedbackService {
    static async submitFeedback(data) {
        const feedback = await DatabaseManager.insert('feedback', data);
        return feedback;
    }

    static async getFeedback(query) {
        const feedback = await DatabaseManager.find('feedback', query);
        return feedback;
    }
}

module.exports = FeedbackService;

