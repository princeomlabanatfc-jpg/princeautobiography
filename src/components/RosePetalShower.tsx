import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Flower, Volume2, X, RefreshCw, Key, Compass } from 'lucide-react';

interface RosePetalShowerProps {
  isActive: boolean;
  onClose: () => void;
  onTriggerShower: () => void;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  edgeColor: string;
  swing: number;
  swingSpeed: number;
  isSparkle?: boolean;
}

const SECRET_WHISPERS = [
  "In every universe, my soul would still find yours.",
  "You do not need to try to impress anyone; your natural light is already breathtaking.",
  "Prince's heart is safest when thinking of Anvii.",
  "You are the quiet poetry in a noisy world.",
  "Every rose in this sanctuary was planted with thoughts of you.",
  "If love were time, you would be eternity.",
  "Your presence feels like warm tea on a winter dusk."
];

const ROSE_COLORS = [
  { main: '#f43f5e', edge: '#ffe4e6' }, // rose-500 + bright highlight
  { main: '#e11d48', edge: '#fecdd3' }, // rose-600
  { main: '#ff2a5f', edge: '#ffffff' }, // glowing hot magenta rose
  { main: '#fb7185', edge: '#fff1f2' }, // rose-400
  { main: '#be123c', edge: '#fda4af' }, // deep velvet red
  { main: '#f472b6', edge: '#fdf2f8' }, // soft blush pink
];

export const RosePetalShower: React.FC<RosePetalShowerProps> = ({
  isActive,
  onClose,
  onTriggerShower,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedWhisper, setSelectedWhisper] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [showSanctuaryModal, setShowSanctuaryModal] = useState<boolean>(true);

  // Keyboard Easter Egg Listener ("ANVII" or "PRINCE")
  useEffect(() => {
    let keyBuffer: string[] = [];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      keyBuffer.push(e.key.toUpperCase());
      if (keyBuffer.length > 10) keyBuffer.shift();

      const typed = keyBuffer.join('');
      if (typed.includes('ANVII') || typed.includes('PRINCE')) {
        setShowSanctuaryModal(true);
        onTriggerShower();
        keyBuffer = [];
      }

      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'R') {
        setShowSanctuaryModal(true);
        onTriggerShower();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTriggerShower]);

  // Web Audio Romantic Chime Generator
  const playRomanticChime = () => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const freqs = [311.13, 392.00, 466.16, 587.33, 698.46, 783.99];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + idx * 0.15 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.15 + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 2.6);
      });
    } catch (e) {
      // Audio autoplay restrictions
    }
  };

  useEffect(() => {
    if (isActive) {
      playRomanticChime();
      setShowSanctuaryModal(true);
    }
  }, [isActive]);

  // Canvas Petal Physics Loop
  useEffect(() => {
    if (!isActive) return;
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

    // Create 110 Petals + 30 Golden Sparkles
    const petals: Petal[] = Array.from({ length: 130 }, (_, index) => {
      const colorObj = ROSE_COLORS[Math.floor(Math.random() * ROSE_COLORS.length)];
      const isSparkle = index % 5 === 0; // Every 5th particle is a golden sparkle
      return {
        x: Math.random() * width,
        y: Math.random() * height - height * 0.5,
        size: isSparkle ? 3 + Math.random() * 5 : 14 + Math.random() * 22,
        speedY: isSparkle ? 0.8 + Math.random() * 1.5 : 1.2 + Math.random() * 2.5,
        speedX: -1.2 + Math.random() * 2.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        opacity: isSparkle ? 0.7 + Math.random() * 0.3 : 0.75 + Math.random() * 0.25,
        color: isSparkle ? '#fbbf24' : colorObj.main,
        edgeColor: isSparkle ? '#ffffff' : colorObj.edge,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: 0.015 + Math.random() * 0.025,
        isSparkle,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.speedY;
        p.swing += p.swingSpeed;
        p.x += Math.sin(p.swing) * 1.5 + p.speedX * 0.4;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.isSparkle) {
          // Draw Glowing Golden Sparkle Dust
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw Vivid 3D Rose Petal with Gradient & Highlight
          ctx.shadowColor = 'rgba(225, 29, 72, 0.6)';
          ctx.shadowBlur = 12;

          const grad = ctx.createRadialGradient(0, p.size * 0.2, p.size * 0.1, 0, 0, p.size * 1.2);
          grad.addColorStop(0, p.edgeColor);
          grad.addColorStop(0.4, p.color);
          grad.addColorStop(1, '#881337'); // dark rose velvet depth

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.3);
          ctx.bezierCurveTo(-p.size * 0.7, -p.size, -p.size * 1.1, p.size * 0.4, 0, p.size * 1.1);
          ctx.bezierCurveTo(p.size * 1.1, p.size * 0.4, p.size * 0.7, -p.size, 0, -p.size * 0.3);
          ctx.fill();

          // Delicate vein line in center of petal
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.2);
          ctx.quadraticCurveTo(p.size * 0.1, p.size * 0.3, 0, p.size * 0.8);
          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* 3D Falling Rose Petal Canvas (Always visible on top of full screen) */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-50" />

      {/* Floating Control Pill when rain is active but sanctuary modal is minimized */}
      {!showSanctuaryModal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-6 z-50 pointer-events-auto flex items-center gap-2 bg-[#0f0e13]/90 border border-rose-500/50 rounded-full px-4 py-2.5 text-xs text-rose-200 backdrop-blur-md shadow-2xl"
        >
          <Flower className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="font-sans font-medium">Rose Rain Active</span>
          <button
            onClick={() => setShowSanctuaryModal(true)}
            className="ml-1 text-xs text-amber-300 font-medium underline hover:text-amber-200 cursor-pointer"
          >
            Whispers
          </button>
          <button
            onClick={onClose}
            className="ml-1.5 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
            title="Stop Rose Shower"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}

      {/* Secret Rose Sanctuary Overlay Modal */}
      <AnimatePresence>
        {showSanctuaryModal && (
          <div className="relative z-40 w-full h-full flex items-center justify-center p-4 bg-black/40 backdrop-blur-md pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0f0e13]/90 border border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(225,29,72,0.35)] text-center flex flex-col items-center overflow-hidden backdrop-blur-xl"
            >
              {/* Glowing ambient background pulses */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={() => setShowSanctuaryModal(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer z-30"
                title="Close modal and keep roses raining"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon Badge */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500/30 to-amber-500/30 border border-rose-400/50 flex items-center justify-center mb-4 shadow-xl">
                <Flower className="w-8 h-8 text-rose-300 animate-spin" style={{ animationDuration: '20s' }} />
              </div>

              <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 font-mono text-[10px] uppercase tracking-widest font-semibold mb-2">
                🔑 Secret Easter Egg Unlocked
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium mb-3 italic">
                Prince's Rose Sanctuary
              </h2>

              <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed mb-6 max-w-md">
                You unlocked the glowing rose shower! Velvet petals and golden stardust are now raining across your room. Typing <span className="text-rose-300 font-mono font-bold">ANVIP</span> or <span className="text-rose-300 font-mono font-bold">PRINCE</span> anytime will summon this shower!
              </p>

              {/* Interactive Whisper Petals */}
              <div className="w-full p-4 rounded-2xl bg-white/[0.04] border border-rose-500/25 mb-6 text-left">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif text-xs text-rose-200/90 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Tap a Petal to Catch a Secret Whisper:
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {SECRET_WHISPERS.map((whisper, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedWhisper(whisper)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedWhisper === whisper
                          ? 'bg-rose-500/40 border-rose-400/70 text-rose-100 shadow-lg scale-105'
                          : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Flower className="w-3 h-3 text-rose-400" />
                      <span>Whisper #{idx + 1}</span>
                    </button>
                  ))}
                </div>

                {selectedWhisper && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-400/40 text-center shadow-inner"
                  >
                    <p className="font-serif text-xs sm:text-sm text-rose-100 italic">
                      "{selectedWhisper}"
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={playRomanticChime}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-sans font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>Replay Chimes</span>
                </button>
                <button
                  onClick={() => setShowSanctuaryModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-sans font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Let Roses Rain</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
