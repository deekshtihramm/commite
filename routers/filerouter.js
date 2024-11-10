const express = require('express');
const multer = require('multer');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const File = require('../models/File'); // Adjust this to match your model path
const crypto = require('crypto');

// Constants
const UPLOAD_DIRECTORY = './uploads/';
const QR_CODE_DIRECTORY = './qrcodes/'; // Directory for saving QR codes
const MAX_FILE_SIZE = 500 * 1024 * 1024;  // 500 MB

// Ensure upload and QR code directories exist
if (!fs.existsSync(UPLOAD_DIRECTORY)){
    fs.mkdirSync(UPLOAD_DIRECTORY);
    console.log(`Created upload directory: ${UPLOAD_DIRECTORY}`);
}

if (!fs.existsSync(QR_CODE_DIRECTORY)){
    fs.mkdirSync(QR_CODE_DIRECTORY);
    console.log(`Created QR code directory: ${QR_CODE_DIRECTORY}`);
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIRECTORY);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

// Initialize multer middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }
});

const router = express.Router();
// Helper function to generate a unique 4-character alphanumeric code
function generateUniqueCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Possible characters
  let code = '';
  
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length); // Get a random index from the chars string
    code += chars[randomIndex]; // Append the character at the random index to the code
  }
  
  return code;
}


// POST route to upload a file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    // Log the uploaded file information
    console.log(`Received file: ${file.originalname}`);
    console.log(`File details - Name: ${file.filename}, Size: ${file.size} bytes, Type: ${file.mimetype}`);

    // Generate a unique file code
    const uniqueCode = generateUniqueCode();

    // Generate a QR code for the file URL
    const qrCodeData = `http://127.0.0.1:3002/uploads/${file.filename}`; // Adjust if needed
    const qrCodePath = `${QR_CODE_DIRECTORY}${file.filename}.png`; // Save QR code as PNG

    // Generate and save QR code
    await qrcode.toFile(qrCodePath, qrCodeData);
    console.log(`QR code generated and saved to: ${qrCodePath}`);

    // Create a new file entry in the database
    const newFile = new File({
      filename: file.filename,
      filePath: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      filecode: uniqueCode, // Unique code for the file
      qrCodePath: qrCodePath // Path to the generated QR code
    });

    // Save the file entry to MongoDB
    await newFile.save();
    console.log(`File entry saved to database with ID: ${newFile._id}`);

    // Respond with the file URL and QR code URL
    res.status(201).json({ 
      message: 'File uploaded successfully',
      fileUrl: `http://127.0.0.1:3002/uploads/${file.filename}`,
      qrCodeUrl: `http://127.0.0.1:3002/qrcodes/${file.filename}.png`, // URL for the QR code
      filecode: uniqueCode // Send the generated code back in the response
    });
  } catch (err) {
    console.error('File upload failed:', err);
    res.status(500).json({ message: 'File upload failed', error: err.message });
  }
});

// GET route to retrieve all uploaded files
router.get('/files', async (req, res) => {
  try {
    const files = await File.find();
    console.log(`Fetched ${files.length} files from database.`);
    res.status(200).json(files);
  } catch (err) {
    console.error('Failed to fetch files:', err);
    res.status(500).json({ message: 'Failed to fetch files', error: err.message });
  }
});

// GET route to retrieve a specific file by ID
router.get('/file/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      console.warn(`File not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'File not found' });
    }

    // Construct full URL for QR code if it exists
    const qrCodeUrl = file.qrCodePath ? `http://127.0.0.1:3002/qrcodes/${path.basename(file.qrCodePath)}` : null;

    console.log(`Retrieved file: ${file.filename}, QR Code URL: ${qrCodeUrl}`);
    
    res.status(200).json({
      file,
      qrCodeUrl
    });
  } catch (err) {
    console.error('Failed to fetch file:', err);
    res.status(500).json({ message: 'Failed to fetch file', error: err.message });
  }
});


router.get('/file/code/:code', async (req, res) => {
  try {
    // Query the database for the file using the provided file code
    const file = await File.findOne({ filecode: req.params.code }); // Ensure 'filecode' matches the schema property

    if (!file) {
      console.warn(`File not found for code: ${req.params.code}`);
      return res.status(404).json({ message: 'File not found', code: req.params.code });
    }

    // Construct the full path for downloading the file
    const filePath = `http://127.0.0.1:3002/uploads/${path.basename(file.filename)}`;

    // Log the retrieved file's filename
    console.log(`Retrieved file: ${file.filePath}`); // Log the filename, not filePath

    // Send the retrieved file in the response, including the URL for downloading
    res.status(200).json({ 
      file: { 
        filename: file.filename,
        fileType: file.fileType,
        fileSize: file.fileSize,
        filePath // Send back the constructed file path
      } 
    }); 
  } catch (err) {
    console.error('Failed to fetch file:', err);
    res.status(500).json({ message: 'Failed to fetch file', error: err.message });
  }
});



module.exports = router;
