const express = require('express');
const RiggerController = require('../Controllers/RiggerController');

const router = express.Router();

router.get('/profile/:id', RiggerController.getRiggerProfile);
router.put('/update/:id', RiggerController.updateRiggerProfile);

module.exports = router;

