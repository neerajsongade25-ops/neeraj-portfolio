import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiExternalLink, FiCode } from 'react-icons/fi';
import { getProjects } from '../utils/api';

const fallbackProjects = [
  {
    _id: '1',
    title: 'MediTrack',
    description: 'MERN stack veterinary management system with Role-Based Access Control (RBAC) supporting 5 roles.',
    longDescription: 'A comprehensive veterinary clinic management platform built using the MERN stack. Features include JWT authentication, REST APIs, dashboard analytics, billing system, and role-based access for Admin, Doctor, Nurse, Receptionist, and Owner roles.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Tailwind CSS'],
    category: 'Full Stack',
    githubUrl: 'https://https://github.com/neerajsongade25-ops25-ops',
    featured: true,
  },
  {
    _id: '2',
    title: 'JalInsight',
    description: 'Real-time groundwater monitoring system with Socket.io integration and predictive analytics.',
    longDescription: 'An IoT-powered groundwater monitoring platform that provides real-time data visualization, predictive analytics using ML models, geospatial mapping, and alerts for policymakers and researchers.',
    techStack: ['React.js', 'Node.js', 'Socket.io', 'MongoDB', 'Python', 'Leaflet.js'],
    category: 'Full Stack',
    githubUrl: 'https://https://github.com/neerajsongade25-ops25-ops',
    featured: true,
  },
  {
    _id: '3',
    title: 'ATMOS – Team Pulse Dashboard',
    description: 'Real-time team pulse dashboard to monitor workload, morale, and engagement — built during internship at Infotact Solutions.',
    longDescription: 'ATMOS is a real-time team pulse dashboard that allows team members to submit anonymous workload check-ins (Light / Good / Heavy), give shoutouts, ask anonymous questions, and upvote them. All data updates live across the dashboard using Socket.IO, providing instant visibility into team health and engagement without page refreshes.',
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Socket.IO', 'Responsive UI', 'Vercel'],
    category: 'Frontend',
    githubUrl: '',
    liveUrl: 'https://atmos-project-two.vercel.app/login',
    featured: true,
  },
  {
    _id: '4',
    title: 'Real-Time Mentorship Queue System',
    description: 'Full-stack mentorship queue platform with role-based portals, live ticket tracking, and instant mentor assignment via Socket.IO — built at Infotact Solutions.',
    longDescription: 'A full-stack real-time mentorship queue system that solves the challenge of managing 1-on-1 mentor support in learning environments. Features include Student & Mentor Portals with JWT-based role-based access, real-time ticket creation / assignment / resolution, live queue updates without page refresh, a Pending → In-Progress → Resolved workflow, and a modern dark & light mode responsive dashboard.',
    techStack: ['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'JWT'],
    category: 'Full Stack',
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
];

const projectGradients = [
  'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(155,89,182,0.15))',
  'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(155,89,182,0.15))',
  'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,212,255,0.15))',
];

const ProjectCard = ({ project, index, inView }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      className="glass-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* Color stripe */}
      <div style={{
        height: 4,
        background: index % 3 === 0
          ? 'linear-gradient(90deg, #00d4ff, #9b59b6)'
          : index % 3 === 1
          ? 'linear-gradient(90deg, #e91e8c, #9b59b6)'
          : 'linear-gradient(90deg, #00ff88, #00d4ff)',
      }} />

      <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{
            width: 44, height: 44,
            borderRadius: '12px',
            background: projectGradients[index % projectGradients.length],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem',
          }}>
            {index === 0 ? '🏥' : index === 1 ? '💧' : index === 2 ? '📊' : '🎓'}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15 }}
                aria-label={`${project.title} GitHub`}
                style={{
                  width: 36, height: 36,
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#8892b0',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <FiGithub size={16} />
              </motion.a>
            )}
            {project.liveUrl ? (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15 }}
                aria-label={`${project.title} Live Demo`}
                style={{
                  width: 36, height: 36,
                  borderRadius: '8px',
                  background: 'rgba(0,212,255,0.1)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#00d4ff',
                  textDecoration: 'none',
                }}
              >
                <FiExternalLink size={16} />
              </motion.a>
            ) : project.liveUrl === '' && (
              <span
                title="Live demo coming soon"
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(233,30,140,0.1)',
                  border: '1px solid rgba(233,30,140,0.25)',
                  color: '#e91e8c',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  cursor: 'default',
                }}
              >
                🚀 Soon
              </span>
            )}
          </div>
        </div>

        {/* Project info */}
        <span style={{
          fontSize: '0.75rem',
          color: '#00d4ff',
          fontFamily: 'JetBrains Mono, monospace',
          marginBottom: '0.4rem',
          display: 'block',
        }}>
          {project.category || 'Full Stack'} {project.featured && '⭐ Featured'}
        </span>
        <h3 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700, fontSize: '1.3rem',
          marginBottom: '0.75rem', color: '#f0f0f5',
        }}>
          {project.title}
        </h3>
        <p style={{ color: '#8892b0', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem', flex: 1 }}>
          {project.description}
        </p>

        {/* Expandable long description */}
        <AnimatePresence>
          {expanded && project.longDescription && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ color: '#8892b0', fontSize: '0.87rem', lineHeight: 1.7, marginBottom: '0.75rem' }}
            >
              {project.longDescription}
            </motion.p>
          )}
        </AnimatePresence>

        {project.longDescription && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#00d4ff', fontSize: '0.83rem', fontWeight: 500,
              textAlign: 'left', padding: 0, marginBottom: '1rem',
            }}
          >
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>
        )}

        {/* Tech Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {(project.techStack || []).map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    getProjects()
      .then(res => {
        const data = res.data.data || [];
        setProjects(data.length > 0 ? data : fallbackProjects);
      })
      .catch(() => setProjects(fallbackProjects))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        padding: '6rem 1.5rem',
        position: 'relative',
        zIndex: 2,
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
      >
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          color: '#e91e8c',
          fontSize: '0.85rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>What I've Built</span>
        <h2 className="section-title" style={{ marginTop: '0.5rem' }}>
          Featured <span className="gradient-text-pink">Projects</span>
        </h2>
        <div className="section-divider" style={{ background: 'linear-gradient(90deg, #e91e8c, #9b59b6)' }} />
        <p className="section-subtitle">
          Real-world applications built with modern technologies
        </p>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#8892b0', padding: '2rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }} />
          Loading projects...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project._id}
              project={project}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      )}

      {/* GitHub CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{ textAlign: 'center', marginTop: '2.5rem' }}
      >
        <a
          href="https://https://github.com/neerajsongade25-ops25-ops"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '12px 28px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#8892b0',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
          }}
        >
          <FiGithub /> View All on GitHub
        </a>
      </motion.div>
    </section>
  );
};

export default Projects;
