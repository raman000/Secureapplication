const express = require('express');
const multer = require('multer');
const router = express.Router();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || ['pdf', 'doc', 'docx', 'txt'];
  const fileExt = file.originalname.split('.').pop().toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }
});

// Mock documents database
const documents = [];

// Upload document
router.post('/upload', authenticateToken, upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const doc = {
    id: Date.now().toString(),
    userId: req.user.userId,
    fileName: req.file.originalname,
    filePath: req.file.path,
    fileSize: req.file.size,
    uploadedAt: new Date(),
    isEncrypted: false
  };

  documents.push(doc);

  res.status(201).json({
    message: 'Document uploaded successfully',
    document: doc
  });
});

// Get user documents
router.get('/', authenticateToken, (req, res) => {
  const userDocs = documents.filter(doc => doc.userId === req.user.userId);
  res.json({ documents: userDocs });
});

// Get document details
router.get('/:id', authenticateToken, (req, res) => {
  const doc = documents.find(d => d.id === req.params.id && d.userId === req.user.userId);
  
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  res.json({ document: doc });
});

// Delete document
router.delete('/:id', authenticateToken, (req, res) => {
  const index = documents.findIndex(d => d.id === req.params.id && d.userId === req.user.userId);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const deletedDoc = documents.splice(index, 1);
  res.json({
    message: 'Document deleted successfully',
    document: deletedDoc[0]
  });
});

module.exports = router;
