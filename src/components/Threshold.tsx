import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, ArrowRight } from 'lucide-react';

interface ThresholdProps {
  onEnter: () => void;
}

export const Threshold: React.FC<ThresholdProps> = ({ onEnter }) => {
  const [isCrossed, setIsCrossed] = useState(false);

  const handleCrossThreshold = () => {
    setIsCrossed(true);
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  return (
    <div 
      id="threshold-screen"
      className="min-h-screen w-full flex flex-col items-center justify-center relative px-6 py-12 bg-[#0a0a0c] text-[#e8e6e3] overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-orange-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-2xl w-full z-10 text-center space-y-8 p-8 md:p-12 bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-orange-200/90 text-xs font-sans tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-orange-200" />
            <span>The Space Between Silence & Truth</span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl text-white font-light leading-tight">
            Stepping Past <span className="text-orange-200 italic">Surfaces</span>
          </h2>

          <p className="font-sans text-sm md:text-base text-white/80 leading-relaxed max-w-lg mx-auto">
            For years, my thoughts stayed inside — from my early days in Ahmedabad to quiet hostel nights. Crossing this threshold means leaving behind rumors, blocks, and surface assumptions to discover the real motives behind my growth, my mission (TFC), and my connection with you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="pt-4"
        >
          <button
            onClick={handleCrossThreshold}
            disabled={isCrossed}
            id="threshold-cross-doorway-btn"
            className={`btn-primary-gradient group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-sans text-xs tracking-widest uppercase font-semibold shadow-xl transition-all cursor-pointer ${
              isCrossed ? 'opacity-50 cursor-wait' : ''
            }`}
            style={{
              backgroundColor: '#ea580c',
              backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #f43f5e 100%)',
            }}
          >
            <Compass className="w-4 h-4 text-orange-100 group-hover:rotate-45 transition-transform duration-700" />
            <span>{isCrossed ? "Opening the Conversation..." : "Cross Into the Unspoken Story"}</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <p className="font-sans text-xs text-white/40 italic pt-2">
          "Because an incomplete truth creates an incomplete person." — Prince
        </p>
      </div>
    </div>
  );
};
