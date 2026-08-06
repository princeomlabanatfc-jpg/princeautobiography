import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OBSERVATION_MOMENTS } from '../data/content';
import { ObservationMoment } from '../types';
import { 
  Eye, Sparkles, BookOpen, ArrowRight, HeartHandshake, 
  Compass, ShieldCheck, Quote, ChevronRight, CheckCircle2,
  Image as ImageIcon, Camera, Plus, Heart, Upload, 
  Trash2, Filter, Calendar, MapPin, Tag, Sparkle, Layers,
  Maximize2, X, ChevronLeft, ZoomIn
} from 'lucide-react';
import { TheLifeImBuilding } from './TheLifeImBuilding';

import imgJournal33 from '../assets/images/JournalPage.jpeg';
import imgDailyTasks from '../assets/images/DailyTasks.jpeg';
import imgOLQs from '../assets/images/olq.jpeg';
import imgAnviiPink from '../assets/images/anviiphoto.png';
import imgInstagramChat from '../assets/images/marriagechat.png';
import imgIshqWalaLove from '../assets/images/couplephoto.png';
import imgTFCMars from '../assets/images/tfclogo.png';
import imgPrinceFocus from '../assets/images/princephoto.jpeg';

export interface PolaroidMemory {
  id: string;
  title: string;
  date: string;
  location: string;
  tag: 'Journal' | 'OLQs' | 'TFC Vision' | 'Anvii' | 'Chat Memory' | 'Prince';
  imageUrl: string;
  frontCaption: string;
  backNote: string;
  likes: number;
  isCustom?: boolean;
}

const INITIAL_POLAROIDS: PolaroidMemory[] = [
  {
    id: 'pol-1',
    title: 'Journal Page 7: 33 Life Principles',
    date: 'Personal Notebook',
    location: 'Prince\'s Journal',
    tag: 'Journal',
    imageUrl: imgJournal33,
    frontCaption: '"Be silent and listen... Your mind will always answer if you trust it."',
    backNote: 'Rule 1: Be silent and listen. Rule 13: Meta-cognition (find weak points). Rule 29: Be like a silent killer. Rule 30: Your mind will answer prior to sleep. Rule 31: Impossible always tell I am Possible.',
    likes: 48
  },
  {
    id: 'pol-2',
    title: 'Daily Tasks & 12th Dreams List',
    date: 'School Days Journal',
    location: 'Prince\'s Log',
    tag: 'Journal',
    imageUrl: imgDailyTasks,
    frontCaption: 'Daily Tasks: Left+Right hand work, Puzzles, 100% in 12th.',
    backNote: 'Daily discipline log: Puzzles, reasoning, multi-tasking, yoga, meditation, physical activity, and dreams of MNCs, boxing, trading, hacking, and Manu.',
    likes: 39
  },
  {
    id: 'pol-3',
    title: 'OLQ\'S (Officer Like Qualities) Training',
    date: 'Self-Training Program',
    location: 'Signed by Prince L.',
    tag: 'OLQs',
    imageUrl: imgOLQs,
    frontCaption: '15 Officer Like Qualities — Courage, Stamina, Social Adaptability.',
    backNote: 'Self-training list signed by Prince L: Courage, Stamina, Initiative, Liveliness, Cooperation, Determination, Self-confidence, Speed of decision, Organising ability, Power of expression.',
    likes: 52
  },
  {
    id: 'pol-4',
    title: 'Anvii\'s Grace in Pink Dress',
    date: 'Special Evening',
    location: 'PCP Function',
    tag: 'Anvii',
    imageUrl: imgAnviiPink,
    frontCaption: 'Anvii standing gracefully in traditional pink lehenga.',
    backNote: 'A cherished moment captured in time—Anvii standing in her traditional pink dress during an evening function where quiet memories were forged.',
    likes: 76
  },
  {
    id: 'pol-5',
    title: 'The Marriage Chat Memory (Instagram)',
    date: 'Instagram Chat (@againanvi)',
    location: 'Private Messages',
    tag: 'Chat Memory',
    imageUrl: imgInstagramChat,
    frontCaption: 'Anvii: "Baat krti hu shaadi ki" | Prince: "1/infinite bhi hoga na toh bhi try karunga"',
    backNote: 'Anvii: "No de tere papa ke, Baat krti hu shaadi ki" | Prince: "1/infinite bhi hoga na toh bhi try karunga" | Anvii: "Haaa chl baat krte h Direct papa mummy se". A moment of raw truth and laughter.',
    likes: 98
  },
  {
    id: 'pol-6',
    title: 'Ishq Wala Love — Prince & Anvii',
    date: 'Shared Memory',
    location: 'Evening Gathering',
    tag: 'Anvii',
    imageUrl: imgIshqWalaLove,
    frontCaption: 'Ishq Wala Love (Student of the Year) — Prince & Anvii',
    backNote: 'Prince in his black shirt and Anvii in her pink dress, framed with the "Ishq Wala Love" song overlay.',
    likes: 84
  },
  {
    id: 'pol-7',
    title: 'TFC Master Architecture Vision',
    date: 'Future Roadmap',
    location: 'TFC Headquarters',
    tag: 'TFC Vision',
    imageUrl: imgTFCMars,
    frontCaption: 'TFC: Beyond Today. Building Tomorrow. Mars isn\'t the end.',
    backNote: 'The master architecture for The Future Civilisation: AGI, Longevity (1000 yr lifespan), Mars colonization, Future Cities, and Revolutionizing Global Education.',
    likes: 81
  },
  {
    id: 'pol-8',
    title: 'Prince: Focus, Discipline, Consistency',
    date: 'Architect Portrait',
    location: 'PG Studio Room',
    tag: 'Prince',
    imageUrl: imgPrinceFocus,
    frontCaption: 'Focus, Discipline, Consistency, Success — Prince.',
    backNote: 'Prince in glasses, thoughtful pose in front of his discipline poster: "Discipline today. Dominate tomorrow. Leave a legacy that outlives you."',
    likes: 104
  }
];

interface MomentsAndObservationsProps {
  onCompleteMoments: () => void;
  onModalToggle?: (isOpen: boolean) => void;
}

export const MomentsAndObservations: React.FC<MomentsAndObservationsProps> = ({ onCompleteMoments, onModalToggle }) => {
  const [selectedMoment, setSelectedMoment] = useState<ObservationMoment>(OBSERVATION_MOMENTS[0]);
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([OBSERVATION_MOMENTS[0].id]);
  const [activeTab, setActiveTab] = useState<'detail' | 'princeNote'>('detail');
  
  // Suggestion #2: Interactive View Toggle (Turning Points vs Polaroid Memory Gallery)
  const [viewMode, setViewMode] = useState<'turningPoints' | 'polaroidGallery'>('turningPoints');
  const [polaroids, setPolaroids] = useState<PolaroidMemory[]>(() => {
    try {
      const saved = localStorage.getItem('anvii_prince_polaroids_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed loading polaroids', e);
    }
    return INITIAL_POLAROIDS;
  });

  const [polaroidFilter, setPolaroidFilter] = useState<string>('All');
  const [isAddPolaroidOpen, setIsAddPolaroidOpen] = useState(false);

  // Fullscreen Lightbox State
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Notify parent component when any modal opens/closes
  useEffect(() => {
    const isModalOpen = activeLightboxIndex !== null || isAddPolaroidOpen;
    onModalToggle?.(isModalOpen);
  }, [activeLightboxIndex, isAddPolaroidOpen, onModalToggle]);

  // Form states for custom Polaroid
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTag, setNewTag] = useState<PolaroidMemory['tag']>('Anvii');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newFrontCaption, setNewFrontCaption] = useState('');
  const [newBackNote, setNewBackNote] = useState('');

  // Save custom polaroids
  useEffect(() => {
    try {
      const persistent = polaroids.filter(p => !p.imageUrl.startsWith('blob:'));
      localStorage.setItem('anvii_prince_polaroids_v6', JSON.stringify(persistent));
    } catch (e) {
      console.warn('Failed saving polaroids', e);
    }
  }, [polaroids]);

  const handleSelectMoment = (moment: ObservationMoment) => {
    setSelectedMoment(moment);
    setActiveTab('detail');
    if (!discoveredIds.includes(moment.id)) {
      setDiscoveredIds(prev => [...prev, moment.id]);
    }
  };

  const openLightbox = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const handleLikePolaroid = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPolaroids(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleAddCustomPolaroid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPol: PolaroidMemory = {
      id: 'custom_pol_' + Date.now(),
      title: newTitle.trim(),
      date: newDate.trim() || 'Today',
      location: newLocation.trim() || 'Shared Memory',
      tag: newTag,
      imageUrl: newImgUrl.trim() || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
      frontCaption: newFrontCaption.trim() || newTitle,
      backNote: newBackNote.trim() || 'A cherished moment recorded in our personal memory archive.',
      likes: 1,
      isCustom: true
    };

    setPolaroids([newPol, ...polaroids]);
    setIsAddPolaroidOpen(false);
    // Reset form
    setNewTitle('');
    setNewLocation('');
    setNewDate('');
    setNewImgUrl('');
    setNewFrontCaption('');
    setNewBackNote('');
  };

  const handleDeletePolaroid = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPolaroids(prev => prev.filter(p => p.id !== id));
  };

  const polaroidTags = ['All', 'Journal', 'OLQs', 'TFC Vision', 'Anvii', 'Chat Memory', 'Prince'];
  const filteredPolaroids = polaroids.filter(p => polaroidFilter === 'All' || p.tag === polaroidFilter);

  const handlePrevLightbox = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => 
      prev !== null ? (prev === 0 ? filteredPolaroids.length - 1 : prev - 1) : 0
    );
  };

  const handleNextLightbox = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => 
      prev !== null ? (prev === filteredPolaroids.length - 1 ? 0 : prev + 1) : 0
    );
  };

  // Keyboard Navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') handlePrevLightbox();
      if (e.key === 'ArrowRight') handleNextLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredPolaroids.length]);

  const progressPercent = Math.round((discoveredIds.length / OBSERVATION_MOMENTS.length) * 100);
  const allDiscovered = discoveredIds.length === OBSERVATION_MOMENTS.length;

  return (
    <div 
      id="moments-observations-screen"
      className="min-h-screen w-full flex flex-col items-center justify-between relative px-4 md:px-8 pt-24 pb-20 bg-[#0a0a0c] text-[#e8e6e3] overflow-x-hidden"
    >
      {/* Background glow ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-3xl w-full text-center z-10 space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-orange-200 text-xs font-sans tracking-widest uppercase backdrop-blur-md">
          <Eye className="w-3.5 h-3.5 text-orange-200" />
          <span>Pivotal Moments & Visual Journal</span>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl text-white font-light tracking-wide leading-tight">
          The Life I'm Building & <span className="text-orange-200 italic font-serif">Polaroid Gallery</span>
        </h1>

        <p className="font-sans text-xs md:text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
          This section isn't about who I was. It's about who I'm choosing to become from this moment onward.
        </p>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setViewMode('turningPoints')}
            className={`px-4 py-2 rounded-full text-xs font-sans font-medium flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'turningPoints'
                ? 'bg-gradient-to-r from-orange-500/80 to-amber-500/80 text-white border border-orange-300/40 shadow-lg'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-200" />
            <span>The Life I'm Building</span>
          </button>

          <button
            onClick={() => setViewMode('polaroidGallery')}
            className={`px-4 py-2 rounded-full text-xs font-sans font-medium flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'polaroidGallery'
                ? 'bg-gradient-to-r from-orange-500/80 to-amber-500/80 text-white border border-orange-300/40 shadow-lg'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-orange-200" />
            <span>Polaroid Memory Gallery ({polaroids.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: THE LIFE I'M BUILDING */}
      {viewMode === 'turningPoints' && (
        <TheLifeImBuilding />
      )}

      {/* VIEW MODE 2: INTERACTIVE POLAROID GALLERY (SUGGESTION #2) */}
      {viewMode === 'polaroidGallery' && (
        <div className="max-w-6xl w-full my-8 z-10 space-y-6">
          {/* Controls Bar: Filters & Add Polaroid */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            {/* Tag Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs text-white/40 font-sans mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Tag:
              </span>
              {polaroidTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setPolaroidFilter(t)}
                  className={`px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer whitespace-nowrap ${
                    polaroidFilter === t
                      ? 'bg-amber-400 text-black font-semibold shadow-md'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Add Polaroid Button */}
            <button
              onClick={() => setIsAddPolaroidOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 border border-orange-400/30 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-orange-300" />
              <span>Add Memory Polaroid</span>
            </button>
          </div>

          {/* Polaroid Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolaroids.map((pol, index) => {
              return (
                <motion.div
                  key={pol.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group cursor-pointer bg-[#f4eae0] text-neutral-900 rounded-2xl p-4 flex flex-col justify-between border border-amber-200/60 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  onClick={() => openLightbox(index)}
                >
                  {/* Photo Image Box */}
                  <div className="relative w-full h-64 rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center p-1.5 border border-neutral-300/40 group/img">
                    <img
                      src={pol.imageUrl}
                      alt={pol.title}
                      className="w-full h-full object-contain group-hover/img:scale-105 transition-transform duration-500 rounded-lg"
                    />
                    {/* Tag Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/75 text-amber-200 text-[10px] font-sans font-medium backdrop-blur-md border border-white/10">
                      {pol.tag}
                    </div>

                    {/* Click to Enlarge Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-lg backdrop-blur-[2px]">
                      <span className="px-3 py-1.5 rounded-full bg-amber-400 text-neutral-950 text-xs font-bold font-sans flex items-center gap-1.5 shadow-lg">
                        <Maximize2 className="w-3.5 h-3.5" /> Full Screen
                      </span>
                    </div>
                  </div>

                  {/* Polaroid Handwriting Footer */}
                  <div className="space-y-2 pt-3 pb-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-base text-neutral-900 leading-snug">
                        {pol.title}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-500 shrink-0 mt-0.5">{pol.date}</span>
                    </div>

                    <p className="font-serif italic text-xs text-amber-900/90 leading-relaxed bg-amber-500/10 p-2 rounded-lg border border-amber-300/30">
                      "{pol.frontCaption}"
                    </p>

                    {/* Reflection Note */}
                    {pol.backNote && (
                      <p className="text-[11px] font-sans text-neutral-700 leading-normal line-clamp-2 pt-1 border-t border-neutral-300/50">
                        <span className="font-semibold text-amber-800">Note: </span>
                        {pol.backNote}
                      </p>
                    )}
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="flex items-center justify-between border-t border-neutral-300/70 pt-2.5 text-xs font-sans text-neutral-600 mt-2">
                    <div className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span className="truncate max-w-[110px]">{pol.location}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleLikePolaroid(pol.id, e)}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors p-1"
                        title="Send Heart"
                      >
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                        <span className="font-bold text-[11px]">{pol.likes}</span>
                      </button>

                      <button
                        onClick={(e) => openLightbox(index, e)}
                        className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold underline flex items-center gap-1"
                        title="Open in Full Screen"
                      >
                        <Maximize2 className="w-3 h-3" /> Full Size
                      </button>

                      {pol.isCustom && (
                        <button
                          onClick={(e) => handleDeletePolaroid(pol.id, e)}
                          className="text-neutral-400 hover:text-red-600 transition-colors"
                          title="Delete Memory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full-Screen Image Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxIndex !== null && filteredPolaroids[activeLightboxIndex] && (
          <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-2xl p-3 sm:p-6 text-white overflow-y-auto"
            onClick={closeLightbox}
          >
            {/* Top Fixed Floating Cut / Close Button (Always visible on any device) */}
            <button
              onClick={closeLightbox}
              className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-sans text-xs font-bold shadow-2xl border border-rose-400/50 flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
              title="Close Full Screen View (Esc)"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span>Close Photo</span>
            </button>

            {/* Top Control Bar */}
            <div 
              className="w-full max-w-6xl flex items-center justify-between border-b border-white/10 pb-3 pr-28 sm:pr-0 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
                  {filteredPolaroids[activeLightboxIndex].tag}
                </span>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-amber-100">
                    {filteredPolaroids[activeLightboxIndex].title}
                  </h3>
                  <p className="text-xs text-white/50 font-mono">
                    {filteredPolaroids[activeLightboxIndex].date} • {filteredPolaroids[activeLightboxIndex].location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-white/40 font-mono hidden sm:inline-block">
                  {activeLightboxIndex + 1} / {filteredPolaroids.length}
                </span>
                <button
                  onClick={closeLightbox}
                  className="px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white transition-all cursor-pointer border border-rose-500/40 flex items-center gap-1.5 text-xs font-semibold shadow-lg"
                  title="Close Full Screen (Esc)"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>
            </div>

            {/* Center Main Image & Navigation Arrows */}
            <div 
              className="relative w-full max-w-6xl flex-1 flex items-center justify-between my-4 gap-2 sm:gap-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Button */}
              <button
                onClick={handlePrevLightbox}
                className="p-3 rounded-full bg-black/60 hover:bg-amber-500/80 hover:text-black text-white/80 border border-white/15 backdrop-blur-md transition-all cursor-pointer shrink-0 z-20 shadow-xl"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Full Resolution Image Container */}
              <motion.div 
                key={filteredPolaroids[activeLightboxIndex].id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex-1 h-full flex items-center justify-center p-2 relative"
              >
                <div className="relative inline-block max-w-full">
                  {/* Floating Close Button directly on Image Corner */}
                  <button
                    onClick={closeLightbox}
                    className="absolute -top-3 -right-3 z-30 p-2 rounded-full bg-rose-600 text-white hover:bg-rose-500 hover:scale-110 shadow-2xl border border-white/30 transition-all cursor-pointer"
                    title="Cut / Close Photo"
                  >
                    <X className="w-4 h-4 stroke-[3]" />
                  </button>

                  <img
                    src={filteredPolaroids[activeLightboxIndex].imageUrl}
                    alt={filteredPolaroids[activeLightboxIndex].title}
                    className="max-w-full max-h-[72vh] sm:max-h-[78vh] object-contain rounded-2xl shadow-2xl border border-amber-300/30 bg-neutral-950/80"
                  />
                </div>
              </motion.div>

              {/* Next Button */}
              <button
                onClick={handleNextLightbox}
                className="p-3 rounded-full bg-black/60 hover:bg-amber-500/80 hover:text-black text-white/80 border border-white/15 backdrop-blur-md transition-all cursor-pointer shrink-0 z-20 shadow-xl"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Handwritten Caption / Memory Note */}
            <div 
              className="w-full max-w-4xl bg-neutral-900/90 border border-white/15 rounded-2xl p-4 text-center space-y-1.5 backdrop-blur-xl shadow-2xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-serif italic text-sm sm:text-base text-amber-200">
                "{filteredPolaroids[activeLightboxIndex].frontCaption}"
              </p>
              {filteredPolaroids[activeLightboxIndex].backNote && (
                <p className="text-xs text-neutral-300 font-sans leading-relaxed max-w-3xl mx-auto border-t border-white/10 pt-1.5">
                  <span className="font-medium text-amber-400">Reflection: </span>
                  {filteredPolaroids[activeLightboxIndex].backNote}
                </p>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Custom Polaroid Modal */}
      <AnimatePresence>
        {isAddPolaroidOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#101018] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-orange-200" />
                  <h3 className="font-serif text-lg font-bold text-amber-200">Add Memory Polaroid</h3>
                </div>
                <button
                  onClick={() => setIsAddPolaroidOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCustomPolaroid} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-white/60 mb-1">Memory Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Late Night Conversation"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Location</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Gujarat / Online"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Tag</label>
                    <select
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value as any)}
                      className="w-full bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
                    >
                      <option value="Anvii">Anvii</option>
                      <option value="Roots">Roots</option>
                      <option value="Turning Point">Turning Point</option>
                      <option value="Hostel">Hostel</option>
                      <option value="TFC & Code">TFC & Code</option>
                      <option value="Unspoken">Unspoken</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 mb-1">Photo Image URL</label>
                  <input
                    type="url"
                    value={newImgUrl}
                    onChange={(e) => setNewImgUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 mb-1">Front Polaroid Caption</label>
                  <input
                    type="text"
                    value={newFrontCaption}
                    onChange={(e) => setNewFrontCaption(e.target.value)}
                    placeholder="One sentence printed on the polaroid front..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 mb-1">Back Handwritten Note</label>
                  <textarea
                    rows={3}
                    value={newBackNote}
                    onChange={(e) => setNewBackNote(e.target.value)}
                    placeholder="Deep reflection revealed when flipped..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddPolaroidOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs text-white/60 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 text-black font-semibold text-xs cursor-pointer shadow-lg"
                  >
                    Save Memory
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="max-w-md w-full text-center z-10 pt-4 pb-4">
        <button
          onClick={onCompleteMoments}
          id="moments-continue-to-reflection-btn"
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500/80 via-amber-500/80 to-rose-500/80 hover:from-orange-500 hover:to-rose-500 text-white font-sans text-xs tracking-widest uppercase font-medium shadow-xl hover:shadow-orange-500/20 transition-all cursor-pointer group"
        >
          <span>{allDiscovered ? "Enter Reflection Space" : "Continue to Reflection"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
