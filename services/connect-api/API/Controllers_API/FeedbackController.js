const FeedbackService = require('../Services/FeedbackService');

class FeedbackController {
    static async submitFeedback(req, res) {
        try {
            const feedback = await FeedbackService.submitFeedback(req.body);
            res.status(201).json({ success: true, data: feedback });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getFeedback(req, res) {
        try {
            const feedback = await FeedbackService.getFeedback(req.query);
            res.status(200).json({ success: true, data: feedback });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = FeedbackController;
