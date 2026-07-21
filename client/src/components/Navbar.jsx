import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiCode, FiDownload } from 'react-icons/fi';
import useResumeUrl from '../utils/useResumeUrl';

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resumeUrl, resumeExists, error: resumeError } = useResumeUrl();
  const resumeAvailable = resumeExists && resumeUrl;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll
      const sections = navLinks.map(l => document.getElementById(l.id)).filter(Boolean);
      let current = 'home';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: '0 1.5rem',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(5, 5, 8, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <motion.button
          onClick={() => scrollTo('home')}
          whileHover={{ scale: 1.05 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #00d4ff, #9b59b6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiCode color="#fff" size={18} />
          </div>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700, fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #00d4ff, #9b59b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>NS</span>
        </motion.button>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}
          className="hidden md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`nav-link ${active === link.id ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              {link.label}
            </button>
          ))}
          <motion.a
            href={resumeAvailable ? resumeUrl : undefined}
            download={resumeAvailable ? 'Neeraj_Songade_Resume.pdf' : undefined}
            target={resumeAvailable ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={!resumeAvailable ? (e) => e.preventDefault() : undefined}
            title={
              resumeAvailable ? 'Download Resume'
              : resumeError ? 'Resume unavailable — check admin panel'
              : 'No resume uploaded yet'
            }
            whileHover={resumeAvailable ? { scale: 1.05, y: -2 } : {}}
            whileTap={resumeAvailable ? { scale: 0.97 } : {}}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(155,89,182,0.15))',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#00d4ff',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <FiDownload size={14} /> Resume
          </motion.a>
          <motion.a
            href="/admin/login"
            whileHover={{ scale: 1.05 }}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(155,89,182,0.15))',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#00d4ff',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            Admin
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#00d4ff', fontSize: '1.4rem', display: 'flex', alignItems: 'center',
          }}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 70, left: 0, right: 0,
              background: 'rgba(5, 5, 8, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              zIndex: 999,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: active === link.id ? '#00d4ff' : '#8892b0',
                  fontSize: '1rem', fontWeight: 500, textAlign: 'left',
                  padding: '8px 0', fontFamily: 'Inter, sans-serif',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {link.label}
              </button>
            ))}
            <a
              href={resumeAvailable ? resumeUrl : undefined}
              download={resumeAvailable ? 'Neeraj_Songade_Resume.pdf' : undefined}
              target={resumeAvailable ? '_blank' : undefined}
              rel="noopener noreferrer"
              onClick={!resumeAvailable ? (e) => e.preventDefault() : undefined}
              title={
                resumeAvailable ? 'Download Resume'
                : resumeError ? 'Resume unavailable — check admin panel'
                : 'No resume uploaded yet'
              }
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: resumeAvailable ? '#00ff88' : 'rgba(0,255,136,0.4)',
                textDecoration: 'none', fontWeight: 600,
                padding: '8px 0',
                cursor: resumeAvailable ? 'pointer' : 'not-allowed',
              }}
            >
              <FiDownload size={14} /> Download Resume
            </a>
            <a href="/admin/login" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 600 }}>
              Admin Panel
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
