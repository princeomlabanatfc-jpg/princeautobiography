import React from 'react';
import { Stage } from '../types';
import { Heart, Play, FileDown } from 'lucide-react';

interface InvisibleHeaderProps {
  currentStage: Stage;
  onSelectStage: (stage: Stage) => void;
  onReplayIntro?: () => void;
  onOpenDownloadPDF?: () => void;
  onOpenLetters?: () => void;
  onOpenQuiz?: () => void;
  onOpenHeartMath?: () => void;
  onOpenReasons?: () => void;
  onTriggerRoseShower?: () => void;
  isHidden?: boolean;
}

const STAGE_LABELS: { key: Stage; label: string }[] = [
  { key: 'ENTRY', label: 'Entry' },
  { key: 'PREPARATION', label: 'Preparation' },
  { key: 'THRESHOLD', label: 'Threshold' },
  { key: 'CONVERSATION', label: 'Conversation' },
  { key: 'AUTOBIOGRAPHY', label: '11 Acts' },
  { key: 'MOMENTS', label: 'Moments' },
  { key: 'REFLECTION', label: 'Reflection' },
  { key: 'FAREWELL', label: 'Farewell' },
];

export const InvisibleHeader: React.FC<InvisibleHeaderProps> = ({
  currentStage,
  onSelectStage,
  onReplayIntro,
  onOpenDownloadPDF,
  isHidden = false
}) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-5 flex items-center justify-between transition-all duration-300 ${
      isHidden ? 'opacity-0 pointer-events-none invisible -translate-y-4' : 'opacity-100 pointer-events-none translate-y-0'
    }`}>
      {/* Brand / Title minimal signature with Frosted Glass */}
      <div className="pointer-events-auto flex items-center gap-2">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-lg">
          <Heart className="w-3.5 h-3.5 fill-orange-200/30 text-orange-200/80" />
          <span className="font-serif text-sm tracking-wide text-white/90 italic">Private Room — Anvii & Prince</span>
        </div>
      </div>

      {/* Subtle stage indicators inside frosted container */}
      <div className="pointer-events-auto hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-lg">
        {STAGE_LABELS.map(({ key, label }) => {
          const isActive = currentStage === key;
          return (
            <button
              key={key}
              onClick={() => onSelectStage(key)}
              id={`nav-stage-btn-${key.toLowerCase()}`}
              className={`px-3 py-1 text-[11px] font-sans tracking-widest uppercase transition-all duration-500 rounded-full cursor-pointer focus:outline-none ${
                isActive
                  ? 'bg-white/10 text-orange-200 font-medium border border-white/20 shadow-inner'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Right Action Buttons */}
      <div className="pointer-events-auto flex items-center gap-2">
        {onOpenDownloadPDF && (
          <button
            onClick={onOpenDownloadPDF}
            id="header-download-pdf-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-orange-200 hover:text-white text-[11px] font-sans tracking-wider font-semibold backdrop-blur-md transition-all cursor-pointer shadow-md"
            title="Download Complete 11 Acts in PDF format"
          >
            <FileDown className="w-3.5 h-3.5 text-orange-300" />
            <span className="hidden sm:inline">11 Acts PDF</span>
          </button>
        )}

        {onReplayIntro && (
          <button
            onClick={onReplayIntro}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-400/30 text-orange-200 text-[11px] font-sans tracking-wider font-medium backdrop-blur-md transition-all cursor-pointer"
            title="Replay Cinematic Intro"
          >
            <Play className="w-3 h-3 text-orange-200 fill-orange-200/40" />
            <span className="hidden sm:inline">Intro</span>
          </button>
        )}
      </div>
    </header>
  );
};

