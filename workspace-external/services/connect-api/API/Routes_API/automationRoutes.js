const express = require('express');
const router = express.Router();
const AutomationController = require('../Controllers/AutomationController');

router.post('/process', AutomationController.processTask);

module.exports = router;

