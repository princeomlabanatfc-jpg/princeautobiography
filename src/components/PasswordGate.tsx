import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, KeyRound, Sparkles, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PasswordGateProps {
  onUnlock: () => void;
  onViewRules?: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock, onViewRules }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Prince@2027TFC') {
      setError(false);
      setIsSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 800);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0a0c] text-[#e8e6e3] overflow-hidden select-none">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 md:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl space-y-8 relative z-10 text-center"
      >
        {/* Lock Icon Emblem */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400/20 via-amber-300/10 to-rose-400/20 border border-orange-200/30 flex items-center justify-center text-orange-200 shadow-lg">
          {isSuccess ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
          ) : (
            <Lock className="w-7 h-7 text-orange-200" />
          )}
        </div>

        {/* Title & Private Notice */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-orange-200/90 text-xs font-sans tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-orange-200" />
            <span>Personal & Private</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-white font-light tracking-wide">
            Private
          </h1>

          <p className="font-sans text-xs md:text-sm text-white/70 leading-relaxed max-w-xs mx-auto italic">
            "This one's private. You need a password to see any of it — if you don't have it, ask Prince directly. That's the only way in."
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Enter password..."
              id="password-gate-input"
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/50 border text-white placeholder-white/30 font-sans text-sm focus:outline-none transition-all ${
                error
                  ? 'border-rose-500/80 bg-rose-950/20 text-rose-200'
                  : 'border-white/15 focus:border-orange-200/60'
              }`}
              autoFocus
            />
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-xs font-sans text-rose-400 flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Incorrect password. Ask Prince directly for access.</span>
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            id="password-gate-submit-btn"
            className="btn-ai-gradient w-full py-3.5 px-6 rounded-2xl text-white font-sans text-xs tracking-widest uppercase font-semibold shadow-xl hover:shadow-orange-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 group"
            style={{
              backgroundColor: '#ea580c',
              backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
            }}
          >
            <span>Unlock Experience</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-2 flex flex-col items-center gap-2 text-[11px] font-sans text-white/40">
          {onViewRules && (
            <button
              type="button"
              onClick={onViewRules}
              className="text-amber-300/80 hover:text-amber-200 underline underline-offset-4 cursor-pointer transition-colors"
            >
              Review Our Silent Agreement Promises
            </button>
          )}
          <span className="italic opacity-60">Authored by Prince</span>
        </div>
      </motion.div>
    </div>
  );
};
