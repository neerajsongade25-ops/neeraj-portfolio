const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Languages', 'Web', 'Database', 'Core', 'Tools'],
    required: true,
  },
  level: { type: Number, min: 0, max: 100, default: 80 },
  icon: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
