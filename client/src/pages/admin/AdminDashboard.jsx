import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiCode, FiZap, FiMail, FiLogOut, FiMenu, FiX,
  FiPlus, FiEdit2, FiTrash2, FiCheck, FiEye,
} from 'react-icons/fi';
import {
  getProjects, createProject, updateProject, deleteProject,
  getSkills, createSkill, updateSkill, deleteSkill,
  getMessages, deleteMessage, markMessageRead,
} from '../../utils/api';
import toast from 'react-hot-toast';

const navItems = [
  { id: 'overview', label: 'Overview', icon: <FiHome /> },
  { id: 'projects', label: 'Projects', icon: <FiCode /> },
  { id: 'skills', label: 'Skills', icon: <FiZap /> },
  { id: 'messages', label: 'Messages', icon: <FiMail /> },
];

// ---- Reusable modal ----
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: 540, padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8892b0', fontSize: '1.2rem' }}>
            <FiX />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

// ---- Projects Tab ----
const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState({ title: '', description: '', longDescription: '', techStack: '', category: 'Full Stack', githubUrl: '', liveUrl: '', featured: false });

  const fetchProjects = () => {
    setLoading(true);
    getProjects().then(r => setProjects(r.data.data || [])).catch(() => toast.error('Failed to load projects')).finally(() => setLoading(false));
  };
  useEffect(fetchProjects, []);

  const openAdd = () => {
    setForm({ title: '', description: '', longDescription: '', techStack: '', category: 'Full Stack', githubUrl: '', liveUrl: '', featured: false });
    setModal({ open: true, mode: 'add', data: null });
  };
  const openEdit = (p) => {
    setForm({ ...p, techStack: (p.techStack || []).join(', ') });
    setModal({ open: true, mode: 'edit', data: p });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (modal.mode === 'add') {
        await createProject(payload);
        toast.success('Project created!');
      } else {
        await updateProject(modal.data._id, payload);
        toast.success('Project updated!');
      }
      setModal({ open: false });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted!');
      fetchProjects();
    } catch { toast.error('Failed to delete.'); }
  };

  const inputStyle = { display: 'block', width: '100%', marginBottom: '1rem' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.3rem' }}>
          Manage <span className="gradient-text">Projects</span>
        </h2>
        <motion.button whileHover={{ scale: 1.03 }} className="btn-glow btn-primary" onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '8px 18px', fontSize: '0.88rem' }}>
          <FiPlus /> Add Project
        </motion.button>
      </div>

      {loading ? <div style={{ color: '#8892b0', textAlign: 'center' }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects.map(p => (
            <div key={p._id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{p.title}</h3>
                  {p.featured && <span style={{ fontSize: '0.75rem', color: '#ffd700' }}>⭐ Featured</span>}
                </div>
                <p style={{ color: '#8892b0', fontSize: '0.85rem', lineHeight: 1.5 }}>{p.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                  {(p.techStack || []).map(t => <span key={t} className="tech-tag">{t}</span>)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(p)} style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '6px 10px', color: '#00d4ff', cursor: 'pointer' }}>
                  <FiEdit2 />
                </button>
                <button onClick={() => handleDelete(p._id)} style={{ background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 8, padding: '6px 10px', color: '#e91e8c', cursor: 'pointer' }}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal.open} onClose={() => setModal({ open: false })} title={modal.mode === 'add' ? 'Add Project' : 'Edit Project'}>
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Title *', name: 'title', type: 'text', placeholder: 'Project Name' },
            { label: 'Description *', name: 'description', type: 'textarea', placeholder: 'Short description...' },
            { label: 'Long Description', name: 'longDescription', type: 'textarea', placeholder: 'Detailed description...' },
            { label: 'Tech Stack (comma separated)', name: 'techStack', type: 'text', placeholder: 'React.js, Node.js, MongoDB' },
            { label: 'GitHub URL', name: 'githubUrl', type: 'url', placeholder: 'https://github.com/...' },
            { label: 'Live URL', name: 'liveUrl', type: 'url', placeholder: 'https://...' },
          ].map(field => (
            <div key={field.name} style={inputStyle}>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: '#8892b0', fontSize: '0.85rem', fontWeight: 500 }}>{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea className="form-input" name={field.name} rows={3} placeholder={field.placeholder} value={form[field.name]} onChange={e => setForm({ ...form, [field.name]: e.target.value })} style={{ resize: 'vertical' }} />
              ) : (
                <input className="form-input" type={field.type} name={field.name} placeholder={field.placeholder} value={form[field.name]} onChange={e => setForm({ ...form, [field.name]: e.target.value })} />
              )}
            </div>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer', color: '#8892b0', fontSize: '0.88rem' }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
            Featured Project
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={() => setModal({ open: false })} className="btn-glow btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-glow btn-primary" style={{ flex: 1 }}>
              {modal.mode === 'add' ? 'Create' : 'Update'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ---- Skills Tab ----
const SkillsTab = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState({ name: '', category: 'Languages', level: 80 });

  const cats = ['Languages', 'Web', 'Database', 'Core', 'Tools'];

  const fetchSkills = () => {
    setLoading(true);
    getSkills().then(r => setSkills(r.data.data || [])).catch(() => toast.error('Failed to load skills')).finally(() => setLoading(false));
  };
  useEffect(fetchSkills, []);

  const openAdd = () => {
    setForm({ name: '', category: 'Languages', level: 80 });
    setModal({ open: true, mode: 'add', data: null });
  };
  const openEdit = (s) => {
    setForm({ name: s.name, category: s.category, level: s.level });
    setModal({ open: true, mode: 'edit', data: s });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.mode === 'add') { await createSkill(form); toast.success('Skill added!'); }
      else { await updateSkill(modal.data._id, form); toast.success('Skill updated!'); }
      setModal({ open: false });
      fetchSkills();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try { await deleteSkill(id); toast.success('Skill deleted!'); fetchSkills(); }
    catch { toast.error('Failed to delete.'); }
  };

  const grouped = skills.reduce((a, s) => { (a[s.category] = a[s.category] || []).push(s); return a; }, {});

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.3rem' }}>
          Manage <span className="gradient-text">Skills</span>
        </h2>
        <motion.button whileHover={{ scale: 1.03 }} className="btn-glow btn-primary" onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '8px 18px', fontSize: '0.88rem' }}>
          <FiPlus /> Add Skill
        </motion.button>
      </div>

      {loading ? <div style={{ color: '#8892b0', textAlign: 'center' }}>Loading...</div> : (
        Object.entries(grouped).map(([cat, catSkills]) => (
          <div key={cat} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#00d4ff', marginBottom: '0.75rem' }}>
              {cat}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {catSkills.map(s => (
                <div key={s._id} className="glass-card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</span>
                    <span style={{ color: '#00d4ff', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}>{s.level}%</span>
                  </div>
                  <div className="skill-bar-track" style={{ marginBottom: '0.75rem' }}>
                    <div style={{ width: `${s.level}%`, height: '100%', background: 'linear-gradient(90deg, #00d4ff, #9b59b6)', borderRadius: 3 }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => openEdit(s)} style={{ flex: 1, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 6, padding: '4px', color: '#00d4ff', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <FiEdit2 size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(s._id)} style={{ flex: 1, background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 6, padding: '4px', color: '#e91e8c', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <Modal open={modal.open} onClose={() => setModal({ open: false })} title={modal.mode === 'add' ? 'Add Skill' : 'Edit Skill'}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: '#8892b0', fontSize: '0.85rem', fontWeight: 500 }}>Skill Name *</label>
            <input className="form-input" type="text" placeholder="React.js" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: '#8892b0', fontSize: '0.85rem', fontWeight: 500 }}>Category</label>
            <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              style={{ appearance: 'none', cursor: 'pointer' }}>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: '#8892b0', fontSize: '0.85rem', fontWeight: 500 }}>
              Proficiency Level: <span style={{ color: '#00d4ff' }}>{form.level}%</span>
            </label>
            <input type="range" min="0" max="100" value={form.level} onChange={e => setForm({ ...form, level: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#00d4ff' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={() => setModal({ open: false })} className="btn-glow btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-glow btn-primary" style={{ flex: 1 }}>
              {modal.mode === 'add' ? 'Add Skill' : 'Update'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ---- Messages Tab ----
const MessagesTab = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    setLoading(true);
    getMessages().then(r => setMessages(r.data.data || [])).catch(() => toast.error('Failed to load messages')).finally(() => setLoading(false));
  };
  useEffect(fetchMessages, []);

  const handleMarkRead = async (id) => {
    try { await markMessageRead(id); fetchMessages(); }
    catch { toast.error('Failed.'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await deleteMessage(id); toast.success('Message deleted!'); fetchMessages(); }
    catch { toast.error('Failed to delete.'); }
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem' }}>
        Contact <span className="gradient-text">Messages</span>
      </h2>
      {loading ? <div style={{ color: '#8892b0', textAlign: 'center' }}>Loading...</div> : messages.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#8892b0', fontSize: '2rem', marginBottom: '0.75rem' }}>📭</p>
          <p style={{ color: '#8892b0' }}>No messages yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => (
            <div key={msg._id} className="glass-card" style={{ padding: '1.25rem', opacity: msg.read ? 0.7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: '#f0f0f5' }}>{msg.name}</span>
                    {!msg.read && <span style={{ padding: '2px 8px', borderRadius: '10px', background: 'rgba(0,212,255,0.15)', color: '#00d4ff', fontSize: '0.72rem', fontWeight: 600 }}>New</span>}
                  </div>
                  <a href={`mailto:${msg.email}`} style={{ color: '#00d4ff', fontSize: '0.85rem', textDecoration: 'none' }}>{msg.email}</a>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {!msg.read && (
                    <button onClick={() => handleMarkRead(msg._id)} title="Mark as read" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '6px 10px', color: '#00ff88', cursor: 'pointer' }}>
                      <FiCheck />
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg._id)} style={{ background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 8, padding: '6px 10px', color: '#e91e8c', cursor: 'pointer' }}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <p style={{ color: '#8892b0', fontSize: '0.9rem', lineHeight: 1.6 }}>{msg.message}</p>
              <p style={{ color: '#4a5568', fontSize: '0.78rem', marginTop: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>
                {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Overview Tab ----
const OverviewTab = ({ admin }) => (
  <div>
    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.4rem', marginBottom: '1.5rem' }}>
      Welcome back, <span className="gradient-text">Admin</span> 👋
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      {[
        { label: 'Admin Email', value: admin?.email, icon: '🔐' },
        { label: 'Role', value: 'Administrator', icon: '👑' },
        { label: 'Status', value: 'Active', icon: '✅' },
        { label: 'Session', value: 'Secure JWT', icon: '🛡️' },
      ].map(card => (
        <div key={card.label} className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
          <div style={{ color: '#8892b0', fontSize: '0.78rem', marginBottom: '0.25rem' }}>{card.label}</div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', wordBreak: 'break-all' }}>{card.value}</div>
        </div>
      ))}
    </div>
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>Quick Actions</h3>
      <p style={{ color: '#8892b0', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Use the sidebar to manage your portfolio content. You can:
      </p>
      <ul style={{ marginTop: '0.75rem', color: '#8892b0', fontSize: '0.9rem', lineHeight: 2, listStyle: 'none' }}>
        <li>🚀 Add, edit, or delete projects</li>
        <li>⚡ Manage your skills and proficiency levels</li>
        <li>📨 View and respond to contact messages</li>
      </ul>
    </div>
  </div>
);

// ---- Main Dashboard ----
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'projects': return <ProjectsTab />;
      case 'skills': return <SkillsTab />;
      case 'messages': return <MessagesTab />;
      default: return <OverviewTab admin={admin} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: 250,
        background: 'rgba(13, 13, 26, 0.98)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        height: '100vh',
        position: 'fixed',
        top: 0, left: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        transform: sidebarOpen || window.innerWidth > 768 ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}
        className="hidden md:flex"
      >
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #00d4ff, #9b59b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>NS</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Portfolio Admin</div>
            <div style={{ color: '#8892b0', fontSize: '0.75rem' }}>{admin?.email}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '1rem', flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '10px 12px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === item.id ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: activeTab === item.id ? '#00d4ff' : '#8892b0',
                fontWeight: activeTab === item.id ? 600 : 400,
                cursor: 'pointer',
                marginBottom: '0.25rem',
                fontSize: '0.92rem',
                textAlign: 'left',
                borderLeft: activeTab === item.id ? '2px solid #00d4ff' : '2px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 12px', borderRadius: '8px', color: '#8892b0', textDecoration: 'none', fontSize: '0.87rem' }}>
            <FiEye size={14} /> View Portfolio
          </a>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 12px', borderRadius: '8px', background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.2)', color: '#e91e8c', cursor: 'pointer', fontSize: '0.87rem' }}>
            <FiLogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: 250, flex: 1, padding: '2rem', minHeight: '100vh' }}>
        {/* Mobile header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>
            {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="md:hidden"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  padding: '6px 12px', borderRadius: '8px', border: 'none',
                  background: activeTab === item.id ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
                  color: activeTab === item.id ? '#00d4ff' : '#8892b0',
                  cursor: 'pointer', fontSize: '0.82rem',
                }}>
                {item.icon} {item.label}
              </button>
            ))}
            <button onClick={handleLogout}
              style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.2)', color: '#e91e8c', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FiLogOut size={12} /> Logout
            </button>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTab()}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
