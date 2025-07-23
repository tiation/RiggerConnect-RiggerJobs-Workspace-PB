const axios = require('axios');

class PaymentService {
    constructor() {
        this.apiBase = process.env.PAYMENT_GATEWAY_URL || 'https://paymentgateway.example.com';
        this.apiKey = process.env.PAYMENT_GATEWAY_API_KEY;
    }

    async processPayment(payment) {
        try {
            const response = await axios.post(`${this.apiBase}/payments`, payment, {
                headers: { Authorization: `Bearer ${this.apiKey}` },
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Payment processing failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async fetchTaxDetails(workerId) {
        try {
            const response = await axios.get(`${this.apiBase}/taxes/${workerId}`, {
                headers: { Authorization: `Bearer ${this.apiKey}` },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching tax details for worker ${workerId}:`, error.message);
            throw error;
        }
    }
}

module.exports = PaymentService;
