import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
        padding: '0 1.5rem',
        paddingTop: '70px',
      }}
    >
      {/* Animated grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: '900px',
        width: '100%',
        textAlign: 'center',
        zIndex: 1,
        position: 'relative',
      }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(0, 212, 255, 0.08)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88', display: 'inline-block', animation: 'glow-pulse 2s ease-in-out infinite' }} />
          <span style={{ color: '#8892b0', fontSize: '0.85rem', fontWeight: 500 }}>
            Available for Internships & Opportunities
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1rem',
            letterSpacing: '-1px',
          }}
        >
          Hi, I'm{' '}
          <span style={{
            background: 'linear-gradient(135deg, #00d4ff 0%, #9b59b6 50%, #e91e8c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Neeraj Songade
          </span>
        </motion.h1>

        {/* Typing animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            fontWeight: 600,
            marginBottom: '1.5rem',
            fontFamily: 'Space Grotesk, sans-serif',
            color: '#8892b0',
          }}
        >
          <span style={{ color: '#f0f0f5' }}>I'm a </span>
          <TypeAnimation
            sequence={[
              'Full Stack Developer', 2000,
              'MERN Stack Engineer', 2000,
              'Problem Solver', 1500,
              'B.Tech CSE Student', 1500,
              'Open Source Enthusiast', 1500,
            ]}
            wrapper="span"
            speed={50}
            deletionSpeed={70}
            repeat={Infinity}
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #9b59b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            color: '#8892b0',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            lineHeight: 1.8,
            maxWidth: '640px',
            margin: '0 auto 2.5rem',
          }}
        >
          B.Tech CSE student passionate about building scalable full-stack applications,
          real-time systems, and solving complex problems with clean, efficient code.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo('projects')}
            className="btn-glow btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            View Projects <FiArrowRight />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo('contact')}
            className="btn-glow btn-outline"
          >
            Contact Me
          </motion.button>
          <motion.a
            href="/resume.pdf"
            download="Neeraj_Songade_Resume.pdf"
            whileHover={{ scale: 1.05, y: -3 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px',
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
            <FiDownload /> Resume
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
        >
          {[
            { icon: <FiGithub size={20} />, href: 'https://github.com/neerajsongade25-ops', label: 'GitHub' },
            { icon: <FiLinkedin size={20} />, href: 'https://www.linkedin.com/in/neeraj-songade-3a787b315', label: 'LinkedIn' },
            { icon: <FiMail size={20} />, href: 'mailto:neerajsongade463@gmail.com', label: 'Email' },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={social.label}
              whileHover={{ scale: 1.2, y: -4 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 44, height: 44,
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#8892b0',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ position: 'absolute', bottom: '-60px', left: '50%', transform: 'translateX(-50%)' }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 24, height: 40,
              border: '2px solid rgba(0,212,255,0.3)',
              borderRadius: 12,
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              paddingTop: 6,
            }}
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 4, height: 8, borderRadius: 2, background: '#00d4ff' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
