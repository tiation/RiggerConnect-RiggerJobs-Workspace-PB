const express = require('express');
const reportsController = require('../Controllers/ReportsController');

const router = express.Router();

router.post('/generate', reportsController.generateReport);
router.get('/fetch', reportsController.fetchReports);

module.exports = router;

