const express = require('express');
const router = express.Router();
const WorkSafeService = require('../AutomationServer/Services/WorkSafeWA/WorkSafeService');
const auth = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * @route   GET /api/worksafe/license/:licenseNumber
 * @desc    Validate a high-risk work license
 * @access  Private
 */
router.get('/license/:licenseNumber',
    auth,
    [
        param('licenseNumber').isString().notEmpty(),
        body('licenseType').isString().notEmpty()
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const result = await WorkSafeService.validateHighRiskLicense(
                req.params.licenseNumber,
                req.body.licenseType
            );
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

/**
 * @route   GET /api/worksafe/certification/:certificationId
 * @desc    Get detailed certification information
 * @access  Private
 */
router.get('/certification/:certificationId',
    auth,
    [param('certificationId').isString().notEmpty()],
    handleValidationErrors,
    async (req, res) => {
        try {
            const result = await WorkSafeService.getCertificationDetails(
                req.params.certificationId
            );
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

/**
 * @route   GET /api/worksafe/safety-training/:workerId
 * @desc    Verify safety awareness training completion
 * @access  Private
 */
router.get('/safety-training/:workerId',
    auth,
    [param('workerId').isString().notEmpty()],
    handleValidationErrors,
    async (req, res) => {
        try {
            const result = await WorkSafeService.verifySafetyTraining(
                req.params.workerId
            );
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

/**
 * @route   GET /api/worksafe/safety-record/:workerId
 * @desc    Check safety incidents and violations
 * @access  Private
 */
router.get('/safety-record/:workerId',
    auth,
    [param('workerId').isString().notEmpty()],
    handleValidationErrors,
    async (req, res) => {
        try {
            const result = await WorkSafeService.checkSafetyRecord(
                req.params.workerId
            );
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

/**
 * @route   POST /api/worksafe/subscribe/:certificationId
 * @desc    Subscribe to certification updates
 * @access  Private
 */
router.post('/subscribe/:certificationId',
    auth,
    [param('certificationId').isString().notEmpty()],
    handleValidationErrors,
    async (req, res) => {
        try {
            const result = await WorkSafeService.subscribeToCertificationUpdates(
                req.params.certificationId
            );
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

/**
 * @route   POST /api/worksafe/webhook
 * @desc    Webhook endpoint for WorkSafe WA updates
 * @access  Public (protected by signature verification)
 */
router.post('/webhook',
    async (req, res) => {
        const signature = req.headers['x-worksafe-signature'];
        if (!signature) {
            return res.status(401).json({ error: 'Missing signature' });
        }

        // Verify webhook signature
        const calculatedSignature = crypto
            .createHmac('sha256', process.env.WORKSAFE_WA_WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (signature !== calculatedSignature) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // Process the webhook
        try {
            // Emit event for real-time updates
            const event = req.body;
            // Handle different event types
            switch (event.type) {
                case 'certification.updated':
                    // Handle certification update
                    break;
                case 'certification.expired':
                    // Handle certification expiry
                    break;
                case 'safety.incident':
                    // Handle safety incident
                    break;
                default:
                    logger.warn(`Unknown webhook event type: ${event.type}`);
            }

            res.json({ status: 'success' });
        } catch (error) {
            logger.error(`Webhook processing error: ${error.message}`);
            res.status(500).json({ error: 'Webhook processing failed' });
        }
    }
);

module.exports = router;
