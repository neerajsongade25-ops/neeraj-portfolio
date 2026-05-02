const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  techStack: [{ type: String }],
  category: { type: String, default: 'Full Stack' },
  githubUrl: { type: String },
  liveUrl: { type: String },
  imageUrl: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
