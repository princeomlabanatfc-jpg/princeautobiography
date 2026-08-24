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

    // 4 Corner starting points with distinct persistent color identities
    const corners = [
      { x: 0, y: 0, color: '#f59e0b', rgb: [245, 158, 11], name: 'Gold' },            // Top-Left Gold
      { x: width, y: 0, color: '#ec4899', rgb: [236, 72, 153], name: 'Pink' },          // Top-Right Pink
      { x: width, y: height, color: '#06b6d4', rgb: [6, 182, 212], name: 'Cyan' },       // Bottom-Right Cyan
      { x: 0, y: height, color: '#10b981', rgb: [16, 185, 129], name: 'Emerald' }     // Bottom-Left Emerald
    ];

    // Helper: interpolate RGB
    const lerpColor = (c1: number[], c2: number[], t: number) => {
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
      return `rgb(${r}, ${g}, ${b})`;
    };

    // 4 Mid-edge beams for Phase 3 collision
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

      // --- PHASE 1 & 2: UNIFIED 4-BEAM CONTINUOUS PHYSICAL TRAJECTORY (1.0s to 9.5s) ---
      // The exact same 4 beams travel from corners -> reach central orbit -> bend tangentially ->
      // orbit individually preserving colors -> overlap & mix into gold -> accelerate -> compress into singularity.
      if (elapsed >= 1.0 && elapsed < 9.5) {
        const initialOrbitRadius = Math.min(width, height) * 0.32;
        const targetGoldRgb = [255, 215, 0]; // Radiant Gold (#ffd700)

        // 1. Calculate continuous angular progress Omega(t) with C1 velocity continuity
        let omega = 0;
        if (elapsed > 4.5) {
          const dt = elapsed - 4.5;
          if (dt <= 2.0) {
            // Stage B & C: 4.5s to 6.5s - Initial orbital rotation (~3.5 rad/s accelerating to ~7 rad/s)
            omega = 3.5 * dt + 0.85 * dt * dt;
          } else if (dt <= 3.1) {
            // Stage D & E: 6.5s to 7.6s - Overlap & Color mixing (~7 rad/s accelerating to ~13 rad/s)
            const dt2 = dt - 2.0;
            const omegaBase = 3.5 * 2.0 + 0.85 * 4.0;
            omega = omegaBase + 6.9 * dt2 + 2.8 * dt2 * dt2;
          } else if (dt <= 3.9) {
            // Stage F & G: 7.6s to 8.4s - Golden integration & acceleration (~13 rad/s accelerating to ~26 rad/s)
            const dt3 = dt - 3.1;
            const omegaBase = 3.5 * 2.0 + 0.85 * 4.0 + 6.9 * 1.1 + 2.8 * 1.21;
            omega = omegaBase + 13.0 * dt3 + 8.5 * dt3 * dt3;
          } else {
            // Stage H: 8.4s to 9.5s - Singularity compression & hyper-spin (accelerating up to ~75 rad/s)
            const dt4 = dt - 3.9;
            const omegaBase = 3.5 * 2.0 + 0.85 * 4.0 + 6.9 * 1.1 + 2.8 * 1.21 + 13.0 * 0.8 + 8.5 * 0.64;
            omega = omegaBase + 26.6 * dt4 + 22.0 * dt4 * dt4;
          }
        }

        // 2. Calculate dynamic orbit radius R(t)
        // Stays at initialOrbitRadius until golden integration, then compresses into singularity point
        let currentRadius = initialOrbitRadius;
        if (elapsed >= 7.6) {
          const compProgress = Math.min((elapsed - 7.6) / 1.9, 1.0); // 0 to 1 over 7.6s - 9.5s
          const easedComp = compProgress * compProgress * (3 - 2 * compProgress); // smoothstep
          currentRadius = initialOrbitRadius * (1 - easedComp * 0.975); // compresses to ~6px
        }

        // 3. Color transition progress (Preserves 100% original colors until 6.5s, then blends to gold by 7.8s)
        let colorBlendFactor = 0;
        if (elapsed >= 6.5) {
          const mixProgress = Math.min((elapsed - 6.5) / 1.3, 1.0);
          colorBlendFactor = mixProgress * mixProgress * (3 - 2 * mixProgress);
        }

        // 4. Glow blur intensity increases smoothly with energy accumulation
        let glowBlur = 18;
        if (elapsed >= 4.5 && elapsed < 6.5) glowBlur = 24;
        else if (elapsed >= 6.5 && elapsed < 7.8) glowBlur = 32;
        else if (elapsed >= 7.8) glowBlur = 40 + Math.sin(elapsed * 20) * 6;

        // Use additive blending so overlapping beam colors physically mix luminous light
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        corners.forEach((c) => {
          ctx.save();

          // Smoothly interpolated beam color (from original -> mixed spectrum -> radiant gold)
          const beamRgbString = lerpColor(c.rgb, targetGoldRgb, colorBlendFactor);
          ctx.strokeStyle = beamRgbString;
          ctx.shadowColor = beamRgbString;
          ctx.shadowBlur = glowBlur;
          ctx.lineWidth = 3.5 + colorBlendFactor * 1.2;

          const initialDist = Math.hypot(centerX - c.x, centerY - c.y);
          const angleFromCenter = Math.atan2(c.y - centerY, c.x - centerX);
          const contactX = centerX + Math.cos(angleFromCenter) * initialOrbitRadius;
          const contactY = centerY + Math.sin(angleFromCenter) * initialOrbitRadius;

          let sparkHeadX = contactX;
          let sparkHeadY = contactY;

          if (elapsed < 4.5) {
            // --- STAGE 1: Corner travel approaching the central orbit contact point ---
            const approachProgress = Math.min((elapsed - 1.0) / 3.5, 1.0);
            const currentDist = initialDist - (initialDist - initialOrbitRadius) * approachProgress;

            ctx.beginPath();
            const steps = 45;
            for (let i = 0; i <= steps; i++) {
              const t = i / steps;
              const d = initialDist - (initialDist - currentDist) * t;
              const px = c.x + (contactX - c.x) * (1 - (d - initialOrbitRadius) / (initialDist - initialOrbitRadius));
              const py = c.y + (contactY - c.y) * (1 - (d - initialOrbitRadius) / (initialDist - initialOrbitRadius));

              // Sine-wave ripple dampens as it nears orbit contact
              const rippleDamp = (1 - t * 0.7) * (1 - approachProgress * 0.4);
              const waveAmp = rippleDamp * 22 * Math.sin(t * Math.PI * 6 - elapsed * 10);
              const perpX = px + Math.cos(angleFromCenter + Math.PI / 2) * waveAmp;
              const perpY = py + Math.sin(angleFromCenter + Math.PI / 2) * waveAmp;

              if (i === 0) ctx.moveTo(perpX, perpY);
              else ctx.lineTo(perpX, perpY);

              if (i === steps) {
                sparkHeadX = perpX;
                sparkHeadY = perpY;
              }
            }
            ctx.stroke();

          } else if (elapsed < 5.4) {
            // --- STAGE A & B: Smooth physical bend & transition into circular orbit ---
            // Head is already orbiting along the circle, while the trail smoothly connects back
            // to the incoming corner trajectory without visual pop or object reset.
            const transitionProgress = (elapsed - 4.5) / 0.9; // 0 to 1
            const headAngle = angleFromCenter + omega;

            sparkHeadX = centerX + Math.cos(headAngle) * currentRadius;
            sparkHeadY = centerY + Math.sin(headAngle) * currentRadius;

            // Render continuous composite path: incoming tail segment + curved bend + orbit arc
            ctx.beginPath();

            // 1. Tail portion along incoming corner ray
            const tailDistFromCenter = initialOrbitRadius + (initialDist - initialOrbitRadius) * (1 - transitionProgress) * 0.7;
            const stepsIncoming = 25;
            for (let i = 0; i <= stepsIncoming; i++) {
              const t = i / stepsIncoming;
              const d = tailDistFromCenter - (tailDistFromCenter - initialOrbitRadius) * t;
              const px = centerX + Math.cos(angleFromCenter) * d;
              const py = centerY + Math.sin(angleFromCenter) * d;

              // Remaining subtle wave ripple on tail
              const waveAmp = (1 - t) * (1 - transitionProgress) * 12 * Math.sin(t * Math.PI * 4 - elapsed * 8);
              const perpX = px + Math.cos(angleFromCenter + Math.PI / 2) * waveAmp;
              const perpY = py + Math.sin(angleFromCenter + Math.PI / 2) * waveAmp;

              if (i === 0) ctx.moveTo(perpX, perpY);
              else ctx.lineTo(perpX, perpY);
            }

            // 2. Circular orbit arc traveled by the head
            const stepsArc = 30;
            for (let i = 1; i <= stepsArc; i++) {
              const t = i / stepsArc;
              const currentAngle = angleFromCenter + omega * t;
              const ax = centerX + Math.cos(currentAngle) * currentRadius;
              const ay = centerY + Math.sin(currentAngle) * currentRadius;
              ctx.lineTo(ax, ay);
            }
            ctx.stroke();

          } else {
            // --- STAGE C through H: Pure individual rotating beam arc on the orbit ---
            // Each of the original 4 beams has its own moving head and dynamic arc span.
            // As speed increases, arc span stretches naturally, causing the 4 beams to overlap.
            const headAngle = angleFromCenter + omega;
            sparkHeadX = centerX + Math.cos(headAngle) * currentRadius;
            sparkHeadY = centerY + Math.sin(headAngle) * currentRadius;

            // Arc span expands as velocity increases, wrapping around the orbit
            const speedFactor = Math.min((elapsed - 5.4) / 3.0, 1.0);
            const arcSpan = (Math.PI * 0.55) + speedFactor * (Math.PI * 1.5); // 100° expanding to 360°+

            ctx.beginPath();
            const steps = 40;
            for (let i = 0; i <= steps; i++) {
              const t = i / steps;
              const a = headAngle - arcSpan * (1 - t);
              const px = centerX + Math.cos(a) * currentRadius;
              const py = centerY + Math.sin(a) * currentRadius;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }

          // --- LEADING SPARK HEAD ---
          // White-hot core with beam's native halo glow
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = beamRgbString;
          ctx.shadowBlur = glowBlur + 8;
          ctx.beginPath();
          const sparkSize = 4.5 + colorBlendFactor * 1.5;
          ctx.arc(sparkHeadX, sparkHeadY, sparkSize, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        // Glowing singularity center beacon building up energy as radius shrinks
        if (elapsed >= 7.6) {
          const coreProgress = (elapsed - 7.6) / 1.9;
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur = 35 + coreProgress * 30;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 3 + coreProgress * 7 + Math.sin(elapsed * 30) * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.restore(); // Restore globalCompositeOperation
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
                className="btn-primary-gradient relative z-10 group flex items-center gap-3 px-9 py-4 rounded-full text-white font-sans text-sm tracking-widest font-bold shadow-2xl hover:shadow-orange-500/60 border border-white/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: '#ea580c',
                  backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #ea580c 100%)',
                }}
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
