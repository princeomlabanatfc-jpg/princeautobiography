import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

interface EntryExperienceProps {
  onContinue: () => void;
}

export const EntryExperience: React.FC<EntryExperienceProps> = ({ onContinue }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 2500);
    const t3 = setTimeout(() => setStep(3), 4800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div 
      id="entry-experience-screen" 
      className="min-h-screen w-full flex flex-col items-center justify-center relative px-6 py-16 overflow-hidden bg-[#0a0a0c] text-[#e8e6e3]"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto text-center z-10 space-y-8 pt-20 pb-12">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-orange-200/90 text-xs font-sans tracking-widest uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-orange-200" />
          <span>A Life, Honestly Told</span>
        </div>

        {/* Main Headlines */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white font-light leading-tight tracking-wide">
                There's a version of me people see.
              </h1>
              <p className="font-serif text-2xl md:text-4xl text-orange-200/90 italic font-light">
                And one they don't.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Statement */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 max-w-2xl mx-auto text-sm md:text-base font-sans text-white/80 leading-relaxed font-light"
            >
              <p className="font-serif text-xl md:text-2xl text-white/95 italic">
                "This is the one they don't."
              </p>
              <p>
                My name is Prince. This isn't a portfolio of achievements, a list of dreams, or an attempt to prove that I'm different. It's simply the most honest version of my life that I've ever been able to put into words.
              </p>
              <p className="text-white/60 italic text-xs md:text-sm">
                "Thank you for giving your time to understand a version of me that almost nobody has ever seen."
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enter Button */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0 }}
              className="pt-6"
            >
              <button
                onClick={onContinue}
                id="entry-step-inside-btn"
                className="btn-primary-gradient inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-sans text-xs tracking-widest uppercase font-semibold shadow-2xl hover:shadow-orange-500/40 transition-all cursor-pointer group"
                style={{
                  backgroundColor: '#ea580c',
                  backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #f43f5e 100%)',
                }}
              >
                <BookOpen className="w-4 h-4 text-orange-100" />
                <span>Begin Reading the 11 Acts</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 text-center text-[10px] font-sans text-white/30 tracking-widest uppercase px-4 w-full pointer-events-none">
        Handcrafted with sincerity for Anvii by Prince
      </div>
    </div>
  );
};
