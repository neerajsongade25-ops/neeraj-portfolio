const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    icon: {
      type: String,
      default: '🏆',
    },
    year: {
      type: String,
      default: '',
    },
    accentColor: {
      type: String,
      default: '#00d4ff',
    },
    gradient: {
      type: String,
      default: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(155,89,182,0.15))',
    },
    // Cloudinary full URL (used by the frontend to view/download)
    certificateUrl: {
      type: String,
      default: null,
    },
    // Cloudinary public_id (used to delete the asset)
    certificatePublicId: {
      type: String,
      default: null,
    },
    // 'raw' for PDFs, 'image' for images
    certificateResourceType: {
      type: String,
      default: null,
    },
    // Legacy field — kept for backward compatibility with existing DB docs
    certificateFile: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', achievementSchema);
