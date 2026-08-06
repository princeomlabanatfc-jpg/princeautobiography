import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Search, Bookmark, Shuffle, Plus, Check, RefreshCw, X, Lock, Unlock, Filter, Award } from 'lucide-react';
import { INITIAL_REASONS, ReasonItem, CATEGORY_LABELS } from '../data/reasonsData';

interface Reasons100ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Reasons100Modal: React.FC<Reasons100ModalProps> = ({ isOpen, onClose }) => {
  const [reasonsList, setReasonsList] = useState<ReasonItem[]>(() => {
    const savedCustom = localStorage.getItem('anvii_custom_reasons');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        return [...INITIAL_REASONS, ...parsed];
      } catch (e) {
        return INITIAL_REASONS;
      }
    }
    return INITIAL_REASONS;
  });

  const [revealedIds, setRevealedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('anvii_reasons_revealed');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return [1, 2, 3]; }
    }
    return [1, 2, 3]; // Start with first 3 revealed as a warm welcome
  });

  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('anvii_reasons_favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return [1]; }
    }
    return [1];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unrevealed' | 'revealed' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCard, setActiveCard] = useState<ReasonItem | null>(null);

  // Custom reason form state
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newPoeticNote, setNewPoeticNote] = useState('');
  const [newCategory, setNewCategory] = useState<ReasonItem['category']>('soul');

  // Save progress
  useEffect(() => {
    localStorage.setItem('anvii_reasons_revealed', JSON.stringify(revealedIds));
  }, [revealedIds]);

  useEffect(() => {
    localStorage.setItem('anvii_reasons_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  if (!isOpen) return null;

  const toggleFavorite = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const revealReason = (id: number) => {
    if (!revealedIds.includes(id)) {
      setRevealedIds(prev => [...prev, id]);
    }
  };

  const handleRevealAll = () => {
    if (window.confirm("Are you sure you want to reveal all 100 secret reasons at once?")) {
      const allIds = reasonsList.map(r => r.id);
      setRevealedIds(allIds);
    }
  };

  const handleDrawRandom = () => {
    const unrevealed = reasonsList.filter(r => !revealedIds.includes(r.id));
    const targetPool = unrevealed.length > 0 ? unrevealed : reasonsList;
    const randomItem = targetPool[Math.floor(Math.random() * targetPool.length)];
    setActiveCard(randomItem);
    revealReason(randomItem.id);
  };

  const handleAddCustomReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newReason.trim()) return;

    const newId = reasonsList.length + 1;
    const customItem: ReasonItem = {
      id: newId,
      category: newCategory,
      title: newTitle.trim(),
      reason: newReason.trim(),
      poeticNote: newPoeticNote.trim() || 'A custom reason written just for you.',
    };

    const updatedList = [...reasonsList, customItem];
    setReasonsList(updatedList);
    setRevealedIds(prev => [...prev, newId]);

    const customOnly = updatedList.slice(INITIAL_REASONS.length);
    localStorage.setItem('anvii_custom_reasons', JSON.stringify(customOnly));

    setNewTitle('');
    setNewReason('');
    setNewPoeticNote('');
    setIsAddingCustom(false);
    setActiveCard(customItem);
  };

  // Filter reasons list
  const filteredReasons = reasonsList.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poeticNote.toLowerCase().includes(searchQuery.toLowerCase());

    const isRevealed = revealedIds.includes(item.id);
    const isFav = favoriteIds.includes(item.id);

    let matchesStatus = true;
    if (statusFilter === 'unrevealed') matchesStatus = !isRevealed;
    if (statusFilter === 'revealed') matchesStatus = isRevealed;
    if (statusFilter === 'favorites') matchesStatus = isFav;

    return matchesCategory && matchesQuery && matchesStatus;
  });

  const progressPercent = Math.round((revealedIds.length / reasonsList.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-2xl overflow-hidden select-none">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[900px] bg-[#0d0d10] border border-amber-500/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#e8e6e3]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-400/30 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg md:text-xl text-white font-medium tracking-wide">100 Reasons Why Prince Adores Anvii</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[10px] uppercase tracking-widest font-sans font-semibold">
                  Gold Deck
                </span>
              </div>
              <p className="text-xs text-white/50 font-sans">Scratch or tap each golden card to reveal a quiet truth about you.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDrawRandom}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs font-sans transition-all cursor-pointer shadow-md"
              title="Draw Random Reason"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-300" />
              <span>Surprise Me</span>
            </button>
            <button
              onClick={() => setIsAddingCustom(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-200 text-xs font-sans transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden sm:inline">Add Reason</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress & Quick Stats Bar */}
        <div className="px-6 py-3 bg-black/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-white/70">Unlocked:</span>
              <span className="font-mono text-amber-300 font-bold">{revealedIds.length} / {reasonsList.length}</span>
            </div>
            <div className="flex-1 sm:w-48 h-2 bg-white/10 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-rose-400 to-amber-300 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-amber-200/80 font-mono font-medium">{progressPercent}%</span>
          </div>

          <div className="flex items-center gap-2 text-white/50 text-[11px] ml-auto">
            <button
              onClick={handleRevealAll}
              className="text-white/40 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Reveal All 100
            </button>
          </div>
        </div>

        {/* Controls, Filters & Search Bar */}
        <div className="px-6 py-4 bg-white/[0.01] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'all' ? 'bg-amber-500/30 text-amber-200 font-medium border border-amber-400/30' : 'text-white/60 hover:text-white'}`}
            >
              All ({reasonsList.length})
            </button>
            <button
              onClick={() => setStatusFilter('unrevealed')}
              className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'unrevealed' ? 'bg-amber-500/30 text-amber-200 font-medium border border-amber-400/30' : 'text-white/60 hover:text-white'}`}
            >
              Locked ({reasonsList.length - revealedIds.length})
            </button>
            <button
              onClick={() => setStatusFilter('revealed')}
              className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'revealed' ? 'bg-amber-500/30 text-amber-200 font-medium border border-amber-400/30' : 'text-white/60 hover:text-white'}`}
            >
              Revealed ({revealedIds.length})
            </button>
            <button
              onClick={() => setStatusFilter('favorites')}
              className={`px-3 py-1 rounded-lg transition-all ${statusFilter === 'favorites' ? 'bg-amber-500/30 text-amber-200 font-medium border border-amber-400/30' : 'text-white/60 hover:text-white'}`}
            >
              Favorites ({favoriteIds.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reasons or feelings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Chips */}
        <div className="px-6 py-2.5 bg-black/20 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap border transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 font-medium'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80'
            }`}
          >
            ✨ All Categories
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1 rounded-full whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                selectedCategory === key
                  ? `${info.color} font-medium`
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80'
              }`}
            >
              <span>{info.icon}</span>
              <span>{info.label}</span>
            </button>
          ))}
        </div>

        {/* Scratch Cards Grid */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-black/30">
          {filteredReasons.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-white/40">
              <Sparkles className="w-8 h-8 text-amber-400/40 mb-2 animate-bounce" />
              <p className="font-serif text-sm">No secret cards match your current filter or search.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setStatusFilter('all'); setSearchQuery(''); }}
                className="mt-3 text-xs text-amber-300 underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredReasons.map((item) => {
                const isRevealed = revealedIds.includes(item.id);
                const isFav = favoriteIds.includes(item.id);
                const categoryInfo = CATEGORY_LABELS[item.category];

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => {
                      revealReason(item.id);
                      setActiveCard(item);
                    }}
                    className={`group relative rounded-2xl border p-4 cursor-pointer flex flex-col justify-between transition-all duration-300 min-h-[170px] overflow-hidden ${
                      isRevealed
                        ? 'bg-gradient-to-b from-white/[0.06] to-white/[0.02] border-amber-500/25 hover:border-amber-400/50 shadow-xl'
                        : 'bg-gradient-to-br from-amber-950/40 via-yellow-950/30 to-amber-900/40 border-amber-500/40 hover:border-amber-300 shadow-2xl'
                    }`}
                  >
                    {/* Scratch-Off Gold Surface Layer if Unrevealed */}
                    {!isRevealed && (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 opacity-90 p-4 flex flex-col items-center justify-center text-center shadow-inner group-hover:opacity-95 transition-all">
                        {/* Metallic Shimmer Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent)] pointer-events-none" />
                        <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center mb-2 border border-white/30 shadow-lg">
                          <Lock className="w-5 h-5 text-amber-100" />
                        </div>
                        <span className="font-mono text-[11px] uppercase tracking-widest text-amber-100 font-bold mb-1">
                          Reason #{item.id}
                        </span>
                        <p className="font-serif text-xs text-amber-50 italic px-2">Scratch or tap to reveal</p>
                        <div className="mt-3 px-3 py-1 rounded-full bg-black/30 border border-white/20 text-[10px] text-amber-200 font-sans tracking-wider">
                          ✨ Tap Gold Foil
                        </div>
                      </div>
                    )}

                    {/* Revealed Card Content */}
                    {isRevealed && (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[10px] text-amber-400/80 font-semibold tracking-wider uppercase">
                              #{item.id} • {categoryInfo.icon}
                            </span>
                            <button
                              onClick={(e) => toggleFavorite(item.id, e)}
                              className="text-white/40 hover:text-rose-400 transition-colors p-1"
                              title={isFav ? "Bookmarked" : "Bookmark this reason"}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
                            </button>
                          </div>
                          
                          <h3 className="font-serif text-sm text-white font-medium mb-1 line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs text-white/70 font-sans line-clamp-3 leading-relaxed mb-3">
                            {item.reason}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <span className="font-serif text-[11px] text-amber-300/80 italic truncate pr-2">
                            "{item.poeticNote}"
                          </span>
                          <span className="text-[10px] text-white/30 group-hover:text-amber-300 transition-colors">
                            Read →
                          </span>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Card Modal View */}
      <AnimatePresence>
        {activeCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative w-full max-w-lg bg-[#121216] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center"
            >
              <button
                onClick={() => setActiveCard(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-400/40 flex items-center justify-center mb-4 shadow-xl">
                <Sparkles className="w-7 h-7 text-amber-300" />
              </div>

              <span className="font-mono text-xs uppercase tracking-widest text-amber-400/90 font-semibold mb-1">
                Reason #{activeCard.id} of 100
              </span>

              <h2 className="font-serif text-xl sm:text-2xl text-white font-medium mb-4 leading-tight">
                {activeCard.title}
              </h2>

              <div className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-5 text-left text-xs sm:text-sm text-white/85 font-sans leading-relaxed">
                {activeCard.reason}
              </div>

              <div className="w-full py-3 px-4 rounded-xl bg-amber-500/10 border border-amber-400/20 text-center mb-6">
                <p className="font-serif text-xs sm:text-sm text-amber-200 italic">
                  "{activeCard.poeticNote}"
                </p>
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => toggleFavorite(activeCard.id)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-sans font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    favoriteIds.includes(activeCard.id)
                      ? 'bg-rose-500/20 border-rose-400/50 text-rose-200'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${favoriteIds.includes(activeCard.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{favoriteIds.includes(activeCard.id) ? 'Bookmarked' : 'Bookmark Reason'}</span>
                </button>

                <button
                  onClick={handleDrawRandom}
                  className="py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-sans font-medium flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Shuffle className="w-4 h-4 text-amber-300" />
                  <span>Next Random</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Custom Reason Form Modal */}
      <AnimatePresence>
        {isAddingCustom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-[#121216] border border-rose-500/30 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="font-serif text-lg text-white font-medium">Add a Personal Reason</h3>
                <button
                  onClick={() => setIsAddingCustom(false)}
                  className="text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddCustomReason} className="space-y-4 text-xs">
                <div>
                  <label className="block text-white/70 font-sans mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ReasonItem['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                      <option key={key} value={key} className="bg-neutral-900 text-white">
                        {val.icon} {val.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-sans mb-1">Reason Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Way You Say Hello..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-sans mb-1">Reason Detail</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe why this detail about her matters to you..."
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-sans mb-1">Poetic One-Liner (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. A warm cup on a rainy morning..."
                    value={newPoeticNote}
                    onChange={(e) => setNewPoeticNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-lg"
                  >
                    Save & Add to Deck
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
