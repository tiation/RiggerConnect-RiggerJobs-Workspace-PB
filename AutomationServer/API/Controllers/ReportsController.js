const ReportsService = require('../../Services/Reports/ReportsService');
const reportsService = new ReportsService();

exports.generateReport = async (req, res) => {
    const { data, reportType } = req.body;
    try {
        const reportPath = await reportsService.generateReport(data, reportType);
        res.status(201).json({ success: true, reportPath });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.fetchReports = async (req, res) => {
    try {
        const reports = await reportsService.fetchReports();
        res.status(200).json({ success: true, reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

