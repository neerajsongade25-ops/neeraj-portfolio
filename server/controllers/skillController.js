const Skill = require('../models/Skill');

const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, category: 1 });
    return res.status(200).json({ success: true, data: skills });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const createSkill = async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    return res.status(201).json({ success: true, data: skill, message: 'Skill created.' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    return res.status(200).json({ success: true, data: skill, message: 'Skill updated.' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    return res.status(200).json({ success: true, message: 'Skill deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
