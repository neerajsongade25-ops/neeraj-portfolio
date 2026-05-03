import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiCode, FiZap, FiMail, FiLogOut, FiMenu, FiX,
  FiPlus, FiEdit2, FiTrash2, FiCheck, FiEye, FiFileText, FiUpload, FiDownload, FiAward,
} from 'react-icons/fi';
import {
  getProjects, createProject, updateProject, deleteProject,
  getSkills, createSkill, updateSkill, deleteSkill,
  getMessages, deleteMessage, markMessageRead,
  getResumeStatus, uploadResume, deleteResume,
  getAchievements, createAchievement, updateAchievement, deleteAchievement,
} from '../../utils/api';
import toast from 'react-hot-toast';

const navItems = [
  { id: 'overview', label: 'Overview', icon: <FiHome /> },
  { id: 'projects', label: 'Projects', icon: <FiCode /> },
  { id: 'skills', label: 'Skills', icon: <FiZap /> },
  { id: 'messages', label: 'Messages', icon: <FiMail /> },
  { id: 'resume', label: 'Resume', icon: <FiFileText /> },
  { id: 'achievements', label: 'Achievements', icon: <FiAward /> },
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

// ---- Resume Tab ----
const ResumeTab = () => {
  const [status, setStatus] = useState(null); // { exists, size, lastModified }
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await getResumeStatus();
      setStatus(res.data);
    } catch {
      toast.error('Failed to check resume status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed!');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB.');
      return;
    }
    setUploading(true);
    try {
      await uploadResume(file);
      toast.success('Resume uploaded successfully! 🎉');
      await fetchStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete the current resume? This will remove it from your portfolio.')) return;
    setDeleting(true);
    try {
      await deleteResume();
      toast.success('Resume deleted.');
      await fetchStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem' }}>
        Manage <span className="gradient-text">Resume</span>
      </h2>

      {loading ? (
        <div style={{ color: '#8892b0', textAlign: 'center', padding: '3rem' }}>Checking resume status...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Current Resume Status */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem', color: '#8892b0' }}>
              Current Resume
            </h3>
            {status?.exists ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(155,89,182,0.15))',
                    border: '1px solid rgba(0,212,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FiFileText size={22} color="#00d4ff" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>resume.pdf</div>
                    <div style={{ color: '#8892b0', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}>
                      {formatSize(status.size)} · Last updated {new Date(status.lastModified).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <a
                    href={status.url || '/resume.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '8px',
                      background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)',
                      color: '#00d4ff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
                    }}
                  >
                    <FiEye size={14} /> Preview
                  </a>
                  <a
                    href={status.url || '/resume.pdf'}
                    download="Neeraj_Songade_Resume.pdf"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '8px',
                      background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)',
                      color: '#00ff88', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
                    }}
                  >
                    <FiDownload size={14} /> Download
                  </a>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '8px',
                      background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.2)',
                      color: '#e91e8c', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                    }}
                  >
                    <FiTrash2 size={14} /> {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '12px',
                  background: 'rgba(233,30,140,0.08)', border: '1px solid rgba(233,30,140,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FiFileText size={22} color="#e91e8c" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>No resume uploaded</div>
                  <div style={{ color: '#8892b0', fontSize: '0.8rem' }}>Upload a PDF below to make it available on your portfolio</div>
                </div>
              </div>
            )}
          </div>

          {/* Upload Zone */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem', color: '#8892b0' }}>
              {status?.exists ? 'Replace Resume' : 'Upload Resume'}
            </h3>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#00d4ff' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '16px',
                padding: '3rem 2rem',
                textAlign: 'center',
                cursor: uploading ? 'not-allowed' : 'pointer',
                background: dragOver ? 'rgba(0,212,255,0.04)' : 'rgba(255,255,255,0.01)',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                {uploading ? '⏳' : '📄'}
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                {uploading ? 'Uploading...' : 'Drop your PDF here'}
              </div>
              <div style={{ color: '#8892b0', fontSize: '0.82rem', marginBottom: '1rem' }}>
                {uploading ? 'Please wait...' : 'or click to browse · PDF only · Max 10MB'}
              </div>
              {!uploading && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="btn-glow btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', fontSize: '0.88rem' }}
                >
                  <FiUpload size={15} /> Choose PDF File
                </motion.button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <p style={{ color: '#4a5568', fontSize: '0.78rem', marginTop: '1rem', textAlign: 'center' }}>
              💡 Uploading a new file will instantly replace the current resume on your portfolio.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
// ---- Achievements Tab ----
const AchievementsTab = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const certInputRef = useRef(null);
  const [certPreview, setCertPreview] = useState(null);
  const [certFile, setCertFile] = useState(null);
  const [removeCert, setRemoveCert] = useState(false);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    title: '', subtitle: '', description: '', icon: '🏆',
    year: '', accentColor: '#00d4ff',
    gradient: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(155,89,182,0.15))',
    order: '',
  };
  const [form, setForm] = useState(emptyForm);

  const PRESET_GRADIENTS = [
    { label: 'Cyan/Purple', value: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(155,89,182,0.15))' },
    { label: 'Gold/Orange', value: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.15))' },
    { label: 'Green/Cyan', value: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,212,255,0.15))' },
    { label: 'Pink/Purple', value: 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(155,89,182,0.15))' },
    { label: 'Blue/Green', value: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(16,185,129,0.15))' },
    { label: 'Red/Orange', value: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.15))' },
  ];

  const fetchAchievements = () => {
    setLoading(true);
    getAchievements()
      .then(r => setAchievements(r.data.data || []))
      .catch(() => toast.error('Failed to load achievements'))
      .finally(() => setLoading(false));
  };
  useEffect(fetchAchievements, []);

  const openAdd = () => {
    setForm(emptyForm);
    setCertFile(null);
    setCertPreview(null);
    setRemoveCert(false);
    setModal({ open: true, mode: 'add', data: null });
  };

  const openEdit = (a) => {
    setForm({
      title: a.title || '',
      subtitle: a.subtitle || '',
      description: a.description || '',
      icon: a.icon || '🏆',
      year: a.year || '',
      accentColor: a.accentColor || '#00d4ff',
      gradient: a.gradient || PRESET_GRADIENTS[0].value,
      order: a.order ?? '',
    });
    setCertFile(null);
    // Support Cloudinary URL (new) and legacy local path (existing DB docs)
    const existingCertUrl = a.certificateUrl
      || (a.certificateFile ? `/certificates/${a.certificateFile}` : null);
    setCertPreview(existingCertUrl || null);
    setRemoveCert(false);
    setModal({ open: true, mode: 'edit', data: a });
  };

  const handleCertChange = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF or image files allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB.');
      return;
    }
    setCertFile(file);
    setRemoveCert(false);
    if (file.type.startsWith('image/')) {
      setCertPreview(URL.createObjectURL(file));
    } else {
      setCertPreview('pdf');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (certFile) fd.append('certificate', certFile);
      if (removeCert && !certFile) fd.append('removeCertificate', 'true');

      if (modal.mode === 'add') {
        await createAchievement(fd);
        toast.success('Achievement created! 🏆');
      } else {
        await updateAchievement(modal.data._id, fd);
        toast.success('Achievement updated!');
      }
      setModal({ open: false });
      fetchAchievements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this achievement? Its certificate file will also be removed.')) return;
    try {
      await deleteAchievement(id);
      toast.success('Achievement deleted.');
      fetchAchievements();
    } catch { toast.error('Failed to delete.'); }
  };

  const inputStyle = { display: 'block', width: '100%', marginBottom: '1rem' };
  const labelStyle = { display: 'block', marginBottom: '0.4rem', color: '#8892b0', fontSize: '0.85rem', fontWeight: 500 };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.3rem' }}>
          Manage <span className="gradient-text">Achievements</span>
        </h2>
        <motion.button whileHover={{ scale: 1.03 }} className="btn-glow btn-primary" onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '8px 18px', fontSize: '0.88rem' }}>
          <FiPlus /> Add Achievement
        </motion.button>
      </div>

      {loading ? <div style={{ color: '#8892b0', textAlign: 'center' }}>Loading...</div> : (
        achievements.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏆</p>
            <p style={{ color: '#8892b0' }}>No achievements yet. Add your first one!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {achievements.map(a => (
              <div key={a._id} className="glass-card" style={{
                padding: '1.25rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                flexWrap: 'wrap', gap: '0.75rem',
                borderLeft: `3px solid ${a.accentColor}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.3rem' }}>{a.icon}</span>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#f0f0f5' }}>{a.title}</h3>
                    {a.year && <span style={{ fontSize: '0.75rem', color: '#8892b0', fontFamily: 'JetBrains Mono, monospace', padding: '2px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>{a.year}</span>}
                  </div>
                  {a.subtitle && <p style={{ color: a.accentColor, fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>{a.subtitle}</p>}
                  <p style={{ color: '#8892b0', fontSize: '0.85rem', lineHeight: 1.5 }}>{a.description}</p>
                  {/* Certificate links — support Cloudinary URL + legacy local path */}
                  {(a.certificateUrl || a.certificateFile) && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                      <a
                        href={a.certificateUrl || `/certificates/${a.certificateFile}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '0.78rem', color: '#00d4ff', display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: 6, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', textDecoration: 'none' }}
                      >
                        <FiEye size={12} /> View Cert
                      </a>
                      <a
                        href={a.certificateUrl || `/certificates/${a.certificateFile}`}
                        download
                        style={{ fontSize: '0.78rem', color: '#00ff88', display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: 6, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', textDecoration: 'none' }}
                      >
                        <FiDownload size={12} /> Download
                      </a>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => openEdit(a)} style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '6px 10px', color: '#00d4ff', cursor: 'pointer' }}>
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(a._id)} style={{ background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 8, padding: '6px 10px', color: '#e91e8c', cursor: 'pointer' }}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Add / Edit Modal */}
      <Modal open={modal.open} onClose={() => setModal({ open: false })} title={modal.mode === 'add' ? '🏆 Add Achievement' : '✏️ Edit Achievement'}>
        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div style={inputStyle}>
            <label style={labelStyle}>Title *</label>
            <input className="form-input" type="text" placeholder="e.g. Best UI/UX Award" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          {/* Icon + Year row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Icon (emoji)</label>
              <input className="form-input" type="text" placeholder="🏆" value={form.icon}
                onChange={e => setForm({ ...form, icon: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <input className="form-input" type="text" placeholder="2024" value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })} />
            </div>
          </div>

          {/* Subtitle */}
          <div style={inputStyle}>
            <label style={labelStyle}>Subtitle / Organisation</label>
            <input className="form-input" type="text" placeholder="e.g. MediTrack Project" value={form.subtitle}
              onChange={e => setForm({ ...form, subtitle: e.target.value })} />
          </div>

          {/* Description */}
          <div style={inputStyle}>
            <label style={labelStyle}>Description</label>
            <textarea className="form-input" rows={3} placeholder="Describe the achievement..." value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
          </div>

          {/* Accent Color + Order row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Accent Colour</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="color" value={form.accentColor}
                  onChange={e => setForm({ ...form, accentColor: e.target.value })}
                  style={{ width: 40, height: 38, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer', padding: 2 }} />
                <input className="form-input" type="text" value={form.accentColor}
                  onChange={e => setForm({ ...form, accentColor: e.target.value })}
                  style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Display Order</label>
              <input className="form-input" type="number" placeholder="1" value={form.order}
                onChange={e => setForm({ ...form, order: e.target.value })} />
            </div>
          </div>

          {/* Gradient Preset */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Card Gradient</label>
            <select className="form-input" value={form.gradient} onChange={e => setForm({ ...form, gradient: e.target.value })}
              style={{ appearance: 'none', cursor: 'pointer' }}>
              {PRESET_GRADIENTS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
            {/* Preview swatch */}
            <div style={{ height: 8, borderRadius: 4, marginTop: '0.5rem', background: form.gradient }} />
          </div>

          {/* Certificate Upload */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Certificate File (PDF or image, optional)</label>

            {/* Current cert preview */}
            {(certPreview || (modal.mode === 'edit' && modal.data?.certificateFile && !removeCert)) && !removeCert && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem', borderRadius: 10,
                background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)',
                marginBottom: '0.75rem',
              }}>
                <div style={{ fontSize: '1.5rem' }}>
                  {certPreview === 'pdf' || (modal.data?.certificateFile?.endsWith('.pdf') && !certFile) ? '📄' : '🖼️'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f0f0f5', marginBottom: '0.15rem' }}>
                    {certFile ? certFile.name : modal.data?.certificateFile}
                  </div>
                  <div style={{ color: '#8892b0', fontSize: '0.76rem' }}>
                    {certFile ? 'New file selected — will replace existing' : 'Current certificate'}
                  </div>
                </div>
                {!certFile && modal.data?.certificateFile && (
                  <a href={`/certificates/${modal.data.certificateFile}`} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#00d4ff', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', textDecoration: 'none', flexShrink: 0 }}>
                    <FiEye size={12} /> View
                  </a>
                )}
              </div>
            )}

            {/* Remove checkbox — only in edit mode if cert exists */}
            {modal.mode === 'edit' && modal.data?.certificateFile && !certFile && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', cursor: 'pointer', color: '#e91e8c', fontSize: '0.84rem' }}>
                <input type="checkbox" checked={removeCert}
                  onChange={e => {
                    setRemoveCert(e.target.checked);
                    if (e.target.checked) setCertPreview(null);
                    else setCertPreview(`/certificates/${modal.data.certificateFile}`);
                  }} />
                Remove existing certificate
              </label>
            )}

            {/* Upload zone */}
            <div
              onClick={() => !removeCert && certInputRef.current?.click()}
              style={{
                border: '2px dashed rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '1.5rem',
                textAlign: 'center',
                cursor: removeCert ? 'not-allowed' : 'pointer',
                opacity: removeCert ? 0.4 : 1,
                background: 'rgba(255,255,255,0.01)',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={e => !removeCert && (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>📎</div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                {certFile ? certFile.name : (modal.mode === 'edit' && modal.data?.certificateFile ? 'Click to replace certificate' : 'Click to upload certificate')}
              </div>
              <div style={{ color: '#8892b0', fontSize: '0.78rem' }}>PDF or image · Max 10MB</div>
            </div>
            <input
              ref={certInputRef}
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={e => handleCertChange(e.target.files[0])}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={() => setModal({ open: false })} className="btn-glow btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={saving} className="btn-glow btn-primary" style={{ flex: 1 }}>
              {saving ? 'Saving...' : modal.mode === 'add' ? 'Create' : 'Update'}
            </button>
          </div>
        </form>
      </Modal>
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
        <li>📄 Upload or replace your resume PDF</li>
        <li>🏆 Add, edit, or delete achievements &amp; upload certificates</li>
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
      case 'resume': return <ResumeTab />;
      case 'achievements': return <AchievementsTab />;
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
