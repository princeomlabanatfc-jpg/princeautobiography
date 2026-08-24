import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PREPARATION_CONDITIONS } from '../data/content';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface PreparationRitualProps {
  onComplete: () => void;
}

export const PreparationRitual: React.FC<PreparationRitualProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCondition = PREPARATION_CONDITIONS[currentIndex];
  const isLast = currentIndex === PREPARATION_CONDITIONS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div 
      id="preparation-ritual-screen"
      className="min-h-screen w-full flex flex-col items-center justify-center relative px-6 py-12 bg-[#0a0a0c] text-[#e8e6e3] overflow-hidden"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-orange-500/10 rounded-full blur-[130px] pointer-events-none" />
      
      {/* Indicator dots */}
      <div className="absolute top-20 flex items-center gap-2 opacity-70 z-10">
        {PREPARATION_CONDITIONS.map((cond, i) => (
          <div
            key={cond.id}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentIndex ? 'w-8 bg-orange-200' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="max-w-xl w-full z-10 text-center min-h-[380px] flex flex-col justify-between items-center p-8 md:p-12 bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 my-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-orange-200 text-xs tracking-widest uppercase mb-2 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-orange-200" />
              <span>Before You Step Ahead</span>
            </div>

            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-white font-light leading-relaxed tracking-wide">
              "{currentCondition.text}"
            </p>

            {currentCondition.subtext && (
              <p className="font-sans text-sm md:text-base text-white/70 font-normal leading-relaxed max-w-md mx-auto pt-2 italic">
                {currentCondition.subtext}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pt-8">
          <button
            onClick={handleNext}
            id={`prep-step-btn-${currentIndex}`}
            className="btn-primary-gradient inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-white font-sans text-xs tracking-widest uppercase font-semibold shadow-xl hover:shadow-orange-500/30 transition-all cursor-pointer group"
            style={{
              backgroundColor: '#ea580c',
              backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #f43f5e 100%)',
            }}
          >
            <span>{isLast ? "I Am Ready To Cross" : "Take Time To Absorb"}</span>
            <ArrowRight className="w-4 h-4 text-orange-100 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
