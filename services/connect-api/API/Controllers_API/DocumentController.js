const DocumentService = require('../../Services/DocumentProcessor/DocumentService');
const documentService = new DocumentService();

exports.uploadDocument = async (req, res) => {
    const { metadata } = req.body;
    const file = req.file; // Assume multer middleware is used
    try {
        const result = await documentService.uploadDocument(file, metadata);
        res.status(201).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.validateDocument = async (req, res) => {
    const { documentId } = req.params;
    try {
        const result = await documentService.validateDocument(documentId);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

