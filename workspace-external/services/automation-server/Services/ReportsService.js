const DatabaseManager = require('../Database/DatabaseManager');

class ReportsService {
    static async generateReport(reportType, filters) {
        const data = await DatabaseManager.generateReport(reportType, filters);
        return data;
    }
}

module.exports = ReportsService;

