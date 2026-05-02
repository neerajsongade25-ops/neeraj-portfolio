const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    return res.status(201).json({ success: true, data: project, message: 'Project created.' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.status(200).json({ success: true, data: project, message: 'Project updated.' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
