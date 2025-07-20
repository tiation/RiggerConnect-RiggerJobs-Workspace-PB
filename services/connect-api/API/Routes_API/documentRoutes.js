const express = require('express');
const documentController = require('../Controllers/DocumentController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/validate/:documentId', documentController.validateDocument);

module.exports = router;

