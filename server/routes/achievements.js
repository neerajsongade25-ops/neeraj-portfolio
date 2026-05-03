const express = require('express');
const authMiddleware = require('../middleware/auth');
const { cloudinary, certificateUpload } = require('../config/cloudinary');
const Achievement = require('../models/Achievement');

const router = express.Router();

// Helper: delete a Cloudinary asset by its stored public_id + resource_type
const deleteCloudinaryAsset = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// GET /api/achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: achievements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PROTECTED ROUTES ─────────────────────────────────────────────────────────

// POST /api/achievements — create new achievement (admin)
router.post('/', authMiddleware, (req, res) => {
  certificateUpload.single('certificate')(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    try {
      const { title, subtitle, description, icon, year, accentColor, gradient, order } = req.body;

      if (!title) {
        // Roll back uploaded file if validation fails
        if (req.file) await deleteCloudinaryAsset(req.file.filename, req.file.mimetype === 'application/pdf' ? 'raw' : 'image');
        return res.status(400).json({ success: false, message: 'Title is required.' });
      }

      // req.file.path  = full Cloudinary URL
      // req.file.filename = public_id (set by multer-storage-cloudinary)
      const achievement = await Achievement.create({
        title,
        subtitle:         subtitle || '',
        description:      description || '',
        icon:             icon || '🏆',
        year:             year || '',
        accentColor:      accentColor || '#00d4ff',
        gradient:         gradient || 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(155,89,182,0.15))',
        certificateUrl:   req.file ? req.file.path     : null,
        certificatePublicId: req.file ? req.file.filename : null,
        certificateResourceType: req.file
          ? (req.file.mimetype === 'application/pdf' ? 'raw' : 'image')
          : null,
        order: order ? Number(order) : 0,
      });

      res.status(201).json({ success: true, data: achievement });
    } catch (err) {
      if (req.file) await deleteCloudinaryAsset(req.file.filename, req.file.mimetype === 'application/pdf' ? 'raw' : 'image');
      res.status(500).json({ success: false, message: err.message });
    }
  });
});

// PUT /api/achievements/:id — update achievement (admin)
router.put('/:id', authMiddleware, (req, res) => {
  certificateUpload.single('certificate')(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    try {
      const achievement = await Achievement.findById(req.params.id);
      if (!achievement) {
        if (req.file) await deleteCloudinaryAsset(req.file.filename, req.file.mimetype === 'application/pdf' ? 'raw' : 'image');
        return res.status(404).json({ success: false, message: 'Achievement not found.' });
      }

      const { title, subtitle, description, icon, year, accentColor, gradient, order, removeCertificate } = req.body;

      // New certificate uploaded → remove old one from Cloudinary
      if (req.file && achievement.certificatePublicId) {
        await deleteCloudinaryAsset(achievement.certificatePublicId, achievement.certificateResourceType || 'image');
      }

      // Admin explicitly removed certificate (no new file)
      if (removeCertificate === 'true' && !req.file) {
        await deleteCloudinaryAsset(achievement.certificatePublicId, achievement.certificateResourceType || 'image');
        achievement.certificateUrl = null;
        achievement.certificatePublicId = null;
        achievement.certificateResourceType = null;
      } else if (req.file) {
        achievement.certificateUrl = req.file.path;
        achievement.certificatePublicId = req.file.filename;
        achievement.certificateResourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';
      }

      if (title !== undefined)       achievement.title = title;
      if (subtitle !== undefined)    achievement.subtitle = subtitle;
      if (description !== undefined) achievement.description = description;
      if (icon !== undefined)        achievement.icon = icon;
      if (year !== undefined)        achievement.year = year;
      if (accentColor !== undefined) achievement.accentColor = accentColor;
      if (gradient !== undefined)    achievement.gradient = gradient;
      if (order !== undefined)       achievement.order = Number(order);

      await achievement.save();
      res.json({ success: true, data: achievement });
    } catch (err) {
      if (req.file) await deleteCloudinaryAsset(req.file.filename, req.file.mimetype === 'application/pdf' ? 'raw' : 'image');
      res.status(500).json({ success: false, message: err.message });
    }
  });
});

// DELETE /api/achievements/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found.' });
    }
    await deleteCloudinaryAsset(achievement.certificatePublicId, achievement.certificateResourceType || 'image');
    res.json({ success: true, message: 'Achievement deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
