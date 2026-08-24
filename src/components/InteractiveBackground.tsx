import React, { useEffect, useRef, useState } from 'react';
import { Stage } from '../types';
import { Sun, Sunset, Moon, Clock } from 'lucide-react';

interface InteractiveBackgroundProps {
  currentStage: Stage;
  isModalOpen?: boolean;
}

export type AtmosphereMode = 'AUTO' | 'DAWN' | 'SUNSET' | 'MIDNIGHT';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  vz: number;
  alpha: number;
}

const ATMOSPHERE_PALETTES: Record<'DAWN' | 'SUNSET' | 'MIDNIGHT', { primary: string; secondary: string; accent: string; bgRadial: string }> = {
  DAWN: {
    primary: 'rgba(251, 146, 60, 0.35)',    // Morning Amber
    secondary: 'rgba(244, 114, 182, 0.28)',  // Soft Dawn Pink
    accent: 'rgba(254, 240, 138, 0.50)',   // Golden Morning Light
    bgRadial: 'radial-gradient(circle at 50% 30%, rgba(251, 146, 60, 0.18) 0%, rgba(244, 114, 182, 0.10) 45%, rgba(10, 10, 12, 1) 90%)'
  },
  SUNSET: {
    primary: 'rgba(249, 115, 22, 0.35)',    // Deep Sunset Coral
    secondary: 'rgba(217, 70, 239, 0.28)',   // Twilight Magenta
    accent: 'rgba(253, 230, 138, 0.50)',   // Golden Hour Glow
    bgRadial: 'radial-gradient(circle at 50% 40%, rgba(249, 115, 22, 0.20) 0%, rgba(217, 70, 239, 0.10) 50%, rgba(8, 8, 10, 1) 90%)'
  },
  MIDNIGHT: {
    primary: 'rgba(99, 102, 241, 0.32)',    // Deep Indigo Starlight
    secondary: 'rgba(168, 85, 247, 0.25)',  // Cosmic Purple
    accent: 'rgba(186, 230, 253, 0.50)',   // Silver Moon Beam
    bgRadial: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.16) 0%, rgba(168, 85, 247, 0.08) 55%, rgba(5, 5, 8, 1) 95%)'
  }
};

const STAGE_PALETTES: Record<Stage, { primary: string; secondary: string; accent: string; bgRadial: string }> = {
  ENTRY: {
    primary: 'rgba(139, 92, 246, 0.25)',
    secondary: 'rgba(249, 115, 22, 0.20)',
    accent: 'rgba(201, 168, 124, 0.40)',
    bgRadial: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.12) 0%, rgba(249, 115, 22, 0.08) 40%, rgba(10, 10, 11, 1) 90%)'
  },
  PREPARATION: {
    primary: 'rgba(245, 158, 11, 0.25)',
    secondary: 'rgba(217, 119, 6, 0.20)',
    accent: 'rgba(253, 230, 138, 0.45)',
    bgRadial: 'radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.14) 0%, rgba(180, 83, 9, 0.06) 50%, rgba(10, 10, 11, 1) 90%)'
  },
  THRESHOLD: {
    primary: 'rgba(244, 114, 182, 0.25)',
    secondary: 'rgba(249, 115, 22, 0.22)',
    accent: 'rgba(254, 205, 211, 0.45)',
    bgRadial: 'radial-gradient(circle at 50% 50%, rgba(244, 114, 182, 0.15) 0%, rgba(249, 115, 22, 0.09) 45%, rgba(10, 10, 11, 1) 90%)'
  },
  CONVERSATION: {
    primary: 'rgba(168, 85, 247, 0.22)',
    secondary: 'rgba(251, 146, 60, 0.22)',
    accent: 'rgba(216, 180, 254, 0.40)',
    bgRadial: 'radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.13) 0%, rgba(251, 146, 60, 0.08) 50%, rgba(10, 10, 11, 1) 90%)'
  },
  AUTOBIOGRAPHY: {
    primary: 'rgba(249, 115, 22, 0.28)',
    secondary: 'rgba(236, 72, 153, 0.22)',
    accent: 'rgba(253, 230, 138, 0.50)',
    bgRadial: 'radial-gradient(circle at 50% 40%, rgba(249, 115, 22, 0.16) 0%, rgba(236, 72, 153, 0.08) 45%, rgba(10, 10, 11, 1) 90%)'
  },
  MOMENTS: {
    primary: 'rgba(56, 189, 248, 0.22)',
    secondary: 'rgba(249, 115, 22, 0.22)',
    accent: 'rgba(186, 230, 253, 0.45)',
    bgRadial: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.12) 0%, rgba(249, 115, 22, 0.09) 55%, rgba(10, 10, 11, 1) 90%)'
  },
  REFLECTION: {
    primary: 'rgba(129, 140, 248, 0.20)',
    secondary: 'rgba(192, 132, 252, 0.18)',
    accent: 'rgba(224, 231, 255, 0.40)',
    bgRadial: 'radial-gradient(circle at 50% 50%, rgba(129, 140, 248, 0.12) 0%, rgba(147, 51, 234, 0.06) 60%, rgba(10, 10, 11, 1) 90%)'
  },
  FAREWELL: {
    primary: 'rgba(251, 191, 36, 0.22)',
    secondary: 'rgba(244, 63, 94, 0.18)',
    accent: 'rgba(254, 243, 199, 0.45)',
    bgRadial: 'radial-gradient(circle at 50% 40%, rgba(251, 191, 36, 0.13) 0%, rgba(244, 63, 94, 0.07) 50%, rgba(10, 10, 11, 1) 90%)'
  }
};

export const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ currentStage, isModalOpen = false }) => {
  const [atmosphereMode, setAtmosphereMode] = useState<AtmosphereMode>('AUTO');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  // Calculate active atmosphere key
  const getEffectiveAtmosphere = (): 'DAWN' | 'SUNSET' | 'MIDNIGHT' => {
    if (atmosphereMode !== 'AUTO') return atmosphereMode;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'DAWN';
    if (hour >= 12 && hour < 19) return 'SUNSET';
    return 'MIDNIGHT';
  };

  const activeAtmosphereKey = getEffectiveAtmosphere();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Initialize 3D particle nodes
    const particleCount = Math.min(Math.floor((width * height) / 14000), 70);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const z = Math.random() * 400 + 100;
      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        size: Math.random() * 2.5 + 1,
        color: i % 2 === 0 ? 'primary' : i % 3 === 0 ? 'secondary' : 'accent',
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Blend stage palette with time atmosphere
      const stageP = STAGE_PALETTES[currentStage] || STAGE_PALETTES.ENTRY;
      const atmoP = ATMOSPHERE_PALETTES[activeAtmosphereKey];
      const palette = {
        primary: atmoP.primary,
        secondary: stageP.secondary,
        accent: atmoP.accent,
      };

      // Draw constellation links
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Render particles
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.baseY * 0.01) * 0.3;
        p.y += p.vy + Math.cos(time + p.baseX * 0.01) * 0.3;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const mdx = mouseRef.current.x - p.x;
        const mdy = mouseRef.current.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        const maxDist = 180;

        if (mdist < maxDist) {
          const force = (1 - mdist / maxDist) * 30;
          const angle = Math.atan2(mdy, mdx);
          p.x -= Math.cos(angle) * force * 0.1;
          p.y -= Math.sin(angle) * force * 0.1;
        }

        let drawColor = palette.primary;
        if (p.color === 'secondary') drawColor = palette.secondary;
        if (p.color === 'accent') drawColor = palette.accent;

        const radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        radial.addColorStop(0, drawColor);
        radial.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fillStyle = radial;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = drawColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentStage, activeAtmosphereKey]);

  const atmoP = ATMOSPHERE_PALETTES[activeAtmosphereKey];

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000">
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{ background: atmoP.bgRadial }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-90 transition-opacity duration-1000"
        />
      </div>

      {/* Floating Time-Adaptive Atmosphere Control Widget */}
      <div className={`fixed top-16 sm:top-20 right-3 sm:right-6 md:right-8 z-30 pointer-events-auto transition-all duration-300 ${
        isModalOpen ? 'opacity-0 pointer-events-none invisible -translate-y-2' : 'opacity-100'
      }`}>
        <div
          className="flex items-center gap-0.5 sm:gap-1 p-1 bg-black/85 border border-white/20 rounded-full backdrop-blur-xl shadow-2xl text-xs font-sans text-white/90"
          style={{ backgroundColor: 'rgba(10, 10, 14, 0.92)' }}
        >
          <button
            onClick={() => setAtmosphereMode('AUTO')}
            className={`px-2 sm:px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
              atmosphereMode === 'AUTO' ? 'bg-orange-500/30 text-orange-200 border border-orange-400/40' : 'hover:text-white'
            }`}
            style={atmosphereMode === 'AUTO' ? { backgroundColor: 'rgba(249, 115, 22, 0.35)', color: '#fed7aa' } : undefined}
            title="Auto Time Atmosphere"
          >
            <Clock className="w-3 h-3 text-orange-200" />
            <span className="text-[10px] sm:text-[11px]">Auto</span>
          </button>

          <button
            onClick={() => setAtmosphereMode('DAWN')}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              atmosphereMode === 'DAWN' ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40' : 'hover:text-white'
            }`}
            style={atmosphereMode === 'DAWN' ? { backgroundColor: 'rgba(245, 158, 11, 0.35)' } : undefined}
            title="Dawn Atmosphere"
          >
            <Sun className="w-3.5 h-3.5 text-amber-300" />
          </button>

          <button
            onClick={() => setAtmosphereMode('SUNSET')}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              atmosphereMode === 'SUNSET' ? 'bg-orange-500/30 text-orange-200 border border-orange-400/40' : 'hover:text-white'
            }`}
            style={atmosphereMode === 'SUNSET' ? { backgroundColor: 'rgba(249, 115, 22, 0.35)' } : undefined}
            title="Sunset Atmosphere"
          >
            <Sunset className="w-3.5 h-3.5 text-orange-400" />
          </button>

          <button
            onClick={() => setAtmosphereMode('MIDNIGHT')}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              atmosphereMode === 'MIDNIGHT' ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40' : 'hover:text-white'
            }`}
            style={atmosphereMode === 'MIDNIGHT' ? { backgroundColor: 'rgba(99, 102, 241, 0.35)' } : undefined}
            title="Midnight Atmosphere"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-300" />
          </button>
        </div>
      </div>
    </>
  );
};
