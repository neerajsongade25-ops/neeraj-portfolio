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

// GET /api/resume/download — generate a signed Cloudinary download URL and redirect.
//
// Why not direct streaming? Cloudinary redirects raw/upload URLs or returns 401
// when accessed server-to-server without following redirects. Using
// private_download_url() generates an authenticated API download URL
// (api.cloudinary.com/v1_1/.../download?...signature...) that works with any client.
router.get('/download', async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ createdAt: -1 });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'No resume uploaded.' });
    }

    // private_download_url(publicId, format, opts) builds:
    //   api.cloudinary.com/v1_1/{cloud}/raw/download?public_id=...&api_key=...&signature=...
    // It embeds your Cloudinary credentials in the query params so the URL is self-authenticated.
    //
    // For raw resources, the format is part of the public_id (e.g. '...resume.pdf').
    // private_download_url appends format as '.{format}', so we strip .pdf from the public_id
    // and pass format:'pdf' separately to avoid getting '...resume.pdf.pdf'.
    let publicIdForDownload = (resume.publicId || '').trim();
    let format = null;
    if (publicIdForDownload.toLowerCase().endsWith('.pdf')) {
      publicIdForDownload = publicIdForDownload.slice(0, -4); // strip .pdf
      format = 'pdf';
    }

    const signedUrl = cloudinary.utils.private_download_url(
      publicIdForDownload,
      format,
      {
        resource_type: 'raw',
        type:          'upload',
        attachment:    'Neeraj_Songade_Resume.pdf', // browser download filename
        expires_at:    Math.floor(Date.now() / 1000) + 600, // valid 10 min
      }
    );

    // Redirect the browser to the signed Cloudinary URL.
    // The browser downloads the PDF directly — no bandwidth on our server.
    return res.redirect(302, signedUrl);
  } catch (err) {
    console.error('Resume download error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

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
