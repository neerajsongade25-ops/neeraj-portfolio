const mongoose = require('mongoose');

// Stores a single resume reference — always at most one document.
// This avoids Cloudinary public_id format ambiguity (raw files include
// the .pdf extension in the public_id which differs from image resources).
const resumeSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true }, // Cloudinary public_id (exact, from req.file.filename)
    url:      { type: String, required: true }, // Cloudinary secure_url (from req.file.path)
    size:     { type: Number, default: 0 },     // bytes
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
