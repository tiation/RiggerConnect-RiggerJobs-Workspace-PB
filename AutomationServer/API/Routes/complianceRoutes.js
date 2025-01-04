const express = require('express');
const ComplianceController = require('../Controllers/ComplianceController');

const router = express.Router();

router.post('/validate', ComplianceController.validateCompliance);
router.get('/rules', ComplianceController.getComplianceRules);

module.exports = router;

