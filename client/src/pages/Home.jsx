import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Achievements from '../components/Achievements';
import Contact from '../components/Contact';
import ScrollProgress from '../components/ScrollProgress';
import ParticlesCanvas from '../components/ParticlesCanvas';
import { Toaster } from 'react-hot-toast';

const Home = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(13, 13, 26, 0.95)',
            color: '#f0f0f5',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#00ff88', secondary: '#050508' } },
          error: { iconTheme: { primary: '#e91e8c', secondary: '#050508' } },
        }}
      />

      <ScrollProgress />
      <ParticlesCanvas />

      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Custom cursor glow */}
      <CursorGlow />

      <Navbar />

      <main>
        <Hero />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <SectionSeparator />
          <About />
          <SectionSeparator />
          <Skills />
          <SectionSeparator />
          <Projects />
          <SectionSeparator />
          <Achievements />
          <SectionSeparator />
          <Contact />
        </div>
      </main>
    </>
  );
};

// Subtle gradient separator between sections
const SectionSeparator = () => (
  <div style={{
    height: 1,
    margin: '0 1.5rem',
    background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)',
  }} />
);

// Cursor glow effect
const CursorGlow = () => {
  const handleMouseMove = (e) => {
    const el = document.getElementById('cursor-glow');
    if (el) {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
  }

  return <div id="cursor-glow" className="cursor-glow" />;
};

export default Home;
