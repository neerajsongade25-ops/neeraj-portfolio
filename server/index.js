const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
// Allow multiple origins: comma-separated list in CLIENT_URL
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: ${origin} not allowed`));
    }
  },
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
app.use('/api/resume', require('./routes/resume'));
app.use('/api/achievements', require('./routes/achievements'));

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
    const Achievement = require('./models/Achievement');

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: 'MediTrack',
          description: 'MERN stack veterinary management system with Role-Based Access Control (RBAC) supporting 5 roles.',
          longDescription: 'A comprehensive veterinary clinic management platform built using the MERN stack. Features include JWT authentication, REST APIs, dashboard analytics, billing system, and role-based access for Admin, Doctor, Nurse, Receptionist, and Owner roles.',
          techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Tailwind CSS'],
          category: 'Full Stack',
          githubUrl: 'https://github.com/neerajsongade25-ops',
          featured: true,
          order: 1,
        },
        {
          title: 'JalInsight',
          description: 'Real-time groundwater monitoring system with Socket.io integration and predictive analytics.',
          longDescription: 'An IoT-powered groundwater monitoring platform that provides real-time data visualization, predictive analytics using ML models, geospatial mapping, and alerts for policymakers and researchers.',
          techStack: ['React.js', 'Node.js', 'Socket.io', 'MongoDB', 'Python'],
          category: 'Full Stack',
          githubUrl: 'https://github.com/neerajsongade25-ops',
          featured: true,
          order: 2,
        },
        {
          title: 'ATMOS – Team Pulse Dashboard',
          description: 'Real-time team pulse dashboard to monitor workload, morale, and engagement — built during internship at Infotact Solutions.',
          longDescription: 'ATMOS is a real-time team pulse dashboard that allows team members to submit anonymous workload check-ins (Light / Good / Heavy), give shoutouts, ask anonymous questions, and upvote them. All data updates live across the dashboard using Socket.IO, providing instant visibility into team health and engagement without page refreshes.',
          techStack: ['HTML5', 'CSS3', 'JavaScript', 'Socket.IO', 'Responsive UI', 'Vercel'],
          category: 'Frontend',
          githubUrl: '',
          liveUrl: 'https://atmos-project-two.vercel.app/login',
          featured: true,
          order: 3,
        },
        {
          title: 'Real-Time Mentorship Queue System',
          description: 'Full-stack mentorship queue platform with role-based portals, live ticket tracking, and instant mentor assignment via Socket.IO — built at Infotact Solutions.',
          longDescription: 'A full-stack real-time mentorship queue system that solves the challenge of managing 1-on-1 mentor support in learning environments. Features include Student & Mentor Portals with JWT-based role-based access, real-time ticket creation / assignment / resolution, live queue updates without page refresh, a Pending → In-Progress → Resolved workflow, and a modern dark & light mode responsive dashboard.',
          techStack: ['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'JWT'],
          category: 'Full Stack',
          githubUrl: '',
          liveUrl: '',
          featured: true,
          order: 4,
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

    const achievementCount = await Achievement.countDocuments();
    if (achievementCount === 0) {
      await Achievement.insertMany([
        {
          icon: '🎨',
          title: 'Best UI/UX Award',
          subtitle: 'MediTrack Project',
          description: 'Recognized for outstanding user interface design and exceptional user experience in the MediTrack veterinary management system.',
          gradient: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(155,89,182,0.15))',
          accentColor: '#00d4ff',
          year: '2024',
          order: 1,
        },
        {
          icon: '🏆',
          title: '1st Place – PPT Competition',
          subtitle: 'National Science Day, OIST',
          description: 'Won first place in PowerPoint presentation competition at the national level during National Science Day celebrations at OIST.',
          gradient: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.15))',
          accentColor: '#ffd700',
          year: '2024',
          order: 2,
        },
        {
          icon: '🤝',
          title: '25+ Placement Drives',
          subtitle: 'Volunteer Work',
          description: 'Actively volunteered and coordinated in over 25 campus placement drives, helping students prepare and connect with recruiters.',
          gradient: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,212,255,0.15))',
          accentColor: '#00ff88',
          year: '2023-2024',
          order: 3,
        },
        {
          icon: '📜',
          title: 'NPTEL Certification',
          subtitle: 'Machine Learning',
          description: 'Successfully completed NPTEL Machine Learning course certification, demonstrating proficiency in ML concepts and data analytics.',
          gradient: 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(155,89,182,0.15))',
          accentColor: '#e91e8c',
          year: '2024',
          order: 4,
        },
      ]);
      console.log('🏆 Initial achievements seeded');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

startServer();
