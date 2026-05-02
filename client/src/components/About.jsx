import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiCode, FiDatabase, FiCpu, FiAward } from 'react-icons/fi';

const stats = [
  { value: '2+', label: 'Projects Built', icon: <FiCode /> },
  { value: '25+', label: 'Events Volunteered', icon: <FiAward /> },
  { value: '5+', label: 'Tech Stacks', icon: <FiCpu /> },
  { value: '1st', label: 'National PPT Award', icon: <FiAward /> },
];

const highlights = [
  { icon: '🎯', title: 'DSA & Algorithms', desc: 'Strong problem-solving with Data Structures and Algorithms' },
  { icon: '🏗️', title: 'OOP Principles', desc: 'Clean, maintainable code using Object-Oriented Programming' },
  { icon: '🗄️', title: 'Database Systems', desc: 'DBMS expertise with MongoDB and MySQL' },
  { icon: '💡', title: 'OS Fundamentals', desc: 'Deep understanding of Operating System concepts' },
  { icon: '📊', title: 'Data Analytics', desc: 'Interest in extracting insights from complex datasets' },
  { icon: '🔧', title: 'Software Dev', desc: 'Full lifecycle software development experience' },
];

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="about"
      ref={ref}
      style={{
        padding: '6rem 1.5rem',
        position: 'relative',
        zIndex: 2,
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
      >
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          color: '#00d4ff',
          fontSize: '0.85rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>About Me</span>
        <h2 className="section-title" style={{ marginTop: '0.5rem' }}>
          Who{' '}
          <span className="gradient-text">Am I?</span>
        </h2>
        <div className="section-divider" />
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left: Profile card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="glass-card float-element" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: 100, height: 100,
              borderRadius: '50%',
              margin: '0 auto 1rem',
              background: 'linear-gradient(135deg, #00d4ff, #9b59b6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 800,
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#fff',
              boxShadow: '0 0 40px rgba(0,212,255,0.3)',
            }}>
              NS
            </div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.4rem' }}>
              Neeraj Songade
            </h3>
            <p style={{ color: '#00d4ff', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.75rem' }}>
              Full Stack Developer
            </p>
            <p style={{ color: '#8892b0', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              B.Tech CSE Student
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              {[
                { label: '📍', value: 'India' },
                { label: '📧', value: 'neerajsongade463@gmail.com' },
                { label: '📱', value: '+91 7999521688' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.83rem', color: '#8892b0' }}>
                  <span>{item.label}</span>
                  <span style={{ color: '#ccd6f6' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                style={{ padding: '1rem', textAlign: 'center' }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  background: 'linear-gradient(135deg, #00d4ff, #9b59b6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {stat.value}
                </div>
                <div style={{ color: '#8892b0', fontSize: '0.75rem', lineHeight: 1.3 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: About text + highlights */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, fontSize: '1.3rem',
              marginBottom: '1rem',
            }}>
              Professional{' '}
              <span className="gradient-text">Summary</span>
            </h3>
            <p style={{ color: '#8892b0', lineHeight: 1.9, marginBottom: '1rem', fontSize: '0.97rem' }}>
              B.Tech Computer Science student with hands-on experience in full-stack development,
              MERN stack, and real-time systems. I have built production-grade applications
              featuring RBAC, JWT authentication, REST APIs, and real-time data pipelines.
            </p>
            <p style={{ color: '#8892b0', lineHeight: 1.9, fontSize: '0.97rem', marginBottom: '1rem' }}>
              My passion for both software development and data analytics drives me to build
              systems that are not only functional but also insightful — combining engineering
              precision with data-driven decision making.
            </p>
            <p style={{ color: '#8892b0', lineHeight: 1.9, fontSize: '0.97rem' }}>
              Outside of coding, I actively volunteer in placement drives and contribute to
              competitive events, honing my communication and leadership skills.
            </p>
          </div>

          {/* Highlight cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                className="glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                style={{ padding: '1rem' }}
              >
                <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                <h4 style={{ fontWeight: 600, fontSize: '0.88rem', margin: '0.4rem 0 0.3rem', color: '#ccd6f6' }}>
                  {item.title}
                </h4>
                <p style={{ color: '#8892b0', fontSize: '0.78rem', lineHeight: 1.5 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
