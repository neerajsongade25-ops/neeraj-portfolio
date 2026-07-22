const express = require('express');
const authMiddleware = require('../middleware/auth');
const { cloudinary, resumeUpload } = require('../config/cloudinary');

const router = express.Router();

// GET /api/resume/status — check if resume exists in Cloudinary
router.get('/status', async (req, res) => {
  try {
    const result = await cloudinary.api.resource(
      'neeraj_portfolio/resume/resume',
      { resource_type: 'raw' }
    );
    // Use secure_url directly from Cloudinary's response — never regenerate
    // it with cloudinary.url() + format param which creates an invalid signed URL.
    return res.json({
      success: true,
      exists: true,
      url: result.secure_url,
      size: result.bytes,
      lastModified: result.created_at,
    });
  } catch (err) {
    // Cloudinary returns 404 when the resource doesn't exist
    if (err.http_code === 404 || err.error?.http_code === 404) {
      return res.json({ success: true, exists: false });
    }
    console.error('Cloudinary resume check error:', err.error || err.message || err);
    return res.status(500).json({ success: false, message: err.error?.message || err.message || 'Failed to check resume status.' });
  }
});

// POST /api/resume/upload — upload new resume (protected)
router.post('/upload', authMiddleware, (req, res) => {
  resumeUpload.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    res.json({
      success: true,
      message: 'Resume uploaded successfully!',
      url: req.file.path, // Cloudinary URL
      size: req.file.size,
    });
  });
});

// DELETE /api/resume — remove resume from Cloudinary (protected)
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await cloudinary.uploader.destroy('neeraj_portfolio/resume/resume', {
      resource_type: 'raw',
    });
    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (err) {
    console.error('Cloudinary resume delete error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete resume.' });
  }
});

module.exports = router;
