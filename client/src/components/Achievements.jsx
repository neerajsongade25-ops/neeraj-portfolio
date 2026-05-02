import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const achievements = [
  {
    icon: '🎨',
    title: 'Best UI/UX Award',
    subtitle: 'MediTrack Project',
    description: 'Recognized for outstanding user interface design and exceptional user experience in the MediTrack veterinary management system.',
    gradient: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(155,89,182,0.15))',
    accentColor: '#00d4ff',
    year: '2024',
  },
  {
    icon: '🏆',
    title: '1st Place – PPT Competition',
    subtitle: 'National Science Day, OIST',
    description: 'Won first place in PowerPoint presentation competition at the national level during National Science Day celebrations at OIST.',
    gradient: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.15))',
    accentColor: '#ffd700',
    year: '2024',
  },
  {
    icon: '🤝',
    title: '25+ Placement Drives',
    subtitle: 'Volunteer Work',
    description: 'Actively volunteered and coordinated in over 25 campus placement drives, helping students prepare and connect with recruiters.',
    gradient: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,212,255,0.15))',
    accentColor: '#00ff88',
    year: '2023-2024',
  },
  {
    icon: '📜',
    title: 'NPTEL Certification',
    subtitle: 'Machine Learning',
    description: 'Successfully completed NPTEL Machine Learning course certification, demonstrating proficiency in ML concepts and data analytics.',
    gradient: 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(155,89,182,0.15))',
    accentColor: '#e91e8c',
    year: '2024',
  },
];

const Achievements = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="achievements"
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
          color: '#ffd700',
          fontSize: '0.85rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>Recognition</span>
        <h2 className="section-title" style={{ marginTop: '0.5rem' }}>
          Achievements &{' '}
          <span style={{
            background: 'linear-gradient(135deg, #ffd700, #ffa500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Awards</span>
        </h2>
        <div className="section-divider" style={{
          background: 'linear-gradient(90deg, #ffd700, #ffa500)',
        }} />
        <p className="section-subtitle">
          Milestones and recognitions from my academic and professional journey
        </p>
      </motion.div>

      {/* Achievements Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            className="glass-card"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.12 }}
            style={{ padding: '1.75rem', position: 'relative', overflow: 'visible' }}
          >
            {/* Year badge */}
            <span style={{
              position: 'absolute',
              top: '1rem', right: '1rem',
              padding: '3px 10px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '0.75rem',
              color: '#8892b0',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {achievement.year}
            </span>

            {/* Icon */}
            <div style={{
              width: 56, height: 56,
              borderRadius: '16px',
              background: achievement.gradient,
              border: `1px solid ${achievement.accentColor}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem',
              marginBottom: '1.25rem',
              boxShadow: `0 4px 20px ${achievement.accentColor}22`,
            }}>
              {achievement.icon}
            </div>

            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, fontSize: '1.1rem',
              color: '#f0f0f5', marginBottom: '0.35rem',
            }}>
              {achievement.title}
            </h3>
            <p style={{
              color: achievement.accentColor,
              fontSize: '0.83rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              letterSpacing: '0.3px',
            }}>
              {achievement.subtitle}
            </p>
            <p style={{ color: '#8892b0', fontSize: '0.87rem', lineHeight: 1.7 }}>
              {achievement.description}
            </p>

            {/* Bottom accent line */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '2px',
              background: achievement.gradient,
              borderRadius: '0 0 16px 16px',
            }} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
