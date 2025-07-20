const PaymentService = require('../PaymentService');

class PaymentAutomationService {
    constructor() {
        this.paymentService = new PaymentService();
    }

    async processBatchPayments(batch) {
        const results = [];
        for (const payment of batch) {
            try {
                const result = await this.paymentService.processPayment(payment);
                results.push({ payment, success: result.success });
            } catch (error) {
                results.push({ payment, success: false, error: error.message });
            }
        }
        return results;
    }

    async automateTaxDeduction(workerId, paymentAmount) {
        try {
            const taxDetails = await this.paymentService.fetchTaxDetails(workerId);
            const taxAmount = (paymentAmount * taxDetails.taxRate) / 100;
            console.log(`Tax deducted: $${taxAmount} for worker ${workerId}`);
            return taxAmount;
        } catch (error) {
            console.error(`Tax deduction failed for worker ${workerId}:`, error.message);
            throw error;
        }
    }
}

module.exports = PaymentAutomationService;
