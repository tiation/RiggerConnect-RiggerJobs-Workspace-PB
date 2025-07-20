const fs = require('fs');
const path = require('path');

class ReportsService {
    constructor() {
        this.reportsPath = path.resolve(__dirname, '../../reports');
        if (!fs.existsSync(this.reportsPath)) {
            fs.mkdirSync(this.reportsPath, { recursive: true });
        }
    }

    async generateReport(data, reportType) {
        const timestamp = new Date().toISOString();
        const reportName = `${reportType}-report-${timestamp}.json`;
        const reportPath = path.join(this.reportsPath, reportName);

        try {
            fs.writeFileSync(reportPath, JSON.stringify(data, null, 2));
            console.log(`Report generated: ${reportPath}`);
            return reportPath;
        } catch (error) {
            console.error('Report generation failed:', error.message);
            throw error;
        }
    }

    async fetchReports() {
        try {
            return fs.readdirSync(this.reportsPath).map((file) => ({
                file,
                path: path.join(this.reportsPath, file),
            }));
        } catch (error) {
            console.error('Fetching reports failed:', error.message);
            throw error;
        }
    }
}

module.exports = ReportsService;

