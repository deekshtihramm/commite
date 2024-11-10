const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  foldername: { type: String, required: false },
  folderpath: {type: String,required:false},
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  filecode: { type: String, required: true ,unique: true }, // Ensure this is unique
  qrCodePath: { type: String },
  createdAt: { type: Date, default: Date.now, expires: '2h' } // TTL index for auto-deletion
});

// Export the model
module.exports = mongoose.model('File', fileSchema);
