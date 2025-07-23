class CurrencyHandler {
    constructor() {
        this.exchangeRates = {
            AUD: 1.0,    // Base currency
            USD: 0.74,   // Example rates
            EUR: 0.62,
            GBP: 0.53
        };
    }

    async convertToBase(amount, fromCurrency) {
        try {
            if (!this.exchangeRates[fromCurrency]) {
                throw new Error(`Unsupported currency: ${fromCurrency}`);
            }

            const rate = this.exchangeRates[fromCurrency];
            const baseAmount = amount / rate;

            return Number(baseAmount.toFixed(2));
        } catch (error) {
            throw new Error(`Currency conversion failed: ${error.message}`);
        }
    }

    async convertFromBase(amount, toCurrency) {
        try {
            if (!this.exchangeRates[toCurrency]) {
                throw new Error(`Unsupported currency: ${toCurrency}`);
            }

            const rate = this.exchangeRates[toCurrency];
            const convertedAmount = amount * rate;

            return Number(convertedAmount.toFixed(2));
        } catch (error) {
            throw new Error(`Currency conversion failed: ${error.message}`);
        }
    }

    formatAmount(amount, currency) {
        const formatter = new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: currency
        });
        return formatter.format(amount);
    }

    async updateExchangeRates(newRates) {
        // Method to update exchange rates from external service
        this.exchangeRates = { ...this.exchangeRates, ...newRates };
    }
}

module.exports = CurrencyHandler;

