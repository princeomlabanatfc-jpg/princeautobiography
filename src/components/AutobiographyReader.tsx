import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_ACTS } from '../data/allActs';
import { ActData, BeatData, Stage } from '../types';
import { InteractiveQuestionsView } from './InteractiveQuestionsView';
import { 
  BookOpen, Search, Bookmark, ChevronLeft, ChevronRight, 
  Sparkles, Quote, Share2, Volume2, VolumeX, Menu, X, 
  Heart, Compass, Eye, Shield, Feather, Check, ArrowUpRight,
  Maximize2, Image as ImageIcon, ZoomIn, ZoomOut
} from 'lucide-react';
import journalPageImg from '../assets/images/JournalPage.jpeg';
import dailyTasksImg from '../assets/images/DailyTasks.jpeg';
import olqImg from '../assets/images/olq.jpeg';

const IMAGE_ASSET_MAP: Record<string, string> = {
  'JournalPage.jpeg': journalPageImg,
  'DailyTasks.jpeg': dailyTasksImg,
  'olq.jpeg': olqImg,
};

const resolveImageUrl = (url: string): string => {
  return IMAGE_ASSET_MAP[url] || url;
};

interface AutobiographyReaderProps {
  onStageChange?: (stage: Stage) => void;
  initialActIndex?: number;
  onModalToggle?: (isOpen: boolean) => void;
}

export const AutobiographyReader: React.FC<AutobiographyReaderProps> = ({
  onStageChange,
  initialActIndex = 0,
  onModalToggle,
}) => {
  const [currentActIdx, setCurrentActIdx] = useState<number>(() => {
    const saved = localStorage.getItem('anvii_prince_current_act');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < ALL_ACTS.length) {
        return parsed;
      }
    }
    return initialActIndex;
  });

  const [currentBeatIdx, setCurrentBeatIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const currentAct: ActData = ALL_ACTS[currentActIdx] || ALL_ACTS[0];
  const currentBeat: BeatData = currentAct.beats[currentBeatIdx] || currentAct.beats[0];

  useEffect(() => {
    onModalToggle?.(isSearchOpen || isDrawerOpen || selectedImageIdx !== null);
  }, [isSearchOpen, isDrawerOpen, selectedImageIdx, onModalToggle]);

  // Keyboard navigation for full-screen image lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIdx === null || !currentBeat.images) return;
      if (e.key === 'Escape') {
        setSelectedImageIdx(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIdx((prev) => (prev !== null && prev < currentBeat.images!.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : currentBeat.images!.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIdx, currentBeat.images]);
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Save progress
  useEffect(() => {
    localStorage.setItem('anvii_prince_current_act', currentActIdx.toString());
  }, [currentActIdx]);

  // Scroll listener for reading progress
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current || document.documentElement;
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight > 0) {
        const progress = (el.scrollTop / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentActIdx, currentBeatIdx]);

  // Handle Act switch
  const handleSelectAct = (idx: number) => {
    setCurrentActIdx(idx);
    setCurrentBeatIdx(0);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Beat switch
  const handleSelectBeat = (beatIdx: number) => {
    setCurrentBeatIdx(beatIdx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle next / prev beat navigation
  const handleNextBeat = () => {
    if (currentBeatIdx < currentAct.beats.length - 1) {
      setCurrentBeatIdx(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentActIdx < ALL_ACTS.length - 1) {
      setCurrentActIdx(prev => prev + 1);
      setCurrentBeatIdx(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onStageChange) {
      onStageChange('MOMENTS');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevBeat = () => {
    if (currentBeatIdx > 0) {
      setCurrentBeatIdx(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentActIdx > 0) {
      setCurrentActIdx(prev => prev - 1);
      const prevAct = ALL_ACTS[currentActIdx - 1];
      setCurrentBeatIdx(prevAct.beats.length - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Clean markdown for speech with phonetic smoothing for natural speech
  const cleanTextForSpeech = (text: string) => {
    let cleaned = text
      .replace(/[\*\#\_\-\~\`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    cleaned = cleaned
      .replace(/\bAnvii\b/gi, 'Anvi')
      .replace(/\bmain\b/gi, 'me')
      .replace(/\bmai\b/gi, 'me')
      .replace(/\baap\b/gi, 'ap')
      .replace(/\baapko\b/gi, 'apko')
      .replace(/\baapne\b/gi, 'apne')
      .replace(/\baur\b/gi, 'or')
      .replace(/\bbohot\b/gi, 'bohut')
      .replace(/\bhoon\b/gi, 'hun')
      .replace(/\bbaare\b/gi, 'bare')
      .replace(/\bjaanti\b/gi, 'janti')
      .replace(/\bjaanta\b/gi, 'janta')
      .replace(/\bsamajhti\b/gi, 'samjhti')
      .replace(/\bkaise\b/gi, 'kayse')
      .replace(/\bwaise\b/gi, 'wayse');

    return cleaned;
  };

  // Speech Synth text-to-speech option with natural voice
  const toggleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const clean = cleanTextForSpeech(text);
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.rate = 0.95;
        utterance.pitch = 1.22;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          v => v.name.includes('Maisie') || v.name.includes('Emily')
        ) || voices.find(
          v => v.lang.includes('en-GB') || v.lang.includes('en-IE')
        ) || voices.find(
          v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Zira') || v.name.includes('Female'))
        ) || voices.find(v => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  // Copy quote to clipboard
  const copyQuoteToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuote(text);
    setTimeout(() => setCopiedQuote(null), 2500);
  };

  // Search filter results across all 11 acts
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { actIdx: number; beatIdx: number; actTitle: string; beatTitle: string; snippet: string }[] = [];

    ALL_ACTS.forEach((act, aIdx) => {
      act.beats.forEach((beat, bIdx) => {
        const matchTitle = beat.title.toLowerCase().includes(q);
        const matchParagraph = beat.paragraphs.find(p => p.toLowerCase().includes(q));
        const matchQuote = beat.quote?.text.toLowerCase().includes(q);

        if (matchTitle || matchParagraph || matchQuote) {
          const snippet = matchParagraph || beat.quote?.text || beat.title;
          results.push({
            actIdx: aIdx,
            beatIdx: bIdx,
            actTitle: `${act.kicker}: ${act.title}`,
            beatTitle: beat.numberLabel,
            snippet: snippet.length > 120 ? snippet.slice(0, 120) + '...' : snippet
          });
        }
      });
    });

    return results;
  }, [searchQuery]);

  return (
    <div className="min-h-screen w-full relative bg-transparent text-[#e8e6e3] font-sans overflow-x-hidden pt-20 pb-28">
      {/* Reading Progress Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400 transition-all duration-300"
          style={{ width: `${((currentActIdx + 1) / ALL_ACTS.length) * 100}%` }}
        />
      </div>

      {/* Reader Floating Navigation Toolbar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl shadow-2xl flex items-center gap-3 md:gap-6 text-xs font-sans tracking-wide">
        {/* Act Switcher Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          id="reader-act-drawer-toggle"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-orange-200 transition-all cursor-pointer focus:outline-none"
        >
          <Menu className="w-3.5 h-3.5" />
          <span className="font-serif italic font-medium">{currentAct.kicker}</span>
        </button>

        <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />

        {/* Current Beat Badge */}
        <span className="text-white/70 hidden sm:inline-block max-w-[140px] truncate">
          Beat {currentBeatIdx + 1} of {currentAct.beats.length}
        </span>

        {/* Search Modal Toggle */}
        <button
          onClick={() => setIsSearchOpen(true)}
          id="reader-search-modal-toggle"
          className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer focus:outline-none"
          title="Search Autobiography"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Previous / Next Beat Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevBeat}
            disabled={currentActIdx === 0 && currentBeatIdx === 0}
            id="reader-prev-beat-btn"
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer focus:outline-none"
            title="Previous Chapter"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextBeat}
            id="reader-next-beat-btn"
            className="p-1.5 rounded-full hover:bg-white/10 text-orange-200 transition-all cursor-pointer focus:outline-none"
            title="Next Chapter"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 space-y-12">
        
        {/* Interactive Constellation Node Map */}
        <div className="p-4 md:p-6 rounded-3xl bg-white/[0.03] border border-white/12 backdrop-blur-xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-sans tracking-widest text-orange-200 uppercase font-semibold">
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-orange-200 animate-spin-slow" />
              <span>The {ALL_ACTS.length} Acts Constellation Map</span>
            </span>
            <span className="text-white/50 lowercase font-normal">Act {currentActIdx + 1} of {ALL_ACTS.length} Active</span>
          </div>

          {/* Node Stars Container */}
          <div className="relative py-4 px-2 flex items-center justify-between overflow-x-auto scrollbar-none">
            {/* Connecting Orbit Line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-orange-500/20 via-amber-400/40 to-orange-500/20 z-0" />

            {ALL_ACTS.map((act, idx) => {
              const isActive = idx === currentActIdx;
              const isPassed = idx < currentActIdx;

              return (
                <button
                  key={act.actId}
                  onClick={() => handleSelectAct(idx)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer px-2 transition-all"
                  title={`${act.kicker}: ${act.title}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-xs font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-white scale-125 shadow-lg shadow-orange-500/50 ring-4 ring-orange-400/30'
                        : isPassed
                        ? 'bg-orange-200/20 border border-orange-200/50 text-orange-200'
                        : 'bg-black/60 border border-white/20 text-white/50 hover:text-white hover:border-white/40'
                    }`}
                  >
                    {act.actId}
                  </div>

                  <span className={`text-[10px] font-sans tracking-wider uppercase mt-2 whitespace-nowrap transition-colors ${
                    isActive ? 'text-orange-200 font-semibold' : 'text-white/40 group-hover:text-white/80'
                  }`}>
                    Act {act.actId}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {currentAct.actId === 'IX' ? (
          <InteractiveQuestionsView
            act={currentAct}
            activeBeatIndex={currentBeatIdx}
            onSelectBeat={handleSelectBeat}
            onNextBeat={handleNextBeat}
            onPrevBeat={handlePrevBeat}
          />
        ) : (
          <>
            {/* Act Header Banner */}
        <motion.div
          key={currentAct.actId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 pt-6 pb-10 border-b border-white/10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-orange-200 text-xs tracking-widest uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-200" />
            <span>{currentAct.kicker} — Autobiography of Prince</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-white/95 font-light tracking-wide leading-tight">
            {currentAct.title}
          </h1>

          {currentAct.teaserText && (
            <p className="font-serif text-lg md:text-xl text-orange-200/90 italic max-w-2xl mx-auto font-light pt-2">
              "{currentAct.teaserText}"
            </p>
          )}

          {/* Beat Selection Pills inside current Act */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {currentAct.beats.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => handleSelectBeat(idx)}
                id={`beat-pill-btn-${b.id}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                  idx === currentBeatIdx
                    ? 'bg-orange-200/20 text-orange-200 border border-orange-200/50 shadow-md backdrop-blur-md font-medium'
                    : 'bg-white/[0.03] text-white/50 hover:text-white/80 hover:bg-white/[0.08] border border-white/10'
                }`}
              >
                {b.numberLabel.split(' — ')[0] || `0${idx + 1}`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Current Beat Content */}
        <AnimatePresence mode="wait">
          <motion.article
            key={currentBeat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            {/* Volume I Prologue Card on Act I Beat 1 */}
            {currentActIdx === 0 && currentBeatIdx === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent border border-white/15 backdrop-blur-2xl space-y-6 shadow-2xl mb-12 text-center"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-200/10 border border-orange-200/30 text-orange-200 text-xs font-sans tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Volume I</span>
                </div>

                <h2 className="font-serif text-3xl md:text-5xl text-white font-light tracking-wide italic">
                  A life, honestly told
                </h2>

                <div className="space-y-4 max-w-2xl mx-auto font-sans text-sm md:text-base text-white/85 leading-relaxed text-left font-light pt-2">
                  <p className="font-serif text-lg text-orange-200/90 italic text-center">
                    "There's a version of me people see. And one they don't. This is the one they don't."
                  </p>
                  <p className="text-center font-medium text-white">
                    My name is Prince.
                  </p>
                  <p>
                    This isn't a portfolio of achievements, a list of dreams, or an attempt to prove that I'm different. It's simply the most honest version of my life that I've ever been able to put into words.
                  </p>
                  <p>
                    Most people know me only through a few conversations, a few moments, or a few assumptions. That's enough to recognize someone — but not enough to truly understand them.
                  </p>
                  <p>
                    Every decision, every mistake, every silence, every ambition, and every emotion has a reason behind it. From the outside, those reasons are invisible.
                  </p>
                  <p>
                    This website exists because I believe that if someone is important enough to become a meaningful part of my life, then they deserve more than scattered memories or incomplete impressions. They deserve to know the whole picture — the strengths I'm proud of, the weaknesses I'm still working on, the dreams that drive me, the failures that shaped me, and the thoughts that usually remain inside my own mind.
                  </p>
                  <p>
                    Inside these pages, you'll find my victories, my failures, my dreams, my fears, my mistakes, my growth, and the thoughts I've never been able to explain properly.
                  </p>
                  <div className="pl-4 border-l-2 border-orange-200/40 space-y-1 italic text-white/90 my-2">
                    <p>Some parts may make me look strong.</p>
                    <p>Some parts may make me look immature.</p>
                    <p>Some parts may even make me look wrong.</p>
                  </div>
                  <p>
                    I chose not to hide any of them. Because an incomplete truth creates an incomplete person.
                  </p>
                  <p>
                    I don't expect everyone to agree with my decisions. I only hope they're understood in the context in which they were made.
                  </p>
                  <p className="pt-2 text-orange-200 font-serif italic text-base text-center">
                    So before this journey begins... Thank you for giving your time to understand a version of me that almost nobody has ever seen.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Beat Heading Card */}
            <div className="space-y-4">
              <span className="text-xs font-sans tracking-widest text-orange-200/90 uppercase block font-medium">
                {currentBeat.numberLabel}
              </span>
              <h2 className="font-serif text-2xl md:text-4xl text-white/95 font-normal leading-relaxed">
                {currentBeat.title}
              </h2>
            </div>

            {/* Paragraphs Stream */}
            <div className="space-y-6 font-sans text-base md:text-lg text-white/85 leading-relaxed tracking-wide">
              {currentBeat.paragraphs.map((para, pIdx) => {
                const isEmphasized = currentBeat.emphasisParagraphs?.includes(pIdx);

                return (
                  <p
                    key={pIdx}
                    className={`transition-all duration-300 ${
                      isEmphasized
                        ? 'font-serif text-xl md:text-2xl text-orange-200/90 italic font-light my-8 px-6 py-4 border-l-2 border-orange-300/80 bg-white/[0.02] rounded-r-2xl backdrop-blur-md'
                        : 'text-white/80 hover:text-white/95'
                    }`}
                  >
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Attached Handwritten Artifacts & Notebook Gallery */}
            {currentBeat.images && currentBeat.images.length > 0 && (
              <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-transparent border border-amber-400/35 backdrop-blur-xl shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-400/20 pb-4 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg md:text-xl text-amber-100 font-medium">
                        Original Notebook Pages & Artifacts
                      </h3>
                      <p className="text-xs text-amber-200/70 font-sans">
                        Tap any handwritten page to view in full screen
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-center text-xs font-mono px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300">
                    {currentBeat.images.length} Pages Attached
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {currentBeat.images.map((img, imgIdx) => (
                    <motion.div
                      key={imgIdx}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setSelectedImageIdx(imgIdx); setIsZoomed(false); }}
                      className="group relative bg-[#0f0e13]/80 border border-amber-400/30 hover:border-amber-400/70 rounded-2xl overflow-hidden cursor-pointer shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-black/70 flex items-center justify-center p-1">
                        <img
                          src={resolveImageUrl(img.url)}
                          alt={img.title}
                          className="w-full h-full object-contain sm:object-cover sm:object-top group-hover:scale-105 transition-transform duration-500 rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute top-3 right-3 p-2 rounded-full bg-black/70 border border-white/20 text-white/90 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-md">
                          <Maximize2 className="w-4 h-4 text-amber-300" />
                        </div>
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between bg-[#121018]">
                        <h4 className="font-serif text-xs md:text-sm text-amber-200 font-medium line-clamp-1">
                          {img.title}
                        </h4>
                        {img.description && (
                          <p className="text-[11px] text-white/60 font-sans line-clamp-2 mt-1">
                            {img.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Quote Card if present */}
            {currentBeat.quote && (
              <div className="my-12 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-white/10 group-hover:text-white/20 transition-colors">
                  <Quote className="w-12 h-12" />
                </div>

                <div className="space-y-4 relative z-10">
                  <p className="font-serif text-xl md:text-2xl text-orange-200/95 font-light leading-relaxed italic">
                    {currentBeat.quote.text}
                  </p>
                  {currentBeat.quote.author && (
                    <p className="font-sans text-xs md:text-sm text-white/50 tracking-wider text-right uppercase">
                      {currentBeat.quote.author}
                    </p>
                  )}

                  {/* Copy Quote Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => copyQuoteToClipboard(currentBeat.quote!.text)}
                      id={`copy-quote-btn-${currentBeat.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white/80 transition-all cursor-pointer focus:outline-none"
                    >
                      {copiedQuote === currentBeat.quote.text ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5 text-orange-200" />
                          <span>Hold This Thought</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Navigation for Beat */}
            <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handlePrevBeat}
                disabled={currentActIdx === 0 && currentBeatIdx === 0}
                id="beat-nav-bottom-prev"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs uppercase tracking-widest"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Beat</span>
              </button>

              <button
                onClick={handleNextBeat}
                id="beat-nav-bottom-next"
                className="btn-primary-gradient w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white transition-all cursor-pointer text-xs uppercase tracking-widest font-semibold shadow-xl hover:shadow-orange-500/30"
                style={{
                  backgroundColor: '#ea580c',
                  backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #f43f5e 100%)',
                }}
              >
                <span>
                  {currentBeatIdx < currentAct.beats.length - 1
                    ? "Next Beat"
                    : currentActIdx < ALL_ACTS.length - 1
                    ? `Begin ${ALL_ACTS[currentActIdx + 1].kicker}`
                    : "Journey Complete"}
                </span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.article>
        </AnimatePresence>
        </>
        )}
      </div>

      {/* Act Drawer Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md h-full bg-[#0d0d0f] border-l border-white/10 p-6 md:p-8 overflow-y-auto flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2 text-orange-200 font-serif italic text-lg">
                    <BookOpen className="w-5 h-5" />
                    <span>The {ALL_ACTS.length} Acts of Prince</span>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    id="close-act-drawer-btn"
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Act List */}
                <div className="space-y-3">
                  {ALL_ACTS.map((act, aIdx) => {
                    const isCurrent = aIdx === currentActIdx;
                    return (
                      <button
                        key={act.actId}
                        onClick={() => handleSelectAct(aIdx)}
                        id={`act-drawer-item-${act.actId}`}
                        className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isCurrent
                            ? 'bg-orange-200/15 border-orange-200/50 text-white shadow-lg'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06] text-white/70'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-sans tracking-widest text-orange-200 uppercase block font-semibold">
                            {act.kicker}
                          </span>
                          <h4 className="font-serif text-base font-light text-white/95">
                            {act.title}
                          </h4>
                          <span className="text-[11px] font-sans text-white/40 block">
                            {act.beats.length} Beats
                          </span>
                        </div>

                        {isCurrent && (
                          <div className="w-2 h-2 rounded-full bg-orange-200 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-center text-xs font-sans text-white/40 italic">
                Created with sincerity for Anvii by Prince
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#121215] border border-white/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-orange-200 font-serif italic text-lg">
                  <Search className="w-5 h-5" />
                  <span>Search across all 11 Acts</span>
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  id="close-search-modal-btn"
                  className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type any word, memory, or topic (e.g. Anvii, hostel, JEE, promise, city)..."
                  className="w-full px-5 py-3.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:border-orange-200/60 transition-colors shadow-inner"
                  autoFocus
                />
              </div>

              {/* Search results list */}
              <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                {searchQuery.trim() === '' ? (
                  <p className="text-xs font-sans text-white/40 text-center py-8 italic">
                    Type to instantly search through every act, beat, and quote of the autobiography.
                  </p>
                ) : searchResults.length === 0 ? (
                  <p className="text-xs font-sans text-white/40 text-center py-8 italic">
                    No results found for "{searchQuery}". Try a different keyword.
                  </p>
                ) : (
                  searchResults.map((res, rIdx) => (
                    <button
                      key={rIdx}
                      onClick={() => {
                        setCurrentActIdx(res.actIdx);
                        setCurrentBeatIdx(res.beatIdx);
                        setIsSearchOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      id={`search-result-btn-${rIdx}`}
                      className="w-full text-left p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-200/40 hover:bg-white/[0.08] transition-all cursor-pointer space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-sans tracking-widest text-orange-200 uppercase font-medium">
                          {res.actTitle}
                        </span>
                        <span className="text-[10px] font-sans text-white/40 group-hover:text-orange-200 transition-colors">
                          Jump to Beat →
                        </span>
                      </div>
                      <h5 className="font-serif text-sm font-medium text-white">
                        {res.beatTitle}
                      </h5>
                      <p className="font-sans text-xs text-white/60 line-clamp-2 italic">
                        "{res.snippet}"
                      </p>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-Screen Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIdx !== null && currentBeat.images && currentBeat.images[selectedImageIdx] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative w-full max-w-6xl h-[94vh] flex flex-col items-center justify-between bg-[#0b0a0e] border border-amber-500/40 rounded-3xl p-3 sm:p-5 shadow-[0_0_80px_rgba(251,191,36,0.25)] overflow-hidden"
            >
              {/* Header Toolbar */}
              <div className="w-full flex items-center justify-between z-30 pb-2 border-b border-white/10 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-serif text-amber-300 font-medium truncate max-w-[200px] sm:max-w-md">
                    {currentBeat.images[selectedImageIdx].title}
                  </span>
                  <span className="text-[11px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                    {selectedImageIdx + 1} / {currentBeat.images.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Zoom Toggle Button */}
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-mono transition-all cursor-pointer"
                    title={isZoomed ? "Reset zoom" : "Zoom in to read handwriting"}
                  >
                    {isZoomed ? (
                      <>
                        <ZoomOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Fit Window</span>
                      </>
                    ) : (
                      <>
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Zoom 100%</span>
                      </>
                    )}
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => { setSelectedImageIdx(null); setIsZoomed(false); }}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer shadow-lg"
                    title="Close full screen (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Prev / Next Arrows */}
              {currentBeat.images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      setIsZoomed(false);
                      setSelectedImageIdx((prev) =>
                        prev !== null && prev > 0 ? prev - 1 : currentBeat.images!.length - 1
                      );
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-xl"
                    title="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  <button
                    onClick={() => {
                      setIsZoomed(false);
                      setSelectedImageIdx((prev) =>
                        prev !== null && prev < currentBeat.images!.length - 1 ? prev + 1 : 0
                      );
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-xl"
                    title="Next image"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              {/* Fullscreen Image Container - Full display without vertical cropping */}
              <div 
                className={`relative w-full flex-1 flex items-center justify-center overflow-auto my-1 p-2 min-h-0 ${
                  isZoomed ? 'cursor-zoom-out items-start justify-start' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={resolveImageUrl(currentBeat.images[selectedImageIdx].url)}
                  alt={currentBeat.images[selectedImageIdx].title}
                  className={`transition-all duration-300 rounded-xl shadow-2xl border border-white/10 ${
                    isZoomed 
                      ? 'max-w-none w-auto min-w-[120%] sm:min-w-[140%] object-none' 
                      : 'max-h-[76vh] sm:max-h-[80vh] max-w-full w-auto h-auto object-contain'
                  }`}
                />
              </div>

              {/* Image Footer Caption */}
              <div className="w-full text-center space-y-1 pt-2 border-t border-white/10 z-30">
                {currentBeat.images[selectedImageIdx].description && (
                  <p className="text-xs sm:text-sm text-white/80 max-w-3xl mx-auto font-sans font-light px-4">
                    {currentBeat.images[selectedImageIdx].description}
                  </p>
                )}
                <span className="block text-[10px] text-amber-300/80 font-mono">
                  {isZoomed ? 'Click image or button to fit window' : 'Click image to zoom in'} • Press ESC to exit
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
