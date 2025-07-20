const ComplianceService = require('../Services/ComplianceService');

module.exports = {
    async validateWorkerCompliance(req, res) {
        try {
            const { workerId, jobId } = req.body;
            const complianceResult = await ComplianceService.validate(workerId, jobId);
            return res.status(200).json(complianceResult);
        } catch (error) {
            console.error('Compliance validation error:', error);
            return res.status(500).json({ error: 'Compliance validation failed.' });
        }
    },
};
