const PaymentService = require('../Services/PaymentService');

class PaymentController {
    static async processPayment(req, res) {
        try {
            const result = await PaymentService.processPayment(req.body);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getPaymentDetails(req, res) {
        try {
            const payment = await PaymentService.getPaymentDetails(req.params.id);
            res.status(200).json({ success: true, data: payment });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = PaymentController;
