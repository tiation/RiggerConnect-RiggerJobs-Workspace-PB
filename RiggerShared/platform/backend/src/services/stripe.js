/**
 * Stripe Payment Service
 * Enterprise-grade SaaS monetization with subscription management
 * Supports B2B marketplace transactions and recurring billing
 */

const Stripe = require('stripe');
const winston = require('winston');

class StripeService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/stripe.log' })
            ]
        });
        
        // Subscription plans for Rigger Platform
        this.plans = {
            basic: {
                id: 'rigger_basic',
                name: 'Basic Rigger',
                price: 2900, // $29/month in cents
                features: ['Job posting', 'Basic matching', 'Email support']
            },
            professional: {
                id: 'rigger_professional',
                name: 'Professional Rigger',
                price: 7900, // $79/month in cents
                features: ['Unlimited jobs', 'Advanced matching', 'Priority support', 'Analytics']
            },
            enterprise: {
                id: 'rigger_enterprise',
                name: 'Enterprise',
                price: 19900, // $199/month in cents
                features: ['White-label', 'Custom integrations', '24/7 support', 'Advanced analytics', 'Multi-tenant']
            },
            marketplace_fee: {
                percentage: 5.0, // 5% marketplace fee
                minimum: 250 // $2.50 minimum fee
            }
        };
    }

    /**
     * Create customer in Stripe
     */
    async createCustomer(userData) {
        try {
            const customer = await this.stripe.customers.create({
                email: userData.email,
                name: userData.name,
                phone: userData.phone,
                metadata: {
                    user_id: userData.id,
                    company: userData.company || '',
                    role: userData.role || 'user',
                    platform: 'rigger-platform'
                }
            });

            this.logger.info('Stripe customer created', {
                customer_id: customer.id,
                user_id: userData.id
            });

            return customer;
        } catch (error) {
            this.logger.error('Failed to create Stripe customer', {
                error: error.message,
                user_id: userData.id
            });
            throw error;
        }
    }

    /**
     * Create subscription for B2B SaaS
     */
    async createSubscription(customerId, planId, paymentMethodId = null) {
        try {
            const subscriptionData = {
                customer: customerId,
                items: [{
                    price_data: {
                        currency: 'aud',
                        product_data: {
                            name: this.plans[planId].name,
                            description: `${this.plans[planId].name} - Rigger Platform Subscription`
                        },
                        unit_amount: this.plans[planId].price,
                        recurring: {
                            interval: 'month'
                        }
                    }
                }],
                payment_behavior: 'default_incomplete',
                payment_settings: { save_default_payment_method: 'on_subscription' },
                expand: ['latest_invoice.payment_intent'],
                metadata: {
                    plan_id: planId,
                    platform: 'rigger-platform',
                    features: JSON.stringify(this.plans[planId].features)
                }
            };

            if (paymentMethodId) {
                subscriptionData.default_payment_method = paymentMethodId;
            }

            const subscription = await this.stripe.subscriptions.create(subscriptionData);

            this.logger.info('Subscription created', {
                subscription_id: subscription.id,
                customer_id: customerId,
                plan: planId
            });

            return subscription;
        } catch (error) {
            this.logger.error('Failed to create subscription', {
                error: error.message,
                customer_id: customerId,
                plan: planId
            });
            throw error;
        }
    }

    /**
     * Process marketplace transaction
     * For equipment rentals, job placements, etc.
     */
    async processMarketplaceTransaction(transactionData) {
        try {
            const { amount, customer_id, seller_id, description, metadata = {} } = transactionData;
            
            // Calculate platform fee
            const platformFee = Math.max(
                Math.round(amount * (this.plans.marketplace_fee.percentage / 100)),
                this.plans.marketplace_fee.minimum
            );

            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount,
                currency: 'aud',
                customer: customer_id,
                description: description,
                application_fee_amount: platformFee,
                transfer_data: {
                    destination: seller_id // Connected account
                },
                metadata: {
                    ...metadata,
                    transaction_type: 'marketplace',
                    platform_fee: platformFee,
                    seller_amount: amount - platformFee
                }
            });

            this.logger.info('Marketplace transaction created', {
                payment_intent_id: paymentIntent.id,
                amount: amount,
                platform_fee: platformFee,
                seller_id: seller_id
            });

            return paymentIntent;
        } catch (error) {
            this.logger.error('Failed to process marketplace transaction', {
                error: error.message,
                transaction_data: transactionData
            });
            throw error;
        }
    }

    /**
     * Create connected account for sellers/service providers
     */
    async createConnectedAccount(userData) {
        try {
            const account = await this.stripe.accounts.create({
                type: 'express',
                country: 'AU',
                email: userData.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true }
                },
                business_type: userData.business_type || 'individual',
                metadata: {
                    user_id: userData.id,
                    company: userData.company || '',
                    platform: 'rigger-platform'
                }
            });

            // Create account link for onboarding
            const accountLink = await this.stripe.accountLinks.create({
                account: account.id,
                refresh_url: `${process.env.FRONTEND_URL}/onboarding/refresh`,
                return_url: `${process.env.FRONTEND_URL}/onboarding/complete`,
                type: 'account_onboarding'
            });

            this.logger.info('Connected account created', {
                account_id: account.id,
                user_id: userData.id
            });

            return { account, accountLink };
        } catch (error) {
            this.logger.error('Failed to create connected account', {
                error: error.message,
                user_data: userData
            });
            throw error;
        }
    }

    /**
     * Handle subscription changes
     */
    async updateSubscription(subscriptionId, newPlanId) {
        try {
            const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
            
            const updatedSubscription = await this.stripe.subscriptions.update(subscriptionId, {
                items: [{
                    id: subscription.items.data[0].id,
                    price_data: {
                        currency: 'aud',
                        product_data: {
                            name: this.plans[newPlanId].name,
                        },
                        unit_amount: this.plans[newPlanId].price,
                        recurring: {
                            interval: 'month'
                        }
                    }
                }],
                proration_behavior: 'create_prorations',
                metadata: {
                    ...subscription.metadata,
                    plan_id: newPlanId,
                    features: JSON.stringify(this.plans[newPlanId].features)
                }
            });

            this.logger.info('Subscription updated', {
                subscription_id: subscriptionId,
                old_plan: subscription.metadata.plan_id,
                new_plan: newPlanId
            });

            return updatedSubscription;
        } catch (error) {
            this.logger.error('Failed to update subscription', {
                error: error.message,
                subscription_id: subscriptionId
            });
            throw error;
        }
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(subscriptionId, cancelAtPeriodEnd = true) {
        try {
            const subscription = await this.stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: cancelAtPeriodEnd,
                metadata: {
                    cancellation_date: new Date().toISOString()
                }
            });

            this.logger.info('Subscription cancelled', {
                subscription_id: subscriptionId,
                cancel_at_period_end: cancelAtPeriodEnd
            });

            return subscription;
        } catch (error) {
            this.logger.error('Failed to cancel subscription', {
                error: error.message,
                subscription_id: subscriptionId
            });
            throw error;
        }
    }

    /**
     * Get customer billing history
     */
    async getBillingHistory(customerId, limit = 10) {
        try {
            const invoices = await this.stripe.invoices.list({
                customer: customerId,
                limit: limit,
                expand: ['data.subscription', 'data.charge']
            });

            return invoices.data.map(invoice => ({
                id: invoice.id,
                amount: invoice.amount_paid,
                currency: invoice.currency,
                status: invoice.status,
                created: invoice.created,
                paid: invoice.paid,
                subscription_id: invoice.subscription,
                invoice_url: invoice.hosted_invoice_url,
                pdf_url: invoice.invoice_pdf
            }));
        } catch (error) {
            this.logger.error('Failed to get billing history', {
                error: error.message,
                customer_id: customerId
            });
            throw error;
        }
    }

    /**
     * Process webhook events
     */
    async processWebhook(rawBody, signature) {
        try {
            const event = this.stripe.webhooks.constructEvent(
                rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );

            this.logger.info('Webhook received', {
                event_type: event.type,
                event_id: event.id
            });

            switch (event.type) {
                case 'customer.subscription.created':
                    return this.handleSubscriptionCreated(event.data.object);
                
                case 'customer.subscription.updated':
                    return this.handleSubscriptionUpdated(event.data.object);
                
                case 'customer.subscription.deleted':
                    return this.handleSubscriptionCancelled(event.data.object);
                
                case 'invoice.payment_succeeded':
                    return this.handlePaymentSucceeded(event.data.object);
                
                case 'invoice.payment_failed':
                    return this.handlePaymentFailed(event.data.object);
                
                case 'account.updated':
                    return this.handleAccountUpdated(event.data.object);
                
                default:
                    this.logger.info('Unhandled webhook event', { type: event.type });
                    return { received: true };
            }
        } catch (error) {
            this.logger.error('Webhook processing failed', {
                error: error.message
            });
            throw error;
        }
    }

    // Webhook handlers
    async handleSubscriptionCreated(subscription) {
        // Update user subscription status in database
        // Send welcome email
        // Enable premium features
        this.logger.info('Subscription activated', {
            subscription_id: subscription.id,
            customer_id: subscription.customer
        });
    }

    async handleSubscriptionUpdated(subscription) {
        // Update user plan in database
        // Adjust feature access
        this.logger.info('Subscription modified', {
            subscription_id: subscription.id,
            status: subscription.status
        });
    }

    async handleSubscriptionCancelled(subscription) {
        // Disable premium features
        // Send cancellation email
        // Update user status
        this.logger.info('Subscription cancelled', {
            subscription_id: subscription.id
        });
    }

    async handlePaymentSucceeded(invoice) {
        // Update payment status
        // Send receipt
        this.logger.info('Payment succeeded', {
            invoice_id: invoice.id,
            amount: invoice.amount_paid
        });
    }

    async handlePaymentFailed(invoice) {
        // Handle failed payment
        // Send notification
        // Maybe suspend account
        this.logger.info('Payment failed', {
            invoice_id: invoice.id,
            customer_id: invoice.customer
        });
    }

    async handleAccountUpdated(account) {
        // Update connected account status
        this.logger.info('Connected account updated', {
            account_id: account.id,
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled
        });
    }

    /**
     * Get usage analytics for billing
     */
    async getUsageMetrics(customerId, period = 'month') {
        try {
            // This would typically pull from your application database
            // For now, returning sample metrics
            return {
                jobs_posted: 45,
                matches_made: 23,
                transactions_processed: 12,
                total_revenue: 156000, // in cents
                period: period,
                customer_id: customerId
            };
        } catch (error) {
            this.logger.error('Failed to get usage metrics', {
                error: error.message,
                customer_id: customerId
            });
            throw error;
        }
    }
}

module.exports = StripeService;
