import { useEffect, useRef } from 'react';

const ParticlesCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.8 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5
          ? `rgba(0, 212, 255, ${this.opacity})`
          : `rgba(155, 89, 182, ${this.opacity})`;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.life++;
        if (this.life > this.maxLife || this.y < -20) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.sin((this.life / this.maxLife) * Math.PI) * this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < 120; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height; // scatter initially
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    // Draw connecting lines between nearby particles
    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 100) * 0.08;
            ctx.strokeStyle = 'rgba(0, 212, 255, 1)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default ParticlesCanvas;
