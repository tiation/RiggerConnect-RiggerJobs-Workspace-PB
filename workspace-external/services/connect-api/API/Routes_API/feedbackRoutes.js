const express = require('express');
const FeedbackController = require('../Controllers/FeedbackController');

const router = express.Router();

router.post('/submit', FeedbackController.submitFeedback);
router.get('/list', FeedbackController.getFeedback);

module.exports = router;

