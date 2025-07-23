/**
 * Payment API Routes
 * Enterprise SaaS monetization endpoints for Rigger Platform
 * Supports both Stripe and Supabase payment processing
 */

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const StripeService = require('../services/stripe');
const SupabaseService = require('../services/supabase');

const router = express.Router();
const stripeService = new StripeService();
const supabaseService = new SupabaseService();

// Middleware for validation
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
        });
    }
    next();
};

// Authentication middleware (simplified - you should use your actual auth middleware)
const authenticateUser = (req, res, next) => {
    // Add your JWT authentication logic here
    // For now, assuming user is authenticated and attached to req.user
    if (!req.user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication required' 
        });
    }
    next();
};

/**
 * STRIPE PAYMENT ROUTES
 */

// Create Stripe customer
router.post('/stripe/customers', 
    authenticateUser,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').optional().isMobilePhone()
    ],
    validate,
    async (req, res) => {
        try {
            const userData = {
                id: req.user.id,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                company: req.body.company,
                role: req.user.role
            };

            const customer = await stripeService.createCustomer(userData);

            res.json({
                success: true,
                data: {
                    customer_id: customer.id,
                    message: 'Stripe customer created successfully'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create customer',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// Create subscription
router.post('/stripe/subscriptions',
    authenticateUser,
    [
        body('customer_id').notEmpty().withMessage('Customer ID is required'),
        body('plan_id').isIn(['basic', 'professional', 'enterprise']).withMessage('Invalid plan ID'),
        body('payment_method_id').optional().isString()
    ],
    validate,
    async (req, res) => {
        try {
            const { customer_id, plan_id, payment_method_id } = req.body;

            const subscription = await stripeService.createSubscription(
                customer_id, 
                plan_id, 
                payment_method_id
            );

            res.json({
                success: true,
                data: {
                    subscription_id: subscription.id,
                    client_secret: subscription.latest_invoice.payment_intent.client_secret,
                    status: subscription.status,
                    plan: plan_id,
                    amount: stripeService.plans[plan_id].price,
                    features: stripeService.plans[plan_id].features
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create subscription',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// Update subscription
router.put('/stripe/subscriptions/:subscription_id',
    authenticateUser,
    [
        param('subscription_id').notEmpty().withMessage('Subscription ID is required'),
        body('plan_id').isIn(['basic', 'professional', 'enterprise']).withMessage('Invalid plan ID')
    ],
    validate,
    async (req, res) => {
        try {
            const { subscription_id } = req.params;
            const { plan_id } = req.body;

            const subscription = await stripeService.updateSubscription(subscription_id, plan_id);

            res.json({
                success: true,
                data: {
                    subscription_id: subscription.id,
                    new_plan: plan_id,
                    status: subscription.status,
                    message: 'Subscription updated successfully'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update subscription',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// Cancel subscription
router.delete('/stripe/subscriptions/:subscription_id',
    authenticateUser,
    [
        param('subscription_id').notEmpty().withMessage('Subscription ID is required'),
        body('cancel_at_period_end').optional().isBoolean()
    ],
    validate,
    async (req, res) => {
        try {
            const { subscription_id } = req.params;
            const { cancel_at_period_end = true } = req.body;

            const subscription = await stripeService.cancelSubscription(subscription_id, cancel_at_period_end);

            res.json({
                success: true,
                data: {
                    subscription_id: subscription.id,
                    cancel_at_period_end: subscription.cancel_at_period_end,
                    current_period_end: subscription.current_period_end,
                    message: cancel_at_period_end ? 
                        'Subscription will cancel at period end' : 
                        'Subscription cancelled immediately'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to cancel subscription',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// Process marketplace transaction
router.post('/stripe/marketplace/transactions',
    authenticateUser,
    [
        body('amount').isInt({ min: 100 }).withMessage('Amount must be at least $1.00 (100 cents)'),
        body('seller_id').notEmpty().withMessage('Seller ID is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('metadata').optional().isObject()
    ],
    validate,
    async (req, res) => {
        try {
            const transactionData = {
                amount: req.body.amount,
                customer_id: req.body.customer_id || req.user.stripe_customer_id,
                seller_id: req.body.seller_id,
                description: req.body.description,
                metadata: {
                    ...req.body.metadata,
                    buyer_id: req.user.id,
                    platform: 'rigger-platform'
                }
            };

            const paymentIntent = await stripeService.processMarketplaceTransaction(transactionData);

            res.json({
                success: true,
                data: {
                    payment_intent_id: paymentIntent.id,
                    client_secret: paymentIntent.client_secret,
                    amount: paymentIntent.amount,
                    platform_fee: paymentIntent.metadata.platform_fee,
                    seller_amount: paymentIntent.metadata.seller_amount,
                    status: paymentIntent.status
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to process marketplace transaction',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// Create connected account for sellers
router.post('/stripe/connected-accounts',
    authenticateUser,
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('business_type').optional().isIn(['individual', 'company']),
        body('company').optional().isString()
    ],
    validate,
    async (req, res) => {
        try {
            const userData = {
                id: req.user.id,
                email: req.body.email,
                business_type: req.body.business_type,
                company: req.body.company
            };

            const { account, accountLink } = await stripeService.createConnectedAccount(userData);

            res.json({
                success: true,
                data: {
                    account_id: account.id,
                    onboarding_url: accountLink.url,
                    message: 'Connected account created. Complete onboarding to start receiving payments.'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create connected account',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// Get billing history
router.get('/stripe/billing-history/:customer_id',
    authenticateUser,
    [
        param('customer_id').notEmpty().withMessage('Customer ID is required')
    ],
    validate,
    async (req, res) => {
        try {
            const { customer_id } = req.params;
            const limit = parseInt(req.query.limit) || 10;

            const billingHistory = await stripeService.getBillingHistory(customer_id, limit);

            res.json({
                success: true,
                data: {
                    invoices: billingHistory,
                    total_count: billingHistory.length
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve billing history',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// Get usage metrics
router.get('/stripe/usage/:customer_id',
    authenticateUser,
    [
        param('customer_id').notEmpty().withMessage('Customer ID is required')
    ],
    validate,
    async (req, res) => {
        try {
            const { customer_id } = req.params;
            const period = req.query.period || 'month';

            const metrics = await stripeService.getUsageMetrics(customer_id, period);

            res.json({
                success: true,
                data: metrics
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve usage metrics',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// Stripe webhook endpoint
router.post('/stripe/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        try {
            const signature = req.get('stripe-signature');
            const result = await stripeService.processWebhook(req.body, signature);

            res.json({ received: true });
        } catch (error) {
            console.error('Webhook processing failed:', error);
            res.status(400).json({
                success: false,
                message: 'Webhook processing failed',
                error: error.message
            });
        }
    }
);

/**
 * SUPABASE PAYMENT ROUTES
 */

// Create Supabase subscription
router.post('/supabase/subscriptions',
    authenticateUser,
    [
        body('plan_id').notEmpty().withMessage('Plan ID is required')
    ],
    validate,
    async (req, res) => {
        try {
            const { plan_id } = req.body;
            const userId = req.user.id;

            const subscription = await supabaseService.handleSubscription(userId, plan_id);

            res.json({
                success: true,
                data: {
                    subscription: subscription,
                    message: 'Supabase subscription created successfully'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create Supabase subscription',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// Process Supabase payment
router.post('/supabase/payments',
    authenticateUser,
    [
        body('amount').isInt({ min: 1 }).withMessage('Amount must be positive'),
        body('description').notEmpty().withMessage('Description is required')
    ],
    validate,
    async (req, res) => {
        try {
            const { amount, description } = req.body;
            const userId = req.user.id;

            const payment = await supabaseService.processPayment(userId, amount, description);

            res.json({
                success: true,
                data: {
                    payment: payment,
                    message: 'Payment processed successfully'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to process Supabase payment',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// Get Supabase payment history
router.get('/supabase/payment-history',
    authenticateUser,
    async (req, res) => {
        try {
            const userId = req.user.id;
            const history = await supabaseService.getPaymentHistory(userId);

            res.json({
                success: true,
                data: {
                    transactions: history,
                    total_count: history.length
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve payment history',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

/**
 * GENERAL PAYMENT ROUTES
 */

// Get available subscription plans
router.get('/plans',
    (req, res) => {
        res.json({
            success: true,
            data: {
                plans: stripeService.plans,
                marketplace_fee: stripeService.plans.marketplace_fee
            }
        });
    }
);

// Health check
router.get('/health',
    (req, res) => {
        res.json({
            success: true,
            message: 'Payment service is healthy',
            timestamp: new Date().toISOString(),
            services: {
                stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured',
                supabase: process.env.SUPABASE_URL ? 'configured' : 'not configured'
            }
        });
    }
);

module.exports = router;
