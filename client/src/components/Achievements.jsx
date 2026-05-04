import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getAchievements } from '../utils/api';

// Normalize a Cloudinary raw PDF URL to ensure it ends with .pdf
// Cloudinary serves raw assets with correct Content-Type only when the URL
// includes the extension. Older uploads don't have it — we append it here.
const normalizeCertUrl = (url, resourceType) => {
  if (!url) return url;
  // If it's already a raw Cloudinary asset without .pdf, append it
  if (
    resourceType === 'raw' &&
    url.includes('res.cloudinary.com') &&
    !url.toLowerCase().includes('.pdf')
  ) {
    return url + '.pdf';
  }
  return url;
};

// Download via fetch+blob so the file always saves with the correct filename
const handleDownload = async (url, filename) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback: open directly
    window.open(url, '_blank');
  }
};

const CertificateButtons = ({ achievement }) => {
  // Support Cloudinary URL (new) and legacy local path (existing DB docs)
  const rawUrl = achievement.certificateUrl
    || (achievement.certificateFile ? `/certificates/${achievement.certificateFile}` : null);

  if (!rawUrl) return null;

  const isPdf =
    rawUrl.toLowerCase().includes('.pdf') ||
    achievement.certificateResourceType === 'raw';

  // Ensure PDF URLs have .pdf extension for proper Cloudinary serving
  const certUrl = isPdf
    ? normalizeCertUrl(rawUrl, achievement.certificateResourceType)
    : rawUrl;

  const downloadName = `${achievement.title.replace(/\s+/g, '_')}_Certificate${isPdf ? '.pdf' : ''}`;

  // For PDFs: route through Google Docs Viewer which renders cross-origin
  // PDFs server-side — bypasses Chrome's native PDF viewer CORS restrictions
  // with Cloudinary raw assets entirely.
  const viewUrl = isPdf
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(certUrl)}&embedded=false`
    : certUrl;

  // For download: use fl_attachment flag so Cloudinary sends the correct
  // Content-Disposition: attachment header, forcing a true file download.
  const downloadUrl = isPdf && certUrl.includes('res.cloudinary.com')
    ? certUrl.replace('/raw/upload/', '/raw/upload/fl_attachment/')
    : certUrl;

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
      {/* View — PDFs via Google Docs Viewer, images open directly */}
      <a
        href={viewUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 12px',
          borderRadius: '8px',
          background: `${achievement.accentColor}18`,
          border: `1px solid ${achievement.accentColor}44`,
          color: achievement.accentColor,
          textDecoration: 'none',
          fontSize: '0.78rem',
          fontWeight: 600,
          letterSpacing: '0.3px',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = `${achievement.accentColor}28`;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = `${achievement.accentColor}18`;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span style={{ fontSize: '0.85rem' }}>👁</span>
        View Certificate
      </a>

      {/* Download — uses Cloudinary attachment flag for reliable download */}
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 12px',
          borderRadius: '8px',
          background: 'rgba(0,255,136,0.08)',
          border: '1px solid rgba(0,255,136,0.25)',
          color: '#00ff88',
          textDecoration: 'none',
          fontSize: '0.78rem',
          fontWeight: 600,
          letterSpacing: '0.3px',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(0,255,136,0.16)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(0,255,136,0.08)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span style={{ fontSize: '0.85rem' }}>⬇</span>
        Download
      </button>
    </div>
  );
};

// Skeleton card while loading
const SkeletonCard = () => (
  <div
    className="glass-card"
    style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}
  >
    <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: 50, height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.06)' }} />
    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.06)', marginBottom: '1.25rem' }} />
    <div style={{ height: 18, width: '70%', borderRadius: 8, background: 'rgba(255,255,255,0.06)', marginBottom: '0.6rem' }} />
    <div style={{ height: 13, width: '45%', borderRadius: 8, background: 'rgba(255,255,255,0.04)', marginBottom: '0.9rem' }} />
    <div style={{ height: 12, width: '100%', borderRadius: 8, background: 'rgba(255,255,255,0.04)', marginBottom: '0.4rem' }} />
    <div style={{ height: 12, width: '85%', borderRadius: 8, background: 'rgba(255,255,255,0.04)', marginBottom: '0.4rem' }} />
    <div style={{ height: 12, width: '60%', borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.04)', borderRadius: '0 0 16px 16px' }} />
  </div>
);

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    getAchievements()
      .then(r => setAchievements(r.data.data || []))
      .catch(err => {
        console.error('Failed to load achievements:', err);
        setAchievements([]);
      })
      .finally(() => setLoading(false));
  }, []);

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
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : achievements.map((achievement, index) => (
            <motion.div
              key={achievement._id}
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

              {/* Certificate buttons — only shown if a certificate is attached */}
              <CertificateButtons achievement={achievement} />

              {/* Bottom accent line */}
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '2px',
                background: achievement.gradient,
                borderRadius: '0 0 16px 16px',
              }} />
            </motion.div>
          ))
        }
      </div>
    </section>
  );
};

export default Achievements;
