import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getSkills } from '../utils/api';

const categoryColors = {
  Languages: { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.2)' },
  Web: { color: '#9b59b6', bg: 'rgba(155,89,182,0.1)', border: 'rgba(155,89,182,0.2)' },
  Database: { color: '#e91e8c', bg: 'rgba(233,30,140,0.1)', border: 'rgba(233,30,140,0.2)' },
  Core: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.2)' },
  Tools: { color: '#ffa500', bg: 'rgba(255,165,0,0.1)', border: 'rgba(255,165,0,0.2)' },
};

const categoryIcons = {
  Languages: '💻',
  Web: '🌐',
  Database: '🗄️',
  Core: '🧠',
  Tools: '🔧',
};

const fallbackSkills = [
  { name: 'JavaScript', category: 'Languages', level: 90 },
  { name: 'Python', category: 'Languages', level: 85 },
  { name: 'C++', category: 'Languages', level: 80 },
  { name: 'React.js', category: 'Web', level: 88 },
  { name: 'Node.js', category: 'Web', level: 85 },
  { name: 'Express.js', category: 'Web', level: 83 },
  { name: 'MongoDB', category: 'Database', level: 82 },
  { name: 'MySQL', category: 'Database', level: 78 },
  { name: 'DSA', category: 'Core', level: 80 },
  { name: 'OOP', category: 'Core', level: 85 },
  { name: 'Git', category: 'Tools', level: 88 },
  { name: 'Socket.io', category: 'Tools', level: 75 },
];

const SkillBar = ({ skill, inView }) => {
  const styles = categoryColors[skill.category] || categoryColors.Languages;
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#ccd6f6' }}>{skill.name}</span>
        <span style={{ fontSize: '0.82rem', color: styles.color, fontFamily: 'JetBrains Mono, monospace' }}>
          {skill.level}%
        </span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${styles.color}, ${styles.color}aa)`,
            borderRadius: '3px',
            position: 'relative',
          }}
        />
      </div>
    </div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    getSkills()
      .then(res => setSkills(res.data.data || []))
      .catch(() => setSkills(fallbackSkills))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Object.keys(categoryColors)];
  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  const groupedByCategory = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section
      id="skills"
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
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          color: '#9b59b6',
          fontSize: '0.85rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>What I Know</span>
        <h2 className="section-title" style={{ marginTop: '0.5rem' }}>
          My <span className="gradient-text">Skills</span>
        </h2>
        <div className="section-divider" />
        <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
          Technologies I use to build modern, scalable applications
        </p>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 18px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: activeCategory === cat ? '#00d4ff' : 'rgba(255,255,255,0.08)',
                background: activeCategory === cat ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: activeCategory === cat ? '#00d4ff' : '#8892b0',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat !== 'All' && categoryIcons[cat]} {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Skills Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#8892b0' }}>Loading skills...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {Object.entries(groupedByCategory).map(([category, catSkills], idx) => {
            const styles = categoryColors[category] || categoryColors.Languages;
            return (
              <motion.div
                key={category}
                className="glass-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 40, height: 40,
                    borderRadius: '10px',
                    background: styles.bg,
                    border: `1px solid ${styles.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}>
                    {categoryIcons[category]}
                  </div>
                  <h3 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700, fontSize: '1rem',
                    color: styles.color,
                  }}>
                    {category}
                  </h3>
                </div>
                {catSkills.map(skill => (
                  <SkillBar key={skill._id || skill.name} skill={skill} inView={inView} />
                ))}
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Skills;
