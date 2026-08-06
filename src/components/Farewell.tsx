import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, RotateCcw, Heart } from 'lucide-react';

interface FarewellProps {
  onRestart: () => void;
}

export const Farewell: React.FC<FarewellProps> = ({ onRestart }) => {
  return (
    <div 
      id="farewell-screen"
      className="min-h-screen w-full flex flex-col items-center justify-between relative px-6 py-12 bg-[#0a0a0c] text-[#eae5dc] overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-orange-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Content */}
      <div className="max-w-xl w-full z-10 text-center space-y-8 my-auto p-8 md:p-12 bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center text-orange-200 shadow-lg backdrop-blur-md">
            <Heart className="w-6 h-6 text-orange-200 fill-orange-200/20" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-sans tracking-[0.3em] text-white/50 uppercase block">
              With Deep Gratitude
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-white/95 font-light leading-snug">
              A Final Word <br />
              <span className="text-orange-200 font-serif italic">From Prince</span>
            </h2>
          </div>

          <p className="font-serif text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-md mx-auto pt-2 italic">
            "Thank you for giving your time to understand a version of me that almost nobody has ever seen."
          </p>

          <p className="font-sans text-xs md:text-sm text-white/70 font-normal leading-relaxed max-w-md mx-auto">
            Whether we speak tomorrow or move forward in quiet understanding, I am glad you know the real story now — the strengths I'm proud of, the weaknesses I'm working on, the dreams that drive me, and the thoughts that usually remain inside my own mind.
          </p>

          <div className="pt-6 border-t border-white/10 max-w-xs mx-auto text-center space-y-1">
            <span className="font-serif text-lg text-orange-200 block italic">
              Always with care & sincerity,
            </span>
            <span className="font-sans text-xs tracking-widest text-white/90 uppercase font-semibold block">
              Prince
            </span>
          </div>
        </motion.div>
      </div>

      {/* Footer restart option */}
      <div className="z-10 pt-4 pb-4 text-center">
        <button
          onClick={onRestart}
          id="farewell-restart-btn"
          className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-sans text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer focus:outline-none"
        >
          <RotateCcw className="w-3.5 h-3.5 text-orange-200 group-hover:rotate-180 transition-transform duration-700" />
          <span>Return to the Beginning</span>
        </button>
      </div>
    </div>
  );
};
