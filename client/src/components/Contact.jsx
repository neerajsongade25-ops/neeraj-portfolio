import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiSend, FiMail, FiPhone, FiGithub, FiLinkedin, FiMapPin } from 'react-icons/fi';
import { submitContact } from '../utils/api';
import toast from 'react-hot-toast';

const contactInfo = [
  { icon: <FiMail />, label: 'Email', value: 'neerajsongade463@gmail.com', href: 'mailto:neerajsongade463@gmail.com' },
  { icon: <FiPhone />, label: 'Phone', value: '+91 7999521689', href: 'tel:+917999521689' },
  { icon: <FiMapPin />, label: 'Location', value: 'Bhopal (M.P), India', href: null },
  { icon: <FiGithub />, label: 'GitHub', value: 'https://github.com/neerajsongade25-ops', href: 'https://github.com/neerajsongade25-ops' },
  { icon: <FiLinkedin />, label: 'LinkedIn', value: 'linkedin.com/in/neeraj-songade', href: 'https://www.linkedin.com/in/neeraj-songade-3a787b315' },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await submitContact(form);
      toast.success(res.data.message || 'Message sent successfully!', { duration: 5000 });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
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
          color: '#00ff88',
          fontSize: '0.85rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>Get In Touch</span>
        <h2 className="section-title" style={{ marginTop: '0.5rem' }}>
          Contact{' '}
          <span style={{
            background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Me</span>
        </h2>
        <div className="section-divider" style={{ background: 'linear-gradient(90deg, #00ff88, #00d4ff)' }} />
        <p className="section-subtitle">
          Have a project in mind? Let's build something amazing together.
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
      }}>
        {/* Left: Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, fontSize: '1.2rem',
              marginBottom: '0.5rem',
            }}>
              Let's <span className="gradient-text">Connect</span>
            </h3>
            <p style={{ color: '#8892b0', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              I'm currently open to internship and job opportunities. Whether you have a question,
              a project idea, or just want to say hi — my inbox is always open!
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contactInfo.map((info) => (
                <div key={info.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 38, height: 38,
                    borderRadius: '10px',
                    background: 'rgba(0,212,255,0.1)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#00d4ff',
                    flexShrink: 0,
                  }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ color: '#8892b0', fontSize: '0.75rem' }}>{info.label}</div>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        style={{ color: '#ccd6f6', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 500 }}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <span style={{ color: '#ccd6f6', fontSize: '0.88rem', fontWeight: 500 }}>{info.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 10, height: 10,
                borderRadius: '50%',
                background: '#00ff88',
                boxShadow: '0 0 12px #00ff88',
                animation: 'glow-pulse 2s ease-in-out infinite',
              }} />
              <span style={{ color: '#ccd6f6', fontWeight: 500, fontSize: '0.9rem' }}>
                Available for Full-time & Internships
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right: Contact form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, fontSize: '1.2rem',
              marginBottom: '1.5rem',
            }}>
              Send a <span className="gradient-text">Message</span>
            </h3>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="contact-name" style={{ display: 'block', marginBottom: '0.5rem', color: '#8892b0', fontSize: '0.88rem', fontWeight: 500 }}>
                Your Name *
              </label>
              <input
                id="contact-name"
                className="form-input"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="contact-email" style={{ display: 'block', marginBottom: '0.5rem', color: '#8892b0', fontSize: '0.88rem', fontWeight: 500 }}>
                Email Address *
              </label>
              <input
                id="contact-email"
                className="form-input"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="contact-message" style={{ display: 'block', marginBottom: '0.5rem', color: '#8892b0', fontSize: '0.88rem', fontWeight: 500 }}>
                Message *
              </label>
              <textarea
                id="contact-message"
                className="form-input"
                name="message"
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                value={form.message}
                onChange={handleChange}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.03, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              className="btn-glow btn-primary"
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend /> Send Message
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p style={{ color: '#8892b0', fontSize: '0.88rem' }}>
          Designed & Built by{' '}
          <span className="gradient-text" style={{ fontWeight: 600 }}>Neeraj Songade</span>
          {' '}• {new Date().getFullYear()}
        </p>
      </motion.div>
    </section>
  );
};

export default Contact;
