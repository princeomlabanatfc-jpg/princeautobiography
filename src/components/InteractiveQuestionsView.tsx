import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActData, BeatData } from '../types';
import { 
  Sparkles, Feather, MessageCircle, Heart, Compass, Shield, 
  HelpCircle, CheckCircle2, Edit3, X, Download, Copy, Check,
  BookOpen, Eye, Key, Moon, Sun, Flame, Star, Award, Search,
  ChevronRight, RefreshCw, Send
} from 'lucide-react';

interface InteractiveQuestionsViewProps {
  act: ActData;
  activeBeatIndex: number;
  onSelectBeat: (beatIdx: number) => void;
  onNextBeat: () => void;
  onPrevBeat: () => void;
}

export const InteractiveQuestionsView: React.FC<InteractiveQuestionsViewProps> = ({
  act,
  activeBeatIndex,
  onSelectBeat,
  onNextBeat,
  onPrevBeat,
}) => {
  const currentBeat: BeatData = act.beats[activeBeatIndex] || act.beats[0];

  // Local state for answers
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('anvii_prince_question_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeQuestion, setActiveQuestion] = useState<{ id: string; category: string; text: string } | null>(null);
  const [currentInputText, setCurrentInputText] = useState<string>('');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('anvii_prince_question_answers', JSON.stringify(answers));
    } catch (e) {
      console.error('Failed to save answers to localStorage', e);
    }
  }, [answers]);

  const handleOpenAnswerModal = (qId: string, category: string, text: string) => {
    setActiveQuestion({ id: qId, category, text });
    setCurrentInputText(answers[qId] || '');
  };

  const handleSaveAnswer = () => {
    if (!activeQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: currentInputText.trim()
    }));
    setActiveQuestion(null);
  };

  const handleClearAnswer = () => {
    if (!activeQuestion) return;
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[activeQuestion.id];
      return copy;
    });
    setActiveQuestion(null);
  };

  // Count total questions answered
  const totalQuestionsInAct = act.beats.reduce((acc, beat) => {
    const subCount = beat.subsections?.reduce((sAcc, sub) => sAcc + sub.questions.length, 0) || 0;
    return acc + subCount;
  }, 0);

  const totalAnswered = Object.keys(answers).filter(key => answers[key] && answers[key].length > 0).length;

  // Export answers
  const handleExportAnswers = () => {
    let output = `ACT IX — THE QUESTIONS ONLY YOU CAN ANSWER\n`;
    output += `My Reflections & Answers:\n\n`;

    act.beats.forEach(beat => {
      output += `========================================\n`;
      output += `${beat.numberLabel} — ${beat.title}\n`;
      output += `========================================\n\n`;

      beat.subsections?.forEach(sub => {
        output += `--- ${sub.category} ---\n`;
        sub.questions.forEach((q, idx) => {
          const qId = `${beat.id}-${sub.category}-${idx}`;
          const ans = answers[qId];
          output += `Q: ${q}\n`;
          output += `A: ${ans ? ans : '[Unanswered]'}\n\n`;
        });
      });
    });

    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Anvii_Reflections_Answers.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAnswers = () => {
    let output = `Act IX Answers:\n\n`;
    Object.entries(answers).forEach(([qId, ans]) => {
      if (ans) {
        output += `${qId}:\n${ans}\n\n`;
      }
    });

    navigator.clipboard.writeText(output);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  // Get unique icon based on category
  const getCategoryIcon = (category: string) => {
    if (category.includes('Beginning')) return <Sun className="w-5 h-5 text-amber-400" />;
    if (category.includes('Change')) return <RefreshCw className="w-5 h-5 text-indigo-400" />;
    if (category.includes('Hurt')) return <Flame className="w-5 h-5 text-rose-400" />;
    if (category.includes('Looking')) return <Eye className="w-5 h-5 text-cyan-400" />;
    if (category.includes('Feelings') || category.includes('Love')) return <Heart className="w-5 h-5 text-pink-400" />;
    if (category.includes('Trust')) return <Shield className="w-5 h-5 text-emerald-400" />;
    if (category.includes('Future') || category.includes('Time')) return <Compass className="w-5 h-5 text-purple-400" />;
    if (category.includes('Marriage')) return <Sparkles className="w-5 h-5 text-yellow-400" />;
    return <Key className="w-5 h-5 text-blue-400" />;
  };

  // Get unique styling class based on category
  const getCategoryCardStyle = (catIdx: number, qIdx: number) => {
    const styles = [
      'bg-slate-900/80 border-slate-700/60 hover:border-amber-500/40 shadow-amber-950/10',
      'bg-slate-900/80 border-slate-700/60 hover:border-indigo-500/40 shadow-indigo-950/10',
      'bg-slate-900/80 border-slate-700/60 hover:border-rose-500/40 shadow-rose-950/10',
      'bg-slate-900/80 border-slate-700/60 hover:border-emerald-500/40 shadow-emerald-950/10',
      'bg-slate-900/80 border-slate-700/60 hover:border-pink-500/40 shadow-pink-950/10',
      'bg-slate-900/80 border-slate-700/60 hover:border-cyan-500/40 shadow-cyan-950/10',
      'bg-slate-900/80 border-slate-700/60 hover:border-purple-500/40 shadow-purple-950/10',
    ];
    return styles[(catIdx + qIdx) % styles.length];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-rose-500/30 selection:text-rose-200">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800/80 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-rose-500/10 text-rose-300 border border-rose-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                {act.kicker} — Interactive Reflections
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyAnswers}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 flex items-center gap-1.5 transition-all shadow-sm"
                  title="Copy saved responses"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  {copiedSuccess ? 'Copied!' : 'Copy Responses'}
                </button>
                <button
                  onClick={handleExportAnswers}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-rose-600/80 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-all shadow-sm"
                  title="Download reflections as a text file"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                {act.title}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg font-serif italic max-w-3xl leading-relaxed">
                "{act.pivotText || 'Throughout this journey, I\'ve spoken a lot. But every story has two sides. You\'ve already heard mine. There is still one side I\'ve never truly heard. Yours.'}"
              </p>
            </div>

            {/* Progress bar */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Feather className="w-4 h-4 text-rose-400" />
                <span>Your Saved Answers: <strong className="text-rose-300">{totalAnswered}</strong> / {totalQuestionsInAct}</span>
              </div>

              <div className="w-full sm:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalAnswered / totalQuestionsInAct) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Beats Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {act.beats.map((beat, bIdx) => {
            const isActive = bIdx === activeBeatIndex;
            return (
              <button
                key={beat.id}
                onClick={() => onSelectBeat(bIdx)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border ${
                  isActive 
                    ? 'bg-rose-500/20 text-rose-200 border-rose-500/50 shadow-lg shadow-rose-950/20 backdrop-blur-md' 
                    : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-800/90 flex items-center justify-center text-[10px] font-mono text-slate-300">
                  {bIdx + 1}
                </span>
                <span className="whitespace-nowrap font-serif">{beat.numberLabel.split('—')[1] || beat.numberLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Current Beat Content */}
        <motion.div
          key={currentBeat.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Beat Title & Intro Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 text-xs uppercase tracking-widest font-semibold">
              <Sparkles className="w-4 h-4" />
              {currentBeat.numberLabel}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {currentBeat.title}
            </h2>

            {/* Intro Paragraphs */}
            {currentBeat.paragraphs && currentBeat.paragraphs.length > 0 && (
              <div className="space-y-3 pt-2 text-slate-300 font-sans text-sm sm:text-base leading-relaxed border-t border-slate-800/60">
                {currentBeat.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-slate-300">{p}</p>
                ))}
              </div>
            )}
          </div>

          {/* Subsections & Questions */}
          {currentBeat.subsections && currentBeat.subsections.length > 0 && (
            <div className="space-y-10">
              {currentBeat.subsections.map((sub, catIdx) => (
                <div key={sub.category} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {getCategoryIcon(sub.category)}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                        {sub.category}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {sub.questions.length} reflections in this category
                      </p>
                    </div>
                  </div>

                  {/* Questions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sub.questions.map((qText, qIdx) => {
                      const qId = `${currentBeat.id}-${sub.category}-${qIdx}`;
                      const hasAnswer = Boolean(answers[qId] && answers[qId].trim().length > 0);
                      const answerText = answers[qId];

                      return (
                        <div
                          key={qIdx}
                          className={`group relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${getCategoryCardStyle(catIdx, qIdx)}`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                                #{qIdx + 1}
                              </span>

                              {hasAnswer ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Answered
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-slate-400 bg-slate-950/40 px-2 py-0.5 rounded-full">
                                  Unanswered
                                </span>
                              )}
                            </div>

                            <p className="text-sm sm:text-base font-serif text-slate-100 font-medium leading-snug">
                              {qText}
                            </p>

                            {/* Show saved preview if answered */}
                            {hasAnswer && (
                              <div className="bg-slate-950/70 border border-emerald-900/40 rounded-xl p-3 text-xs text-emerald-200/90 font-sans italic line-clamp-2">
                                "{answerText}"
                              </div>
                            )}
                          </div>

                          <div className="pt-4 mt-2 flex items-center justify-between border-t border-slate-800/40">
                            <span className="text-[11px] text-slate-400 font-mono">
                              {sub.category}
                            </span>

                            <button
                              onClick={() => handleOpenAnswerModal(qId, sub.category, qText)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                hasAnswer 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 shadow-sm'
                              }`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              {hasAnswer ? 'Edit Answer' : 'Answer Question'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ending Paragraphs if present */}
          {currentBeat.endingParagraphs && currentBeat.endingParagraphs.length > 0 && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
              {currentBeat.endingParagraphs.map((ep, epIdx) => (
                <p key={epIdx} className="text-slate-300 text-sm sm:text-base font-serif italic leading-relaxed">
                  {ep}
                </p>
              ))}
            </div>
          )}

          {/* Beat Quote */}
          {currentBeat.quote && (
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-6 text-center space-y-2">
              <p className="text-base sm:text-lg font-serif italic text-rose-200">
                {currentBeat.quote.text}
              </p>
              {currentBeat.quote.author && (
                <p className="text-xs font-sans text-rose-400 uppercase tracking-widest">
                  {currentBeat.quote.author}
                </p>
              )}
            </div>
          )}

          {/* Bottom Prev / Next Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-800/80">
            <button
              onClick={onPrevBeat}
              disabled={activeBeatIndex === 0 && act.actId === 'I'}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-40 transition-all flex items-center gap-2"
            >
              Previous Section
            </button>

            <button
              onClick={onNextBeat}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/30 transition-all flex items-center gap-2"
            >
              Next Section
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Answer Modal */}
      <AnimatePresence>
        {activeQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">
                    {activeQuestion.category}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white leading-snug">
                    {activeQuestion.text}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveQuestion(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  Your Personal Reflection / Answer:
                </label>
                <textarea
                  value={currentInputText}
                  onChange={(e) => setCurrentInputText(e.target.value)}
                  placeholder="Write your honest reflection here..."
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/60 resize-none font-sans"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleClearAnswer}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
                >
                  Delete Response
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveQuestion(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAnswer}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/30 transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Save Answer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
