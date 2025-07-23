const Stripe = require('stripe');
const Logger = require('../../../Shared/Utils/Logger');
const stripe = Stripe(process.env.STRIPE_API_KEY);

class PaymentService {
    async processPayment(jobId, amount, paymentMethodId) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Stripe uses cents
                currency: 'usd',
                payment_method: paymentMethodId,
                confirm: true,
            });

            Logger.info(`Payment for Job ${jobId} processed successfully.`);
            return paymentIntent;
        } catch (error) {
            Logger.error(`Error processing payment for Job ${jobId}:`, error);
            throw error;
        }
    }

    async refundPayment(paymentIntentId) {
        try {
            const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
            });
            Logger.info(`Refund processed successfully:`, refund.id);
            return refund;
        } catch (error) {
            Logger.error('Error processing refund:', error);
            throw error;
        }
    }
}

module.exports = new PaymentService();

