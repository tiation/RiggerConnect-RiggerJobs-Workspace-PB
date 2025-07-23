const ComplianceChecker = require('../AutomationEngine/ComplianceChecker');

class ComplianceService {
    static async validate(data) {
        const result = await ComplianceChecker.run(data);
        return result;
    }

    static async getRules() {
        const rules = ComplianceChecker.getRules();
        return rules;
    }
}

module.exports = ComplianceService;

