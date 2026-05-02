import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '1.5rem',
    }}>
      {/* Bg orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: 420, padding: '2.5rem', zIndex: 2 }}
      >
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(155,89,182,0.2))',
            border: '1px solid rgba(0,212,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.8rem',
          }}>
            🔐
          </div>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700, fontSize: '1.6rem',
            marginBottom: '0.4rem',
          }}>
            Admin <span className="gradient-text">Portal</span>
          </h1>
          <p style={{ color: '#8892b0', fontSize: '0.9rem' }}>
            Secure access to portfolio management
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="admin-email" style={{ display: 'block', marginBottom: '0.5rem', color: '#8892b0', fontSize: '0.88rem', fontWeight: 500 }}>
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a5568' }} />
              <input
                id="admin-email"
                className="form-input"
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="admin-password" style={{ display: 'block', marginBottom: '0.5rem', color: '#8892b0', fontSize: '0.88rem', fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a5568' }} />
              <input
                id="admin-password"
                className="form-input"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568',
                }}
              >
                {showPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.03 } : {}}
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
              <><div className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</>
            ) : (
              <><FiLock /> Sign In</>
            )}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#8892b0', fontSize: '0.83rem' }}>
          <a href="/" style={{ color: '#00d4ff', textDecoration: 'none' }}>← Back to Portfolio</a>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
