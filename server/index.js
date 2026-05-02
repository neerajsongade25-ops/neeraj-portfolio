const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API running!', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// Database + Server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API base: http://localhost:${PORT}/api`);
    });

    // Seed initial data if DB is empty
    await seedInitialData();
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.log('⚠️  Running without database (some features disabled)');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} (no DB)`);
    });
  }
};

const seedInitialData = async () => {
  try {
    const Project = require('./models/Project');
    const Skill = require('./models/Skill');

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: 'MediTrack',
          description: 'MERN stack veterinary management system with Role-Based Access Control (RBAC) supporting 5 roles.',
          longDescription: 'A comprehensive veterinary clinic management platform built using the MERN stack. Features include JWT authentication, REST APIs, dashboard analytics, billing system, and role-based access for Admin, Doctor, Nurse, Receptionist, and Owner roles.',
          techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Tailwind CSS'],
          category: 'Full Stack',
          githubUrl: '',
          featured: true,
          order: 1,
        },
        {
          title: 'JalInsight',
          description: 'Real-time groundwater monitoring system with Socket.io integration and predictive analytics.',
          longDescription: 'An IoT-powered groundwater monitoring platform that provides real-time data visualization, predictive analytics using ML models, geospatial mapping, and alerts for policymakers and researchers.',
          techStack: ['React.js', 'Node.js', 'Socket.io', 'MongoDB', 'Python', 'Leaflet.js'],
          category: 'Full Stack',
          githubUrl: '',
          featured: true,
          order: 2,
        },
      ]);
      console.log('📦 Initial projects seeded');
    }

    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        { name: 'Python', category: 'Languages', level: 85, order: 1 },
        { name: 'C++', category: 'Languages', level: 80, order: 2 },
        { name: 'JavaScript', category: 'Languages', level: 90, order: 3 },
        { name: 'HTML', category: 'Web', level: 95, order: 1 },
        { name: 'CSS', category: 'Web', level: 88, order: 2 },
        { name: 'React.js', category: 'Web', level: 88, order: 3 },
        { name: 'Node.js', category: 'Web', level: 85, order: 4 },
        { name: 'Express.js', category: 'Web', level: 83, order: 5 },
        { name: 'MongoDB', category: 'Database', level: 82, order: 1 },
        { name: 'MySQL', category: 'Database', level: 78, order: 2 },
        { name: 'DSA', category: 'Core', level: 80, order: 1 },
        { name: 'OOP', category: 'Core', level: 85, order: 2 },
        { name: 'OS', category: 'Core', level: 75, order: 3 },
        { name: 'DBMS', category: 'Core', level: 78, order: 4 },
        { name: 'Git', category: 'Tools', level: 88, order: 1 },
        { name: 'GitHub', category: 'Tools', level: 88, order: 2 },
        { name: 'VS Code', category: 'Tools', level: 95, order: 3 },
        { name: 'Socket.io', category: 'Tools', level: 75, order: 4 },
      ]);
      console.log('🎯 Initial skills seeded');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

startServer();
