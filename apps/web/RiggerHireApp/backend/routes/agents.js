const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

// Import AI agent services
const MatchingService = require('../AutomationServer/Services/MatchingEngine/MatchingService');

const router = express.Router();

// Validation middleware for agent requests
const agentRequestValidation = [
    body('agentId').notEmpty().withMessage('Agent ID is required'),
    body('messageType').notEmpty().withMessage('Message type is required'),
    body('sourceApp').notEmpty().withMessage('Source app is required'),
    body('targetApp').notEmpty().withMessage('Target app is required'),
    body('payload').isObject().withMessage('Payload must be an object')
];

/**
 * @route   POST /api/agents/job-matching/match
 * @desc    Match jobs with candidates using JobMatchingAgent
 * @access  Private
 */
router.post('/job-matching/match', authenticateToken, [
    body('candidateProfile').isObject().withMessage('Candidate profile is required'),
    body('jobRequirements').isObject().withMessage('Job requirements are required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const matchResults = await MatchingService.matchJobsWithCandidates(req.body);
        
        res.json({
            success: true,
            data: matchResults,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('🚨 Job matching error:', error);
        res.status(500).json({
            success: false,
            error: 'Job matching service error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/agents/job-matching/recommendations/:userId
 * @desc    Get job recommendations for a specific user
 * @access  Private
 */
router.get('/job-matching/recommendations/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 10 } = req.query;

        const recommendations = await MatchingService.getJobRecommendations(
            userId, 
            parseInt(limit)
        );

        res.json({
            success: true,
            data: {
                userId,
                recommendations,
                totalCount: recommendations.length
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('🚨 Recommendations error:', error);
        res.status(500).json({
            success: false,
            error: 'Recommendations service error',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/agents/integration
 * @desc    Generic cross-app integration endpoint
 * @access  Private
 */
router.post('/integration', authenticateToken, agentRequestValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { agentId, sourceApp, targetApp, messageType, payload } = req.body;

        let result;

        // Route to appropriate agent based on agentId
        switch (agentId) {
            case 'JobMatchingAgent':
                result = await MatchingService.handleIntegrationRequest(
                    sourceApp, targetApp, messageType, payload
                );
                break;

            case 'ComplianceAgent':
                // TODO: Implement ComplianceAgent
                result = { success: false, error: 'ComplianceAgent not yet implemented' };
                break;

            case 'AnalyticsAgent':
                // TODO: Implement AnalyticsAgent
                result = { success: false, error: 'AnalyticsAgent not yet implemented' };
                break;

            case 'CommunicationAgent':
                // TODO: Implement CommunicationAgent
                result = { success: false, error: 'CommunicationAgent not yet implemented' };
                break;

            case 'SafetyAgent':
                // TODO: Implement SafetyAgent
                result = { success: false, error: 'SafetyAgent not yet implemented' };
                break;

            case 'FinancialAgent':
                // TODO: Implement FinancialAgent
                result = { success: false, error: 'FinancialAgent not yet implemented' };
                break;

            default:
                result = {
                    success: false,
                    error: `Unknown agent: ${agentId}`
                };
        }

        res.json({
            success: result.success,
            data: result,
            agentId,
            sourceApp,
            targetApp,
            messageType,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('🚨 Agent integration error:', error);
        res.status(500).json({
            success: false,
            error: 'Agent integration service error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/agents/status
 * @desc    Get status of all AI agents
 * @access  Private
 */
router.get('/status', authenticateToken, async (req, res) => {
    try {
        const agentStatuses = {
            JobMatchingAgent: {
                status: 'active',
                version: '1.0.0',
                lastUpdate: new Date().toISOString(),
                features: ['job_matching', 'recommendations', 'feedback_learning']
            },
            ComplianceAgent: {
                status: 'pending',
                version: '0.0.0',
                features: ['document_verification', 'regulatory_compliance', 'audit_trails']
            },
            AnalyticsAgent: {
                status: 'pending',
                version: '0.0.0',
                features: ['business_intelligence', 'predictive_analytics', 'reporting']
            },
            CommunicationAgent: {
                status: 'pending',
                version: '0.0.0',
                features: ['smart_notifications', 'message_routing', 'content_moderation']
            },
            SafetyAgent: {
                status: 'pending',
                version: '0.0.0',
                features: ['risk_assessment', 'incident_prediction', 'safety_monitoring']
            },
            FinancialAgent: {
                status: 'pending',
                version: '0.0.0',
                features: ['payment_processing', 'financial_analytics', 'fraud_detection']
            }
        };

        res.json({
            success: true,
            data: {
                totalAgents: Object.keys(agentStatuses).length,
                activeAgents: Object.values(agentStatuses).filter(a => a.status === 'active').length,
                agents: agentStatuses
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('🚨 Agent status error:', error);
        res.status(500).json({
            success: false,
            error: 'Agent status service error',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/agents/feedback
 * @desc    Submit feedback for agent improvements
 * @access  Private
 */
router.post('/feedback', authenticateToken, [
    body('agentId').notEmpty().withMessage('Agent ID is required'),
    body('feedbackType').isIn(['match_quality', 'recommendation', 'prediction', 'general']).withMessage('Invalid feedback type'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comments').optional().isString()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { agentId, feedbackType, rating, comments, contextData } = req.body;
        const userId = req.user.userId;

        // Store feedback for ML model improvement
        const feedback = {
            userId,
            agentId,
            feedbackType,
            rating,
            comments,
            contextData,
            timestamp: new Date().toISOString()
        };

        // Route feedback to appropriate agent
        let result;
        switch (agentId) {
            case 'JobMatchingAgent':
                result = await MatchingService.updateMatchFeedback(feedback);
                break;
            default:
                result = { success: true, message: 'Feedback recorded for future implementation' };
        }

        res.json({
            success: true,
            data: {
                feedbackId: `fb_${Date.now()}`,
                message: 'Feedback submitted successfully',
                ...result
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('🚨 Feedback submission error:', error);
        res.status(500).json({
            success: false,
            error: 'Feedback service error',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/agents/metrics
 * @desc    Get agent performance metrics
 * @access  Private
 */
router.get('/metrics', authenticateToken, async (req, res) => {
    try {
        const { timeframe = '7d', agentId } = req.query;

        // Mock metrics - replace with actual data from monitoring system
        const metrics = {
            JobMatchingAgent: {
                requests: 1250,
                successRate: 94.2,
                averageResponseTime: 245,
                accuracy: 89.5,
                userSatisfaction: 4.3
            },
            ComplianceAgent: {
                requests: 0,
                successRate: 0,
                averageResponseTime: 0,
                accuracy: 0,
                userSatisfaction: 0
            }
            // Add other agents as they're implemented
        };

        const responseData = agentId ? 
            { [agentId]: metrics[agentId] } : 
            metrics;

        res.json({
            success: true,
            data: {
                timeframe,
                metrics: responseData,
                lastUpdated: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('🚨 Metrics error:', error);
        res.status(500).json({
            success: false,
            error: 'Metrics service error',
            message: error.message
        });
    }
});

module.exports = router;
