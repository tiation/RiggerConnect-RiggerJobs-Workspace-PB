const TaxCalculator = require('./TaxCalculator');
const CurrencyHandler = require('./CurrencyHandler');
const logger = require('../../utils/logger');

class PaymentService {
    constructor() {
        this.taxCalculator = new TaxCalculator();
        this.currencyHandler = new CurrencyHandler();
    }

    async processPayment(paymentDetails) {
        try {
            this.validatePaymentDetails(paymentDetails);
            
            const { amount, currency, workerDetails } = paymentDetails;
            
            // Convert amount to base currency (AUD)
            const baseAmount = await this.currencyHandler.convertToBase(amount, currency);
            
            // Calculate tax deductions
            const taxDeductions = await this.taxCalculator.calculateTax(baseAmount, workerDetails);
            
            // Calculate final amount after deductions
            const finalAmount = baseAmount - taxDeductions;
            
            const paymentResult = await this.executePayment({
                amount: finalAmount,
                worker: workerDetails,
                deductions: taxDeductions
            });

            logger.info('Payment processed successfully', { paymentId: paymentResult.id });
            return paymentResult;

        } catch (error) {
            logger.error('Payment processing failed', { error: error.message });
            throw new Error(`Payment processing failed: ${error.message}`);
        }
    }

    validatePaymentDetails(details) {
        const requiredFields = ['amount', 'currency', 'workerDetails'];
        for (const field of requiredFields) {
            if (!details[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        if (details.amount <= 0) {
            throw new Error('Invalid payment amount');
        }
    }

    async executePayment(paymentData) {
        // Implementation would integrate with payment gateway
        // For now, return mock successful payment
        return {
            id: `pmt_${Date.now()}`,
            status: 'completed',
            amount: paymentData.amount,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = PaymentService;

