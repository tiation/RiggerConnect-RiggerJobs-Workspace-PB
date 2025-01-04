const express = require('express');
const PaymentController = require('../Controllers/PaymentController');
const { validatePayment } = require('../Middleware/requestValidator');
const Logger = require('../../Shared/Utils/Logger');

const router = express.Router();

// Process payment endpoint with validation
router.post('/process', validatePayment, async (req, res) => {
    try {
        Logger.info('Processing payment request', { paymentId: req.body.paymentId });
        const result = await PaymentController.processPayment(req.body);
        Logger.info('Payment processed successfully', { paymentId: req.body.paymentId });
        res.status(200).json(result);
    } catch (error) {
        Logger.error('Payment processing failed', { error: error.message });
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

// Get payment details endpoint
router.get('/details/:id', async (req, res) => {
    try {
        Logger.info('Fetching payment details', { paymentId: req.params.id });
        const details = await PaymentController.getPaymentDetails(req.params.id);
        res.status(200).json(details);
    } catch (error) {
        Logger.error('Failed to fetch payment details', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch payment details' });
    }
});

module.exports = router;
