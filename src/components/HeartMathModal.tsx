import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, 
  Download, Heart, Music, Sliders, Layers, RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

import imgCouplePhoto from '../assets/images/couplephoto.png';
import imgAnviiPhoto from '../assets/images/anviiphoto.png';
import imgPrincePhoto from '../assets/images/princephoto.jpeg';

interface HeartMathModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaletteMode = 'RAINBOW' | 'GOLDEN' | 'NEON_COSMIC';

interface FlowerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
}

interface AmbientHeartParticle {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  alpha: number;
  color: string;
}

export const HeartMathModal: React.FC<HeartMathModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('RAINBOW');
  const [rayCount, setRayCount] = useState<number>(216);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(0.25);
  const [showPhoto, setShowPhoto] = useState<boolean>(true);
  const [showBouncingText, setShowBouncingText] = useState<boolean>(true);
  const [progress, setProgress] = useState(0); // 0 to 1 sweep
  const [isComplete, setIsComplete] = useState(false);

  // Loaded image ref for couple photo
  const coupleImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imgCouplePhoto;
    img.onload = () => {
      coupleImageRef.current = img;
    };
  }, []);

  // Audio Context ref for synthesizer chimes
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Interactive flower particles triggered by tap/click
  const particlesRef = useRef<FlowerParticle[]>([]);
  const ambientHeartsRef = useRef<AmbientHeartParticle[]>([]);

  // Function to play a melodic chime tone per ray drawn
  const playRayChime = (index: number, total: number) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }

      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Pentatonic/Romantic frequency scale
      const baseFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
      const freq = baseFreqs[index % baseFreqs.length] * (1 + Math.floor(index / baseFreqs.length) * 0.25);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {
      // Audio fallback silent
    }
  };

  // Helper to draw a starburst flower node at (x, y)
  const drawFlowerStar = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    radius: number, 
    color: string, 
    rotation: number = 0
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    const petals = 8;
    ctx.beginPath();
    for (let i = 0; i < petals * 2; i++) {
      const r = i % 2 === 0 ? radius : radius * 0.35;
      const angle = (i * Math.PI) / petals;
      const px = r * Math.cos(angle);
      const py = r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fill();

    // Center bright white core dot
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ffffff';
    ctx.fill();

    ctx.restore();
  };

  // Helper to draw floating ambient hearts
  const drawHeartShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // Main Canvas Render Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Parametric Heart Point Calculation
    // Mathematical Cardioid Heart:
    // x(t) = 16 sin^3(t)
    // y(t) = 13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t)
    const getHeartPoint = (t: number, scale: number, cx: number, cy: number) => {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      // Invert Y because canvas Y increases downwards
      return {
        x: cx + x * scale,
        y: cy - y * scale
      };
    };

    let localProgress = 0;
    let time = 0;
    let lastRayIndex = -1;

    const render = () => {
      time += 0.02;

      // Clear dark background with subtle radial gradient
      const bgGlow = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) * 0.7);
      bgGlow.addColorStop(0, '#0f0814');
      bgGlow.addColorStop(0.5, '#08040d');
      bgGlow.addColorStop(1, '#020104');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Render Ambient Floating Background Hearts
      ambientHeartsRef.current.forEach((h) => {
        h.y += h.vy;
        h.x += h.vx;
        if (h.y < -20) {
          h.y = height + 20;
          h.x = Math.random() * width;
        }
        drawHeartShape(ctx, h.x, h.y, h.size, h.color, h.alpha * (0.6 + 0.4 * Math.sin(time * 2 + h.x)));
      });

      // Heart center and scale dimensions
      const minDim = Math.min(width, height);
      const scale = (minDim * 0.022);
      const cx = width / 2;
      const cy = height / 2 + scale * 2; // Offset slightly down for visual balance

      // Origin point for radial lines (center of upper heart cleft)
      const originX = cx;
      const originY = cy - scale * 4;

      // Update progress if playing
      if (isPlaying) {
        if (localProgress < 1) {
          localProgress += 0.006 * speedMultiplier;
          if (localProgress >= 1) {
            localProgress = 1;
            setIsComplete(true);
          }
          setProgress(localProgress);
        }
      }

      // Calculate how many rays are currently drawn
      const visibleRays = Math.floor(localProgress * rayCount);

      // Play chime audio trigger when a new ray appears
      if (visibleRays > lastRayIndex && isPlaying && localProgress < 1) {
        playRayChime(visibleRays, rayCount);
        lastRayIndex = visibleRays;
      }

      // Pulsating heartbeat scale effect when fully completed
      const pulseScale = localProgress >= 1 ? 1 + 0.04 * Math.sin(time * 3.5) : 1;
      const effectiveScale = scale * pulseScale;

      // DRAW BOUNCING "ANVII ❤️ PRINCE" / "ANVII" BACKGROUND TYPOGRAPHY
      if (showBouncingText && localProgress > 0.15) {
        const bounceAmplitude = 18;
        const bounceSpeed = 2.8;
        const bounceY = Math.sin(time * bounceSpeed) * bounceAmplitude;
        const bounceOpacity = Math.min(1, (localProgress - 0.15) * 1.5);

        ctx.save();
        ctx.globalAlpha = bounceOpacity * 0.35;
        ctx.font = 'bold 88px "Playfair Display", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Glowing gradient text fill
        const textGrad = ctx.createLinearGradient(cx - 200, cy - 180 + bounceY, cx + 200, cy - 180 + bounceY);
        textGrad.addColorStop(0, '#ff4081');
        textGrad.addColorStop(0.5, '#ffd700');
        textGrad.addColorStop(1, '#ff80ab');

        ctx.fillStyle = textGrad;
        ctx.shadowColor = '#ff4081';
        ctx.shadowBlur = 30;
        ctx.fillText('ANVII ❤️ PRINCE', cx, cy - scale * 8 + bounceY);

        ctx.font = 'italic 24px "Playfair Display", serif';
        ctx.fillStyle = '#ffe0b2';
        ctx.shadowBlur = 15;
        ctx.fillText('Forever & Always', cx, cy - scale * 8 + bounceY + 55);

        ctx.restore();
      }

      // DRAW COUPLE PHOTO INSIDE/BEHIND THE HEART SHAPE
      if (showPhoto && coupleImageRef.current && localProgress > 0.2) {
        const photoAlpha = Math.min(0.85, (localProgress - 0.2) * 1.2);
        
        ctx.save();
        ctx.globalAlpha = photoAlpha;

        // Create Heart Clip Path
        ctx.beginPath();
        for (let step = 0; step <= 100; step++) {
          const t = (step / 100) * Math.PI * 2;
          const pt = getHeartPoint(t, effectiveScale * 0.92, cx, cy);
          if (step === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        ctx.clip();

        // Draw couple photo scaled inside clipped heart
        const img = coupleImageRef.current;
        const imgAspect = img.width / img.height;
        const boxSize = effectiveScale * 32;
        let drawW = boxSize;
        let drawH = boxSize / imgAspect;
        if (drawH < boxSize) {
          drawH = boxSize;
          drawW = boxSize * imgAspect;
        }

        ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);

        // Soft romantic radial overlay on top of photo
        const overlayGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, boxSize / 1.5);
        overlayGrad.addColorStop(0, 'rgba(255, 64, 129, 0.15)');
        overlayGrad.addColorStop(1, 'rgba(10, 5, 20, 0.6)');
        ctx.fillStyle = overlayGrad;
        ctx.fillRect(cx - boxSize, cy - boxSize, boxSize * 2, boxSize * 2);

        ctx.restore();
      }

      // Pre-calculate ray points around parametric t range [-PI to PI]
      const rayPoints: { x: number; y: number; angle: number; color: string }[] = [];

      for (let i = 0; i < rayCount; i++) {
        const fraction = i / rayCount;
        const t = fraction * Math.PI * 2;
        const pt = getHeartPoint(t, effectiveScale, cx, cy);

        let color = '#ff4081';
        if (paletteMode === 'RAINBOW') {
          const hue = (fraction * 360) % 360;
          color = `hsl(${hue}, 95%, 65%)`;
        } else if (paletteMode === 'GOLDEN') {
          const hue = 25 + fraction * 35;
          color = `hsl(${hue}, 100%, ${60 + Math.sin(t) * 15}%)`;
        } else if (paletteMode === 'NEON_COSMIC') {
          const hue = 180 + fraction * 140;
          color = `hsl(${hue}, 100%, 65%)`;
        }

        rayPoints.push({
          x: pt.x,
          y: pt.y,
          angle: t,
          color
        });
      }

      // Draw Radial Rays from Origin to Heart Perimeter
      for (let i = 0; i < visibleRays; i++) {
        const ray = rayPoints[i];

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(ray.x, ray.y);
        ctx.strokeStyle = ray.color;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = ray.color;
        ctx.shadowBlur = 10;
        ctx.stroke();

        // Draw flower starburst node at line endpoint
        const flowerRadius = 8 + Math.sin(time * 4 + i) * 1.8;
        drawFlowerStar(ctx, ray.x, ray.y, flowerRadius, ray.color, time * 0.8 + i);
      }

      // Draw Origin Central Glowing Starburst Node
      if (visibleRays > 0) {
        drawFlowerStar(ctx, originX, originY, 11, '#ffffff', -time);
      }

      // Render Interactive Tap/Click Flower Fireworks Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.vRot;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        drawFlowerStar(ctx, p.x, p.y, p.size, p.color, p.rotation);
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, isPlaying, paletteMode, rayCount, speedMultiplier, soundEnabled]);

  // Click handler to trigger flower fireworks on canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Spawn 14 flower particle burst in heart arrangement
    const count = 16;
    const newParticles: FlowerParticle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      const hue = (i / count) * 360;

      newParticles.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 6 + 5,
        color: `hsl(${hue}, 100%, 70%)`,
        alpha: 1,
        decay: 0.018 + Math.random() * 0.015,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.1
      });
    }

    particlesRef.current.push(...newParticles);

    // Play a splash chime
    if (soundEnabled) {
      playRayChime(Math.floor(Math.random() * 10), 10);
    }
  };

  // Replay animation from 0
  const handleReplay = () => {
    setProgress(0);
    setIsComplete(false);
    setIsPlaying(true);
  };

  // Download snapshot of heart art
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'anvii-prince-heart-math.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-3xl overflow-hidden select-none"
      >
        {/* Top Header Bar */}
        <div className="w-full max-w-7xl px-4 sm:px-8 py-4 flex items-center justify-between z-20 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-lg">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-100 flex items-center gap-2">
                Cardioid Flower Heart Math
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-sans font-medium border border-pink-400/30">
                  Anvii & Prince Edition
                </span>
              </h2>
              <p className="text-xs text-white/50 font-sans">
                Sweeping flower rays, real couple photo reveal & bouncing ANVII typography
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-sans transition-all border border-white/15 cursor-pointer"
              title="Download Snapshot Image"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Image</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/15"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Side Couple Avatars */}
        <div className="absolute top-20 left-6 z-30 hidden lg:flex flex-col items-center gap-2 bg-black/40 p-2.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-pink-400 p-0.5 bg-black">
            <img src={imgAnviiPhoto} alt="Anvii" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="text-[10px] font-bold text-pink-300 tracking-wider">ANVII</span>
        </div>

        <div className="absolute top-20 right-6 z-30 hidden lg:flex flex-col items-center gap-2 bg-black/40 p-2.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 bg-black">
            <img src={imgPrincePhoto} alt="Prince" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="text-[10px] font-bold text-amber-300 tracking-wider">PRINCE</span>
        </div>

        {/* Center Canvas Stage */}
        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-pointer"
            title="Click anywhere to trigger flower fireworks!"
          />

          {/* Hint Overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-center">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs backdrop-blur-md border border-white/10 font-sans">
              ✨ Tap anywhere on canvas to launch flower fireworks!
            </span>
          </div>
        </div>

        {/* Bottom Floating Control Panel */}
        <div className="w-full max-w-5xl px-4 sm:px-8 py-3.5 z-20 border-t border-white/10 bg-black/60 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-full bg-amber-400 text-black hover:bg-amber-300 font-bold transition-all shadow-lg cursor-pointer"
              title={isPlaying ? 'Pause Sweep' : 'Play Sweep'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
            </button>

            <button
              onClick={handleReplay}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/15"
              title="Replay Sweep Animation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-full transition-all cursor-pointer border ${
                soundEnabled 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400/40' 
                  : 'bg-white/10 text-white/40 border-white/10'
              }`}
              title={soundEnabled ? 'Sound Chimes On' : 'Sound Chimes Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Feature Toggles (Couple Photo & Bouncing Text) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPhoto(!showPhoto)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                showPhoto 
                  ? 'bg-pink-500/20 text-pink-300 border-pink-400/40' 
                  : 'bg-white/5 text-white/40 border-white/10'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Couple Photo</span>
            </button>

            <button
              onClick={() => setShowBouncingText(!showBouncingText)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                showBouncingText 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' 
                  : 'bg-white/5 text-white/40 border-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bouncing ANVII Text</span>
            </button>
          </div>

          {/* Color Palette Selector */}
          <div className="flex items-center gap-1.5 bg-neutral-900/80 p-1 rounded-full border border-white/15 text-xs">
            <button
              onClick={() => setPaletteMode('RAINBOW')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                paletteMode === 'RAINBOW'
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🌈 Video Rainbow
            </button>

            <button
              onClick={() => setPaletteMode('GOLDEN')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                paletteMode === 'GOLDEN'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🌅 Golden Sunset
            </button>

            <button
              onClick={() => setPaletteMode('NEON_COSMIC')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                paletteMode === 'NEON_COSMIC'
                  ? 'bg-indigo-500 text-white font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🌌 Cosmic Neon
            </button>
          </div>

          {/* Ray Density & Speed Options */}
          <div className="flex items-center gap-4 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Rays:</span>
              <select
                value={rayCount}
                onChange={(e) => setRayCount(Number(e.target.value))}
                className="bg-neutral-900 border border-white/20 text-amber-200 px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value={48}>48 Rays</option>
                <option value={72}>72 Rays</option>
                <option value={120}>120 Rays</option>
                <option value={180}>180 Rays</option>
                <option value={216}>216 Rays (Default)</option>
                <option value={250}>250 Rays (Dense)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Speed:</span>
              <select
                value={speedMultiplier}
                onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
                className="bg-neutral-900 border border-white/20 text-amber-200 px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value={0.25}>0.25x Ultra Slow (Default)</option>
                <option value={0.5}>0.5x Slow</option>
                <option value={1}>1x Normal</option>
                <option value={2}>2x Fast</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
