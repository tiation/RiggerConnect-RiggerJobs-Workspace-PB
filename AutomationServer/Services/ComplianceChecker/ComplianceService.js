const axios = require('axios');

class ComplianceChecker {
    constructor() {
        this.apiBase = process.env.COMPLIANCE_API_URL || 'https://compliance.example.com';
    }

    async validateWorker(workerId, jobRequirements) {
        try {
            const response = await axios.post(`${this.apiBase}/validate-worker`, {
                workerId,
                jobRequirements,
            });
            return response.data; // Contains validation results
        } catch (error) {
            console.error('Compliance validation failed:', error.message);
            throw error;
        }
    }

    async validateJob(jobId) {
        try {
            const response = await axios.get(`${this.apiBase}/validate-job/${jobId}`);
            return response.data; // Contains compliance details
        } catch (error) {
            console.error(`Error validating job ${jobId}:`, error.message);
            throw error;
        }
    }
}

module.exports = ComplianceChecker;

