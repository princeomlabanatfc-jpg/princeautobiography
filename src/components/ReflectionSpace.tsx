import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ARTHUR_ARON_36_QUESTIONS, ClosenessQuestion } from '../data/content';
import { 
  Sparkles, ArrowRight, Check, Heart, BookOpen, ChevronLeft, 
  ChevronRight, Copy, RotateCcw, Lock, Plus, Send, Stars, Flame, 
  Compass, Eye, Shield, Feather, X, MessageSquare, Sparkle
} from 'lucide-react';

export interface SecretCapsule {
  id: string;
  sender: 'Prince' | 'Anvii';
  title: string;
  color: 'amber' | 'rose' | 'cyan' | 'emerald' | 'gold';
  excerpt: string;
  fullMessage: string;
  date: string;
  hearts: number;
  positionX: number; // percentage
  positionY: number; // percentage
}

const PRESEEDED_SECRET_CAPSULES: SecretCapsule[] = [
  {
    id: 'capsule-1',
    sender: 'Prince',
    title: 'Promise of Absolute Honesty',
    color: 'amber',
    excerpt: 'An unedited life creates true understanding...',
    fullMessage: 'Dear Anvii,\n\nI built this entire website because I promised myself that I would never present an incomplete version of who I am. Whether in strength, weakness, mistakes, or ambitions—my door is completely open to you.\n\n— Prince',
    date: 'Always Active',
    hearts: 28,
    positionX: 18,
    positionY: 25
  },
  {
    id: 'capsule-2',
    sender: 'Prince',
    title: 'Replacing 20+ Blocks With Truth',
    color: 'rose',
    excerpt: 'Silence was never meant to be a wall...',
    fullMessage: 'Over 20+ blocks on messaging apps could have ended everything. But instead of letting silence turn into distance, I put my entire soul into writing these 11 Acts for you.\n\n— Prince',
    date: 'Forever Sealed',
    hearts: 42,
    positionX: 75,
    positionY: 30
  },
  {
    id: 'capsule-3',
    sender: 'Prince',
    title: 'The Future Civilisation Vow (TFC)',
    color: 'gold',
    excerpt: 'Driven by relentless craft and vision...',
    fullMessage: 'Moving to a PG and building TFC line by line taught me that deep work requires solitude. But true achievements mean nothing if there is no one sincere to share the journey with.\n\n— Prince',
    date: 'Everlasting',
    hearts: 19,
    positionX: 45,
    positionY: 65
  },
  {
    id: 'capsule-4',
    sender: 'Prince',
    title: 'A Sacred & Unbroken Bond',
    color: 'cyan',
    excerpt: 'Written for only one person in the world...',
    fullMessage: 'This isn\'t a public portfolio or a social media show. I created this exclusively for you. You will always have a quiet, safe sanctuary here.\n\n— Prince',
    date: 'Present Day',
    hearts: 64,
    positionX: 82,
    positionY: 70
  }
];

interface ReflectionSpaceProps {
  onCompleteReflection: () => void;
  onModalToggle?: (isOpen: boolean) => void;
}

export const ReflectionSpace: React.FC<ReflectionSpaceProps> = ({ onCompleteReflection, onModalToggle }) => {
  // Navigation tabs (36 Questions vs Secret Capsule Wish Wall)
  const [activeTabMode, setActiveTabMode] = useState<'36questions' | 'wishWall'>('36questions');

  // 36 Questions state
  const [activeSet, setActiveSet] = useState<1 | 2 | 3>(1);
  const [questionIndexInSet, setQuestionIndexInSet] = useState(0);
  const [savedNotes, setSavedNotes] = useState<{ [key: number]: string }>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Suggestion #4: Secret Memory Capsules & Wish Wall state
  const [capsules, setCapsules] = useState<SecretCapsule[]>(() => {
    try {
      const saved = localStorage.getItem('anvii_prince_wish_capsules');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed loading capsules', e);
    }
    return PRESEEDED_SECRET_CAPSULES;
  });

  const [selectedCapsule, setSelectedCapsule] = useState<SecretCapsule | null>(null);
  const [isPlantWishOpen, setIsPlantWishOpen] = useState(false);

  useEffect(() => {
    onModalToggle?.(selectedCapsule !== null || isPlantWishOpen);
  }, [selectedCapsule, isPlantWishOpen, onModalToggle]);

  // Plant Wish Form
  const [wishTitle, setWishTitle] = useState('');
  const [wishExcerpt, setWishExcerpt] = useState('');
  const [wishFullMessage, setWishFullMessage] = useState('');
  const [wishColor, setWishColor] = useState<SecretCapsule['color']>('rose');

  // Letter to Prince state
  const [dearPrinceLetter, setDearPrinceLetter] = useState<string>(() => {
    return localStorage.getItem('anvii_dear_prince_letter') || '';
  });
  const [copiedLetter, setCopiedLetter] = useState(false);

  const currentSetQuestions = ARTHUR_ARON_36_QUESTIONS.filter(q => q.set === activeSet);
  const currentQuestion = currentSetQuestions[questionIndexInSet] || currentSetQuestions[0];

  // Load saved notes on mount
  useEffect(() => {
    const loaded: { [key: number]: string } = {};
    ARTHUR_ARON_36_QUESTIONS.forEach(q => {
      const val = localStorage.getItem(`anvii_prince_aron_q_${q.id}`);
      if (val) loaded[q.id] = val;
    });
    setSavedNotes(loaded);
  }, []);

  // Save capsules
  useEffect(() => {
    try {
      localStorage.setItem('anvii_prince_wish_capsules', JSON.stringify(capsules));
    } catch (e) {
      console.warn('Failed saving capsules', e);
    }
  }, [capsules]);

  const handleNoteChange = (qId: number, text: string) => {
    setSavedNotes(prev => ({ ...prev, [qId]: text }));
    localStorage.setItem(`anvii_prince_aron_q_${qId}`, text);
  };

  const handleCopyNote = (qId: number) => {
    const text = savedNotes[qId] || '';
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedId(qId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleNextQuestion = () => {
    if (questionIndexInSet < currentSetQuestions.length - 1) {
      setQuestionIndexInSet(prev => prev + 1);
    } else if (activeSet < 3) {
      setActiveSet((prev) => (prev + 1) as 1 | 2 | 3);
      setQuestionIndexInSet(0);
    } else {
      setActiveTabMode('wishWall');
    }
  };

  const handlePrevQuestion = () => {
    if (questionIndexInSet > 0) {
      setQuestionIndexInSet(prev => prev - 1);
    } else if (activeSet > 1) {
      setActiveSet((prev) => (prev - 1) as 1 | 2 | 3);
      setQuestionIndexInSet(11);
    }
  };

  const handleLetterChange = (text: string) => {
    setDearPrinceLetter(text);
    localStorage.setItem('anvii_dear_prince_letter', text);
  };

  const handleCopyLetter = () => {
    if (dearPrinceLetter.trim()) {
      navigator.clipboard.writeText(dearPrinceLetter);
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2500);
    }
  };

  const handleDownloadLetter = () => {
    if (dearPrinceLetter.trim()) {
      const blob = new Blob([dearPrinceLetter], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Dear_Prince_Reflection.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Plant a new wish capsule
  const handlePlantWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishTitle.trim()) return;

    const posX = Math.floor(Math.random() * 70) + 15; // 15% to 85%
    const posY = Math.floor(Math.random() * 60) + 20; // 20% to 80%

    const newCap: SecretCapsule = {
      id: 'anvii_wish_' + Date.now(),
      sender: 'Anvii',
      title: wishTitle.trim(),
      color: wishColor,
      excerpt: wishExcerpt.trim() || 'A wish planted in the constellation...',
      fullMessage: wishFullMessage.trim() || 'Planted secretly in our constellation wall.',
      date: 'Just Now',
      hearts: 1,
      positionX: posX,
      positionY: posY
    };

    setCapsules([newCap, ...capsules]);
    setIsPlantWishOpen(false);

    // Reset form
    setWishTitle('');
    setWishExcerpt('');
    setWishFullMessage('');
  };

  const handleAddHeartToCapsule = (capId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCapsules(prev => prev.map(c => c.id === capId ? { ...c, hearts: c.hearts + 1 } : c));
  };

  const getColorClasses = (color: SecretCapsule['color']) => {
    switch (color) {
      case 'amber':
        return 'from-amber-400 to-orange-500 shadow-amber-500/50 border-amber-300';
      case 'rose':
        return 'from-rose-400 to-pink-500 shadow-rose-500/50 border-rose-300';
      case 'cyan':
        return 'from-cyan-400 to-blue-500 shadow-cyan-500/50 border-cyan-300';
      case 'emerald':
        return 'from-emerald-400 to-teal-500 shadow-emerald-500/50 border-emerald-300';
      case 'gold':
        return 'from-yellow-300 to-amber-500 shadow-yellow-400/50 border-yellow-200';
      default:
        return 'from-amber-400 to-orange-500 shadow-amber-500/50 border-amber-300';
    }
  };

  return (
    <div 
      id="reflection-space-screen"
      className="min-h-screen w-full flex flex-col items-center justify-between relative px-4 md:px-8 pt-24 pb-20 bg-[#0a0a0c] text-[#e8e6e3] overflow-x-hidden"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl w-full text-center z-10 space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-orange-200 text-xs font-sans tracking-widest uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-orange-200" />
          <span>Deep Reflection & Memory Capsules</span>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl text-white font-light tracking-wide leading-tight">
          Reflection Space & <span className="text-orange-200 italic font-serif">Wish Wall</span>
        </h1>

        <p className="font-sans text-xs md:text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
          Reflect quietly on Arthur Aron's 36 Closeness Questions, or plant secret wish capsules on our constellation sky wall.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTabMode('36questions')}
            className={`px-4 py-2 rounded-full text-xs font-sans font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabMode === '36questions'
                ? 'btn-primary-gradient text-white border border-orange-300/40 shadow-lg'
                : 'bg-white/10 text-white/70 hover:text-white border border-white/15'
            }`}
            style={activeTabMode === '36questions' ? {
              backgroundColor: '#ea580c',
              backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
            } : undefined}
          >
            <Compass className="w-3.5 h-3.5 text-white" />
            <span>36 Closeness Questions</span>
          </button>

          <button
            onClick={() => setActiveTabMode('wishWall')}
            className={`px-4 py-2 rounded-full text-xs font-sans font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabMode === 'wishWall'
                ? 'btn-primary-gradient text-white border border-orange-300/40 shadow-lg'
                : 'bg-white/10 text-white/70 hover:text-white border border-white/15'
            }`}
            style={activeTabMode === 'wishWall' ? {
              backgroundColor: '#ea580c',
              backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
            } : undefined}
          >
            <Stars className="w-3.5 h-3.5 text-white" />
            <span>Constellation Wish Wall ({capsules.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 36 QUESTIONS */}
      {activeTabMode === '36questions' && (
        <>
          {/* Set Tabs */}
          <div className="flex items-center justify-center gap-2 pt-6 z-10">
            <button
              onClick={() => { setActiveSet(1); setQuestionIndexInSet(0); }}
              className={`px-4 py-2 rounded-full text-xs font-sans transition-all cursor-pointer ${
                activeSet === 1
                  ? 'bg-orange-200/20 border border-orange-200/50 text-orange-200 font-medium shadow-lg'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              Set I: Mindset & Perception
            </button>
            <button
              onClick={() => { setActiveSet(2); setQuestionIndexInSet(0); }}
              className={`px-4 py-2 rounded-full text-xs font-sans transition-all cursor-pointer ${
                activeSet === 2
                  ? 'bg-orange-200/20 border border-orange-200/50 text-orange-200 font-medium shadow-lg'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              Set II: Vulnerability & Past
            </button>
            <button
              onClick={() => { setActiveSet(3); setQuestionIndexInSet(0); }}
              className={`px-4 py-2 rounded-full text-xs font-sans transition-all cursor-pointer ${
                activeSet === 3
                  ? 'bg-orange-200/20 border border-orange-200/50 text-orange-200 font-medium shadow-lg'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              Set III: Truth & Connection
            </button>
          </div>

          {/* Main Question Card */}
          <div className="max-w-2xl w-full z-10 my-6 p-6 md:p-10 bg-white/[0.03] border border-white/12 backdrop-blur-2xl rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-sans tracking-widest text-orange-200 uppercase font-semibold">
                Question #{currentQuestion.id} of 36
              </span>

              <div className="flex items-center gap-2 text-xs font-sans text-white/40">
                <Lock className="w-3.5 h-3.5 text-orange-200/70" />
                <span>Private Local Notes</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4 text-center min-h-[160px] flex flex-col justify-center"
              >
                <h2 className="font-serif text-xl md:text-3xl text-white font-light leading-relaxed px-2">
                  "{currentQuestion.question}"
                </h2>

                {currentQuestion.contextNote && (
                  <p className="font-sans text-xs md:text-sm text-white/60 italic max-w-md mx-auto">
                    {currentQuestion.contextNote}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-sans text-white/50 px-1">
                <span>Write your quiet thought (Saved automatically):</span>
                {savedNotes[currentQuestion.id] && (
                  <button
                    onClick={() => handleCopyNote(currentQuestion.id)}
                    className="hover:text-orange-200 inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedId === currentQuestion.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === currentQuestion.id ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>

              <textarea
                value={savedNotes[currentQuestion.id] || ''}
                onChange={(e) => handleNoteChange(currentQuestion.id, e.target.value)}
                placeholder="Type your response or reflections here... (Saved privately on your device)"
                className="w-full h-28 p-4 rounded-2xl bg-black/40 border border-white/15 focus:border-orange-200/60 text-white text-sm placeholder-white/30 font-sans resize-none focus:outline-none transition-colors duration-300 shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={handlePrevQuestion}
                disabled={activeSet === 1 && questionIndexInSet === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-sans text-xs tracking-wider uppercase transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-sans text-white/40">
                {questionIndexInSet + 1} / {currentSetQuestions.length} in Set {activeSet}
              </span>

              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500/80 to-amber-500/80 hover:from-orange-500 hover:to-amber-500 text-white font-sans text-xs tracking-wider uppercase font-medium transition-all cursor-pointer shadow-lg"
              >
                <span>{activeSet === 3 && questionIndexInSet === currentSetQuestions.length - 1 ? "Open Wish Wall" : "Next Question"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: CONSTELLATION SECRET WISH WALL (SUGGESTION #4) */}
      {activeTabMode === 'wishWall' && (
        <div className="max-w-5xl w-full z-10 my-6 space-y-6">
          {/* Interactive Constellation Sky Box */}
          <div className="relative w-full h-[460px] rounded-3xl bg-gradient-to-b from-[#0e0e18] via-[#090912] to-[#050508] border border-white/15 shadow-2xl overflow-hidden flex flex-col justify-between p-6">
            {/* Stars background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Sky Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Stars className="w-5 h-5 text-amber-300 animate-pulse" />
                <h3 className="font-serif text-lg font-bold text-amber-200">
                  Interactive Memory Constellation
                </h3>
              </div>

              <button
                onClick={() => setIsPlantWishOpen(true)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/80 to-amber-500/80 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-medium flex items-center gap-2 shadow-lg cursor-pointer border border-white/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Plant a Secret Wish</span>
              </button>
            </div>

            {/* Interactive Floating Spheres Container */}
            <div className="relative flex-1 w-full my-2">
              {capsules.map((cap) => {
                const colorClass = getColorClasses(cap.color);

                return (
                  <motion.div
                    key={cap.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.15 }}
                    style={{
                      position: 'absolute',
                      left: `${cap.positionX}%`,
                      top: `${cap.positionY}%`
                    }}
                    onClick={() => setSelectedCapsule(cap)}
                    className="cursor-pointer group flex flex-col items-center z-10"
                  >
                    {/* Glowing Star/Sphere */}
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${colorClass} p-1 shadow-lg animate-pulse flex items-center justify-center border`}>
                      <Heart className="w-3.5 h-3.5 fill-white text-white" />
                    </div>

                    {/* Hover Label */}
                    <span className="text-[10px] font-serif text-amber-200 font-medium bg-black/80 px-2 py-0.5 rounded-full border border-white/20 mt-1 opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                      {cap.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Sky Footer Instructions */}
            <div className="relative z-10 flex items-center justify-between text-xs font-sans text-white/50 border-t border-white/10 pt-3">
              <span>Click any glowing capsule above to open secret notes</span>
              <span className="text-amber-200/80 italic font-serif">Planted with sincerity for Anvii</span>
            </div>
          </div>

          {/* Capsule Detail Modal */}
          <AnimatePresence>
            {selectedCapsule && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-lg bg-[#0f0f18] border border-amber-400/30 rounded-3xl p-6 md:p-8 shadow-2xl text-white space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkle className="w-5 h-5 text-amber-300" />
                      <div>
                        <span className="text-[10px] font-mono uppercase text-amber-300">
                          {selectedCapsule.sender} • {selectedCapsule.date}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-amber-200">
                          {selectedCapsule.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCapsule(null)}
                      className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 font-serif text-sm md:text-base leading-relaxed text-amber-100 italic whitespace-pre-wrap">
                    {selectedCapsule.fullMessage}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={(e) => handleAddHeartToCapsule(selectedCapsule.id, e)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-medium cursor-pointer transition-all"
                    >
                      <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                      <span>Send Heart Warmth ({selectedCapsule.hearts})</span>
                    </button>

                    <button
                      onClick={() => setSelectedCapsule(null)}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white/80 cursor-pointer"
                    >
                      Close Capsule
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Plant Wish Form Modal */}
          <AnimatePresence>
            {isPlantWishOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-lg bg-[#11111a] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Stars className="w-5 h-5 text-amber-300" />
                      <h3 className="font-serif text-lg font-bold text-amber-200">Plant a Secret Wish</h3>
                    </div>
                    <button
                      onClick={() => setIsPlantWishOpen(false)}
                      className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handlePlantWish} className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-white/60 mb-1">Wish / Promise Title *</label>
                      <input
                        type="text"
                        required
                        value={wishTitle}
                        onChange={(e) => setWishTitle(e.target.value)}
                        placeholder="e.g. A Promise of Sincerity"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-white/60 mb-1">Star Glow Color</label>
                      <select
                        value={wishColor}
                        onChange={(e) => setWishColor(e.target.value as any)}
                        className="w-full bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
                      >
                        <option value="amber">Amber Gold</option>
                        <option value="rose">Rose Quartz</option>
                        <option value="cyan">Celestial Cyan</option>
                        <option value="emerald">Emerald Hope</option>
                        <option value="gold">Pure Sunlight</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-white/60 mb-1">Short Excerpt (Hover label)</label>
                      <input
                        type="text"
                        value={wishExcerpt}
                        onChange={(e) => setWishExcerpt(e.target.value)}
                        placeholder="One phrase summarizing your wish..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-white/60 mb-1">Full Secret Message / Wish</label>
                      <textarea
                        rows={4}
                        value={wishFullMessage}
                        onChange={(e) => setWishFullMessage(e.target.value)}
                        placeholder="Write your secret wish or note to Prince..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400 font-serif"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsPlantWishOpen(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 text-xs text-white/60 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 text-black font-semibold text-xs cursor-pointer shadow-lg"
                      >
                        Plant Wish Capsule
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Dedicated "Dear Prince" Private Letter Journal Box */}
      <div className="max-w-2xl w-full z-10 my-6 p-6 md:p-8 bg-white/[0.03] border border-white/12 backdrop-blur-xl rounded-3xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-orange-200 fill-orange-200/20" />
            <h3 className="font-serif text-lg text-white font-medium">Dear Prince... (Private Letter Box)</h3>
          </div>
          <span className="text-[11px] font-sans text-white/40">Saved on your device</span>
        </div>

        <p className="text-xs font-sans text-white/60 leading-relaxed">
          If reading these 11 Acts brought up any thoughts, feelings, or words you ever wished to tell Prince, you can compose your private note here. It stays strictly saved on your browser.
        </p>

        <textarea
          value={dearPrinceLetter}
          onChange={(e) => handleLetterChange(e.target.value)}
          placeholder="Dear Prince..."
          className="w-full h-36 p-4 rounded-2xl bg-black/50 border border-white/15 focus:border-orange-200/60 text-white text-sm placeholder-white/30 font-serif leading-relaxed resize-none focus:outline-none transition-colors shadow-inner"
        />

        <div className="flex items-center justify-end gap-3 pt-1">
          {dearPrinceLetter.trim() && (
            <>
              <button
                onClick={handleCopyLetter}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-sans text-white/80 hover:text-white transition-all cursor-pointer"
              >
                {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-orange-200" />}
                <span>{copiedLetter ? "Letter Copied!" : "Copy Letter"}</span>
              </button>

              <button
                onClick={handleDownloadLetter}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/40 text-xs font-sans text-orange-200 font-medium transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Save as Text File</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="max-w-md w-full text-center z-10 pt-2 pb-4">
        <button
          onClick={onCompleteReflection}
          id="reflection-move-farewell-btn"
          className="btn-primary-gradient w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-white font-sans text-xs tracking-widest uppercase font-semibold shadow-2xl hover:shadow-orange-500/40 transition-all cursor-pointer group"
          style={{
            backgroundColor: '#ea580c',
            backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #ea580c 100%)',
          }}
        >
          <span>Move to Final Farewell</span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
