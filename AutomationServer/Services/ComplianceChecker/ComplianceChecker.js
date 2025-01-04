const ComplianceRules = require('../../../Shared/Core/BusinessLogic/ComplianceRules');
const Logger = require('../../../Shared/Utils/Logger');

class ComplianceChecker {
    constructor(rules = ComplianceRules.getAll()) {
        this.rules = rules;
    }

    async validateJob(job) {
        const results = [];
        for (const rule of this.rules) {
            try {
                const result = await rule.validate(job);
                results.push(result);
                if (!result.isValid) Logger.warn('ComplianceChecker', `Rule failed: ${rule.name}`);
            } catch (error) {
                Logger.error('ComplianceChecker', `Validation error for rule ${rule.name}`, error.message);
                throw error;
            }
        }
        return results;
    }
}

module.exports = new ComplianceChecker();

