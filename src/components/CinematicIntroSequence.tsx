import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import tfcLogoImg from '../assets/images/tfclogo.png';

interface CinematicIntroSequenceProps {
  onComplete: () => void;
}

export const CinematicIntroSequence: React.FC<CinematicIntroSequenceProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<'BLACK' | 'INTRO_ANIMATION' | 'REVEAL'>('BLACK');
  const [showSkip, setShowSkip] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [waveRippleActive, setWaveRippleActive] = useState(false);

  useEffect(() => {
    // 0s to 1.0s: Pure Black
    const t1 = setTimeout(() => setPhase('INTRO_ANIMATION'), 1000);
    const tSkip = setTimeout(() => setShowSkip(true), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(tSkip);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'INTRO_ANIMATION') return;

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

    const centerX = width / 2;
    const centerY = height / 2;

    // 4 Corner starting points
    const corners = [
      { x: 0, y: 0, color: '#f59e0b', startAngle: 0 },                       // Top-Left Gold
      { x: width, y: 0, color: '#ec4899', startAngle: Math.PI / 2 },          // Top-Right Pink
      { x: width, y: height, color: '#06b6d4', startAngle: Math.PI },         // Bottom-Right Cyan
      { x: 0, y: height, color: '#10b981', startAngle: (Math.PI * 3) / 2 }    // Bottom-Left Emerald
    ];

    // 4 Mid-edge beams
    const midEdgeBeams = [
      { startX: centerX, startY: 0, color: '#fbbf24' },   // Top
      { startX: width, startY: centerY, color: '#f43f5e' }, // Right
      { startX: centerX, startY: height, color: '#00f2fe' },// Bottom
      { startX: 0, startY: centerY, color: '#10b981' }   // Left
    ];

    // Big Bang Cosmic Particles (video inspired)
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      spin: number;
    }

    const blastParticles: Particle[] = [];
    let bigBangTriggered = false;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      // Deep space black canvas with trail clear
      ctx.fillStyle = 'rgba(4, 4, 7, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // --- PHASE 1: Corner lines traveling to 1D Circle Orbit (1.0s to 4.5s) ---
      // --- PHASE 2: 1D Circle orbit rotating at ultra speed & circumference shrinking (4.5s to 9.5s) ---
      if (elapsed >= 1.0 && elapsed < 9.5) {
        const isApproaching = elapsed < 4.5;
        const initialOrbitRadius = Math.min(width, height) * 0.35;

        if (isApproaching) {
          // Lines traveling from the 4 corners to the circle edge
          const approachProgress = Math.min((elapsed - 1.0) / 3.5, 1.0); // 0 to 1

          corners.forEach((c) => {
            ctx.save();
            ctx.lineWidth = 3.5;
            ctx.shadowColor = c.color;
            ctx.shadowBlur = 18;

            const initialDist = Math.hypot(centerX - c.x, centerY - c.y);
            const currentDist = initialDist - (initialDist - initialOrbitRadius) * approachProgress;
            const angleToCenter = Math.atan2(centerY - c.y, centerX - c.x);

            ctx.beginPath();
            const steps = 45;
            for (let i = 0; i <= steps; i++) {
              const t = i / steps;
              const d = initialDist - (initialDist - currentDist) * t;
              const px = c.x + Math.cos(angleToCenter) * d;
              const py = c.y + Math.sin(angleToCenter) * d;

              // Wave sine ripple on travel
              const waveAmp = (1 - t) * 25 * Math.sin(t * Math.PI * 6 - elapsed * 10);
              const perpX = px + Math.cos(angleToCenter + Math.PI / 2) * waveAmp;
              const perpY = py + Math.sin(angleToCenter + Math.PI / 2) * waveAmp;

              // As it touches the circle boundary (t near 1), smoothly turn GOLDEN
              const colorBlend = t > 0.85 ? '#ffd700' : c.color;
              ctx.strokeStyle = colorBlend;

              if (i === 0) ctx.moveTo(perpX, perpY);
              else ctx.lineTo(perpX, perpY);
            }
            ctx.stroke();
            ctx.restore();
          });
        } else {
          // Seamless Continuation on the SAME 1D Circle Orbit!
          const orbitElapsed = elapsed - 4.5;
          const orbitProgress = Math.min(orbitElapsed / 5.0, 1.0); // 0 to 1 over 5 sec

          // Circumference / radius shrinks smoothly from 35% of screen down to 8px core point
          const currentRadius = initialOrbitRadius * (1 - Math.pow(orbitProgress, 1.5) * 0.96);

          // Fast infinite spin speed (accelerating as radius shrinks)
          const rotationSpeed = orbitElapsed * (6 + orbitProgress * 20);

          corners.forEach((c) => {
            ctx.save();
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#ffd700'; // GOLDEN COLORED
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 25;

            // Lock onto 1D circle starting at each corner's cardinal angle
            const baseAngle = c.startAngle + rotationSpeed;
            const arcSpan = (Math.PI / 2) * (1 - orbitProgress * 0.3);

            ctx.beginPath();
            ctx.arc(centerX, centerY, Math.max(2, currentRadius), baseAngle, baseAngle + arcSpan);
            ctx.stroke();

            // Bright golden head spark
            const sparkX = centerX + Math.cos(baseAngle + arcSpan) * currentRadius;
            const sparkY = centerY + Math.sin(baseAngle + arcSpan) * currentRadius;

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          });
        }
      }

      // --- PHASE 3: Mid-edge 4 Big Light Beams Speed Collision (9.5s to 10.8s) ---
      if (elapsed >= 9.5 && elapsed < 10.8) {
        const beamProgress = Math.min((elapsed - 9.5) / 1.3, 1.0); // 0 to 1

        // Central condensed golden singularity waiting for impact
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 35;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10 + Math.sin(elapsed * 25) * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        midEdgeBeams.forEach((m) => {
          ctx.save();
          ctx.lineWidth = 14;
          ctx.strokeStyle = m.color;
          ctx.shadowColor = m.color;
          ctx.shadowBlur = 40;

          const currentX = m.startX + (centerX - m.startX) * Math.pow(beamProgress, 2.5);
          const currentY = m.startY + (centerY - m.startY) * Math.pow(beamProgress, 2.5);

          ctx.beginPath();
          ctx.moveTo(m.startX, m.startY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();

          // High energy tip
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(currentX, currentY, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // --- PHASE 4: EXACT BIG BANG EXPLOSION (VIDEO STYLED: ACCRETION DISK + SUPERNOVA) (10.8s+) ---
      if (elapsed >= 10.8) {
        const bangElapsed = elapsed - 10.8;

        if (!bigBangTriggered) {
          bigBangTriggered = true;
          // Spawn 400+ explosion particles
          const colors = ['#ffffff', '#ffd700', '#f59e0b', '#ec4899', '#06b6d4', '#10b981', '#a855f7', '#ff007f', '#ff4500'];
          for (let i = 0; i < 400; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 22 + 4;
            blastParticles.push({
              x: centerX,
              y: centerY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: Math.random() * 6 + 2,
              color: colors[Math.floor(Math.random() * colors.length)],
              alpha: 1.0,
              decay: Math.random() * 0.01 + 0.003,
              spin: (Math.random() - 0.5) * 0.1
            });
          }
        }

        ctx.save();

        // Screen Shake during violent blast impact (first 0.9s)
        if (bangElapsed < 0.9) {
          const shakeFactor = (1 - bangElapsed / 0.9) * 22;
          const sx = (Math.random() - 0.5) * shakeFactor;
          const sy = (Math.random() - 0.5) * shakeFactor;
          ctx.translate(sx, sy);
        }

        // 1. Tilted Horizontal Accretion Disc Flare (Video 0:05 style)
        if (bangElapsed < 2.2) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(-Math.PI / 12); // Slightly tilted cosmic plane
          ctx.scale(3.5, 0.4); // Flattened wide ellipse

          const discRadius = bangElapsed * (width * 0.4);
          const discAlpha = Math.max(0, 1 - bangElapsed / 2.2);

          const discGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(1, discRadius));
          discGrad.addColorStop(0, `rgba(255, 255, 255, ${discAlpha})`);
          discGrad.addColorStop(0.3, `rgba(255, 215, 0, ${discAlpha * 0.9})`);
          discGrad.addColorStop(0.6, `rgba(236, 72, 153, ${discAlpha * 0.6})`);
          discGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = discGrad;
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(1, discRadius), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 2. Blinding White-Hot Supernova Central Explosion
        if (bangElapsed < 1.8) {
          const flashAlpha = Math.max(0, 1 - bangElapsed / 1.8);
          const flashRadius = bangElapsed * (width * 1.1);

          const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(1, flashRadius));
          grad.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
          grad.addColorStop(0.25, `rgba(251, 191, 36, ${flashAlpha * 0.9})`);
          grad.addColorStop(0.55, `rgba(244, 63, 94, ${flashAlpha * 0.7})`);
          grad.addColorStop(0.85, `rgba(6, 182, 212, ${flashAlpha * 0.3})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(centerX, centerY, Math.max(1, flashRadius), 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Shockwave Rings
        if (bangElapsed < 2.5) {
          for (let r = 1; r <= 3; r++) {
            const ringRadius = (bangElapsed * (width * 0.85)) / r;
            const ringAlpha = Math.max(0, 1 - bangElapsed / 2.5) * (0.9 / r);
            ctx.strokeStyle = r === 1 ? '#ffffff' : r === 2 ? '#ffd700' : '#ec4899';
            ctx.lineWidth = 6 / r;
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.arc(centerX, centerY, Math.max(1, ringRadius), 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // 4. Flying Embers & Cosmic Dust Particles
        blastParticles.forEach((p) => {
          if (p.alpha <= 0) return;

          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        ctx.restore(); // Restore screen shake

        // Trigger Reveal Phase after Big Bang blast peak (at 12.8s)
        if (elapsed > 12.8 && phase !== 'REVEAL') {
          setPhase('REVEAL');
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [phase]);

  const handleEnterWorld = () => {
    setWaveRippleActive(true);
    setIsLeaving(true);
    setTimeout(() => {
      onComplete();
    }, 1100);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black text-white overflow-hidden transition-opacity duration-1000 ${isLeaving && !waveRippleActive ? 'opacity-0' : 'opacity-100'}`}>
      {/* Dynamic Laser & Big Bang Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

      {/* Multi-Directional Wave Ripples when User Clicks Welcome Button */}
      <AnimatePresence>
        {waveRippleActive && (
          <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 14, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="w-48 h-48 rounded-full border-8 border-orange-400 bg-gradient-to-tr from-orange-500/40 via-amber-400/30 to-pink-500/40 blur-sm"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 18, opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.15 }}
              className="w-48 h-48 rounded-full border-8 border-cyan-400 bg-gradient-to-tr from-cyan-500/30 via-emerald-400/20 to-purple-500/30 blur-md"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Skip Intro Button */}
      {showSkip && phase !== 'REVEAL' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          onClick={handleEnterWorld}
          className="absolute top-6 right-6 z-30 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 hover:text-white text-xs font-sans tracking-widest uppercase transition-all cursor-pointer backdrop-blur-md"
        >
          Skip Intro
        </motion.button>
      )}

      {/* Phase: TFC Logo & Welcome Message Reveal */}
      <AnimatePresence>
        {phase === 'REVEAL' && (
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center">
            
            {/* TFC Logo Emblem */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.3, type: 'spring', stiffness: 90, damping: 14 }}
              className="relative mb-8"
            >
              {/* Outer Aura Halo Glow */}
              <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-orange-500/40 via-pink-500/30 to-amber-300/40 blur-3xl animate-pulse" />

              {/* TFC Crest Shield */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-black/90 border-2 border-orange-400/60 shadow-2xl flex flex-col items-center justify-center backdrop-blur-2xl group overflow-hidden p-2">
                <img 
                  src={tfcLogoImg} 
                  alt="TFC - The Future Civilisation" 
                  className="w-full h-full object-contain rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-2 text-center">
                <span className="font-serif text-sm font-bold tracking-widest text-amber-200 block">TFC</span>
                <span className="text-[10px] font-sans text-white/70 tracking-widest uppercase">The Future Civilisation</span>
              </div>
            </motion.div>

            {/* Welcome Title */}
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="space-y-3 max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-200 text-xs font-sans tracking-widest uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                <span>The Invisible Experience</span>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-orange-200 font-normal leading-tight tracking-wide">
                Welcome to Prince's Life Story
              </h1>

              <p className="font-sans text-xs md:text-sm text-white/75 max-w-md mx-auto leading-relaxed">
                Created exclusively for Anvii — an unfiltered 11-Act journey through truth, code, memories, and unspoken words.
              </p>
            </motion.div>

            {/* Interactive Welcome Button with Multi-Directional Wave Ripples */}
            <motion.div
              initial={{ y: 35, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.9 }}
              className="mt-10 relative"
            >
              {/* Continuous Wave Rings Around Button */}
              <div className="absolute -inset-4 rounded-full border border-orange-500/40 animate-ping opacity-40 pointer-events-none" />
              <div className="absolute -inset-8 rounded-full border border-pink-500/30 animate-ping opacity-25 pointer-events-none delay-300" />
              <div className="absolute -inset-12 rounded-full border border-cyan-500/20 animate-ping opacity-20 pointer-events-none delay-700" />

              {/* Main Welcome Button */}
              <button
                onClick={handleEnterWorld}
                className="relative z-10 group flex items-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-sans text-sm tracking-widest font-bold shadow-2xl hover:shadow-orange-500/60 border border-white/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>ENTER PRINCE'S WORLD</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </button>
            </motion.div>

            {/* Bottom Subtle Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.1 }}
              className="absolute bottom-6 font-sans text-[11px] text-white/50 tracking-widest uppercase"
            >
              Anvii's Personal Portal • 11-Act Autobiography
            </motion.p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
