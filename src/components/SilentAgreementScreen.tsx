import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, CheckCircle2, Lock, Heart, 
  BookOpen, Eye, Monitor, VolumeX, Compass, Users, ArrowRight,
  RotateCcw, Check, Feather, ShieldAlert
} from 'lucide-react';

interface SilentAgreementScreenProps {
  onAgree: () => void;
}

interface PromiseItem {
  id: number;
  text: string;
  icon: React.ElementType;
}

const PROMISES: PromiseItem[] = [
  {
    id: 1,
    text: "Read this alone, in a quiet place.",
    icon: VolumeX
  },
  {
    id: 2,
    text: "Keep everything here private. This story belongs only to us.",
    icon: Lock
  },
  {
    id: 3,
    text: "Leave behind the version of me you've already imagined. Let these pages introduce me again.",
    icon: RefreshCwIcon
  },
  {
    id: 4,
    text: "Don't judge any chapter before reaching the end. Every answer comes later.",
    icon: Compass
  },
  {
    id: 5,
    text: "Don't just read the words—try to understand the person behind them.",
    icon: Heart
  },
  {
    id: 6,
    text: "Follow the journey in order. Don't skip ahead.",
    icon: BookOpen
  },
  {
    id: 7,
    text: "This is not a proposal asking for \"yes\" or \"no.\" I only hope you'll understand me.",
    icon: Feather
  },
  {
    id: 8,
    text: "While reading, imagine we're simply two best friends having the longest conversation we've never had.",
    icon: Users
  },
  {
    id: 9,
    text: "Please read this on a laptop or desktop for the complete experience.",
    icon: Monitor
  }
];

function RefreshCwIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
      <path d="M3 21v-5h5"/>
    </svg>
  );
}

export const SilentAgreementScreen: React.FC<SilentAgreementScreenProps> = ({ onAgree }) => {
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [confirmStep, setConfirmStep] = useState<number>(0); // 0 = Checklist, 1 = First Confirm, 2 = Second Confirm, 3 = Final Seal

  const isAllChecked = checkedIds.length === PROMISES.length;

  const toggleCheck = (id: number) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter(i => i !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (isAllChecked) {
      setCheckedIds([]);
    } else {
      setCheckedIds(PROMISES.map(p => p.id));
    }
  };

  const handleNextStep = () => {
    if (confirmStep < 3) {
      setConfirmStep(prev => prev + 1);
    } else {
      onAgree();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#08080a] text-[#e8e6e3] flex items-center justify-center p-4 md:p-8 relative overflow-x-hidden select-none">
      {/* Subtle Background Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl my-auto relative z-10 space-y-8"
      >
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-orange-200/90 text-xs font-sans tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-orange-300" />
            <span>A Personal Invitation</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl text-white font-light tracking-tight">
            Before You Enter
          </h1>

          <div className="space-y-1 max-w-xl mx-auto text-white/70 font-sans text-sm md:text-base font-light leading-relaxed">
            <p className="text-orange-100/90 font-serif italic text-base md:text-lg">
              "This is not just a website."
            </p>
            <p>It's the most honest version of me I've ever written.</p>
            <p className="text-white/50 text-xs md:text-sm pt-1">
              Before entering, I ask for only a few promises.
            </p>
          </div>
        </div>

        {/* Main Content Box */}
        <div className="p-6 md:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl space-y-8 relative overflow-hidden">
          
          {/* Section Subhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="font-serif text-xl md:text-2xl text-white font-medium flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                <span>Our Silent Agreement</span>
              </h2>
              <p className="text-xs text-white/50 font-sans mt-0.5">
                Click each promise to seal your agreement ({checkedIds.length} of {PROMISES.length} checked)
              </p>
            </div>

            <button
              onClick={handleSelectAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-sans transition-all cursor-pointer self-start sm:self-auto"
            >
              <Check className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAllChecked ? "Uncheck All" : "Pledge All 9 Promises"}</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-rose-400"
              initial={{ width: 0 }}
              animate={{ width: `${(checkedIds.length / PROMISES.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* 9 Promises Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROMISES.map((item) => {
              const isChecked = checkedIds.includes(item.id);
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 rounded-2xl border text-xs md:text-sm font-sans transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                    isChecked
                      ? 'bg-amber-500/10 border-amber-400/40 text-amber-100 shadow-lg shadow-amber-500/5'
                      : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked 
                      ? 'bg-amber-400 border-amber-300 text-black' 
                      : 'border-white/30 bg-black/40'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-white/90">
                      <Icon className={`w-3.5 h-3.5 ${isChecked ? 'text-amber-300' : 'text-white/40'}`} />
                      <span className={isChecked ? 'text-amber-200' : 'text-white/80'}>Promise {item.id}</span>
                    </div>
                    <p className="leading-relaxed font-light">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Trigger / Modal Step Trigger */}
          <div className="pt-4 border-t border-white/10 flex flex-col items-center gap-4 text-center">
            {!isAllChecked && (
              <p className="text-xs text-amber-200/70 font-sans italic flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Please check all 9 promises above to unlock the confirmation seals.</span>
              </p>
            )}

            <button
              onClick={() => setConfirmStep(1)}
              disabled={!isAllChecked}
              className={`w-full max-w-md py-4 px-8 rounded-2xl font-sans text-sm tracking-wider uppercase font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer ${
                isAllChecked
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <span>Begin Confirmation Seals (1 of 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Seals Modal Sequence (Confirm 2-3 Times Ritual) */}
      <AnimatePresence>
        {confirmStep > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg p-8 md:p-10 rounded-3xl bg-[#0d0d11] border border-amber-500/30 shadow-2xl shadow-amber-500/10 space-y-8 text-center relative overflow-hidden"
            >
              {/* Subtle top bar indicating confirmation step */}
              <div className="flex justify-center gap-2">
                <div className={`h-1.5 rounded-full transition-all ${confirmStep >= 1 ? 'w-10 bg-amber-400' : 'w-4 bg-white/10'}`} />
                <div className={`h-1.5 rounded-full transition-all ${confirmStep >= 2 ? 'w-10 bg-amber-400' : 'w-4 bg-white/10'}`} />
                <div className={`h-1.5 rounded-full transition-all ${confirmStep >= 3 ? 'w-10 bg-amber-400' : 'w-4 bg-white/10'}`} />
              </div>

              {/* Step 1: Confirmation 1 */}
              {confirmStep === 1 && (
                <div className="space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <VolumeX className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-sans uppercase tracking-widest text-amber-300">
                      First Confirmation Seal (1/3)
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-white font-light">
                      A Quiet Room & Peaceful Mind
                    </h3>
                    <p className="text-xs md:text-sm text-white/70 font-sans leading-relaxed max-w-sm mx-auto">
                      "Are you in a quiet space, ready to read without rush, distractions, or external opinions?"
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setConfirmStep(0)}
                      className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 text-xs font-sans cursor-pointer"
                    >
                      Review Promises
                    </button>
                    <button
                      onClick={() => setConfirmStep(2)}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-sans uppercase tracking-wider font-semibold cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      Yes, I Am Alone & Ready →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Confirmation 2 */}
              {confirmStep === 2 && (
                <div className="space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <Lock className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-sans uppercase tracking-widest text-amber-300">
                      Second Confirmation Seal (2/3)
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-white font-light">
                      A Sacred Compact of Privacy
                    </h3>
                    <p className="text-xs md:text-sm text-white/70 font-sans leading-relaxed max-w-sm mx-auto">
                      "Do you promise that everything written within these 11 Acts stays strictly between us, protected with total trust?"
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setConfirmStep(1)}
                      className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 text-xs font-sans cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setConfirmStep(3)}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-sans uppercase tracking-wider font-semibold cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      I Pledge Absolute Privacy →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Final Seal & Welcome */}
              {confirmStep === 3 && (
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400/20 via-orange-400/20 to-rose-400/20 border border-amber-300/40 p-1 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#0d0d11] flex items-center justify-center text-amber-200">
                      <Sparkles className="w-9 h-9 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-sans uppercase tracking-widest text-amber-300 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30">
                      Final Seal (3/3)
                    </span>
                    
                    <h3 className="font-serif text-2xl md:text-3xl text-white font-light italic leading-snug pt-2">
                      "If you can make these promises, then... welcome to my world."
                    </h3>
                  </div>

                  <div className="pt-4 flex flex-col items-center gap-3">
                    <button
                      onClick={onAgree}
                      className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-sans text-sm tracking-widest uppercase font-bold shadow-2xl shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3"
                    >
                      <span>[ I Promise ] → Enter</span>
                    </button>

                    <button
                      onClick={() => setConfirmStep(0)}
                      className="text-xs text-white/40 hover:text-white/70 font-sans cursor-pointer transition-colors"
                    >
                      Cancel & Return to Checklist
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
