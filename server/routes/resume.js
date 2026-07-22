const express = require('express');
const authMiddleware = require('../middleware/auth');
const { cloudinary, resumeUpload } = require('../config/cloudinary');
const Resume = require('../models/Resume');

const router = express.Router();

// Helper: set no-cache headers so browsers never cache this response.
// Without this, after a successful upload the browser returns the stale
// "exists: false" response from its cache, making it look like the upload failed.
const noCache = (res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
};

// GET /api/resume/status — check if resume exists (reads from MongoDB, not Cloudinary API)
router.get('/status', async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ createdAt: -1 });
    noCache(res);
    if (!resume) {
      return res.json({ success: true, exists: false });
    }
    return res.json({
      success: true,
      exists: true,
      url: resume.url,
      size: resume.size,
      lastModified: resume.updatedAt || resume.createdAt,
    });
  } catch (err) {
    console.error('Resume status error:', err.message);
    noCache(res);
    return res.status(500).json({ success: false, message: 'Failed to check resume status.' });
  }
});

// POST /api/resume/upload — upload new resume (protected)
// After Cloudinary upload, saves the real public_id + url to MongoDB.
// Using MongoDB removes the need to guess the Cloudinary public_id format.
router.post('/upload', authMiddleware, (req, res) => {
  resumeUpload.single('resume')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    try {
      // req.file.filename = actual Cloudinary public_id (may include .pdf for raw resources)
      // req.file.path     = Cloudinary secure_url
      await Resume.deleteMany({}); // always keep only one resume
      await Resume.create({
        publicId: req.file.filename,
        url:      req.file.path,
        size:     req.file.size || 0,
      });

      return res.json({
        success: true,
        message: 'Resume uploaded successfully!',
        url:  req.file.path,
        size: req.file.size,
      });
    } catch (dbErr) {
      console.error('Resume DB save error:', dbErr.message);
      // The file IS in Cloudinary but we couldn't save the reference.
      // Return the URL anyway so the client at least has the link.
      return res.status(500).json({
        success: false,
        message: 'File uploaded to Cloudinary but failed to save reference. Try uploading again.',
      });
    }
  });
});

// DELETE /api/resume — remove resume from Cloudinary and MongoDB (protected)
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne();
    if (!resume) {
      return res.json({ success: true, message: 'No resume to delete.' });
    }

    // Destroy from Cloudinary using the exact public_id we stored at upload time
    await cloudinary.uploader.destroy(resume.publicId, { resource_type: 'raw' });

    await Resume.deleteMany({});
    return res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (err) {
    console.error('Resume delete error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to delete resume.' });
  }
});

module.exports = router;
