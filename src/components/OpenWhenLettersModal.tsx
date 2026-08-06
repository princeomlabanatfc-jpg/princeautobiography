import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Heart, Sparkles, X, Check, Lock, Unlock, Feather, 
  Send, Bookmark, CornerDownRight, Volume2, Shield, Calendar, RefreshCw
} from 'lucide-react';

export interface OpenWhenLetter {
  id: string;
  title: string;
  subtitle: string;
  themeColor: 'rose' | 'amber' | 'violet' | 'emerald' | 'gold' | 'sky';
  icon: string;
  sealText: string;
  content: string[];
  princePso: string; // Personal Postscript Note
}

const OPEN_WHEN_LETTERS: OpenWhenLetter[] = [
  {
    id: 'letter-reassurance',
    title: 'Open When You Need Reassurance',
    subtitle: 'When doubt creeps in or the world feels overwhelming',
    themeColor: 'rose',
    icon: '💌',
    sealText: 'P & A',
    content: [
      "Dear Anvii,",
      "If you are opening this letter right now, maybe a moment of hesitation crossed your mind, or maybe the noise of daily life made you wonder about my intentions.",
      "I want to remind you of one unbreakable truth: I didn't create this autobiography to perform, impress strangers, or pretend to be someone flawless. I built this entire sanctuary line by line, night after night, because I care about truth.",
      "Every word you read here is 100% unedited and sincere. My respect for you isn't temporary or contingent on smooth days—it is rooted in deep, steady character.",
      "Whenever you feel unsure, remember that my door is always open, my intentions are clean, and you will always have a safe, quiet space in my life."
    ],
    princePso: "P.S. Take a deep breath. You are deeply valued and understood."
  },
  {
    id: 'letter-late-night',
    title: 'Open When You\'re Staying Up Late',
    subtitle: 'For the quiet hours when the rest of the world is asleep',
    themeColor: 'amber',
    icon: '🌙',
    sealText: 'MIDNIGHT',
    content: [
      "Dear Anvii,",
      "It's late, isn't it? The quiet of midnight has a way of bringing out our deepest thoughts.",
      "During my PG days and late nights of building The Future Civilisation (TFC), midnight was always my sanctuary. It was when I did my clearest thinking and formed my strongest values.",
      "If you're awake right now, don't carry any heavy thoughts alone. Look up at the stars on the screen—every star in the 'Constellation of Wishes' was coded with you in mind.",
      "Rest your eyes soon. Sleep peacefully knowing tomorrow brings fresh clarity."
    ],
    princePso: "P.S. Turn on the background rain audio in the player top-right—it's meant for late nights."
  },
  {
    id: 'letter-vision',
    title: 'Open When You Want to Know My Long-Term Vision',
    subtitle: 'Where I am heading and the principles guiding my path',
    themeColor: 'gold',
    icon: '🏛️',
    sealText: 'TFC',
    content: [
      "Dear Anvii,",
      "People often see the exterior—the discipline, the coding, the ambition. But here is the core of what drives me:",
      "I believe in building things that endure. Whether it's software engineering, leadership in TFC, or personal relationships, I value long-term commitment over short-term excitement.",
      "I don't make promises easily, but when I do, I honor them completely. My vision for the future is one built on independence, financial freedom, deep intellectual craft, and emotional maturity.",
      "I want to build a life where those I hold dear feel completely supported, secure, and free to be themselves."
    ],
    princePso: "P.S. True strength isn't being loud; it's being steady when things get tough."
  },
  {
    id: 'letter-why-website',
    title: 'Open When You Wonder Why I Built This Website',
    subtitle: 'The true origin story of this digital sanctuary',
    themeColor: 'violet',
    icon: '💫',
    sealText: 'TRUTH',
    content: [
      "Dear Anvii,",
      "When over 20+ blocks happened on messaging platforms, most people would have walked away, blamed circumstances, or let misunderstandings turn into permanent distance.",
      "I refused to let miscommunication define who I am to you.",
      "I realized that short text messages could never convey a human being's soul, values, childhood, struggles, and core. So I sat down at my laptop and wrote my entire life story—Act by Act—so you would have 100% unedited access to my truth.",
      "This website is my statement that effort, honesty, and care will always win over silence."
    ],
    princePso: "P.S. You are the only person in the world who holds the key to this private room."
  },
  {
    id: 'letter-rainy-day',
    title: 'Open On a Rainy Day',
    subtitle: 'When the rain falls outside and you want a cozy moment',
    themeColor: 'sky',
    icon: '🌧️',
    sealText: 'RAIN',
    content: [
      "Dear Anvii,",
      "Rain has a subtle way of pausing time. Back in Ahmedabad and during my school days, rainy afternoons were when I did my best reading and observing.",
      "If it's raining outside right now, grab a warm cup of coffee or tea, wrap yourself in comfort, and know that you are allowed to slow down.",
      "Life isn't a race to prove anything to anyone. Sometimes the greatest luxury is simply sitting quietly and being present."
    ],
    princePso: "P.S. Play 'Acoustic Solitude' in the music player—it pairs perfectly with rain."
  },
  {
    id: 'letter-smiles',
    title: 'Open When You Need a Reason to Smile',
    subtitle: 'A lighthearted reminder of life\'s simple joys',
    themeColor: 'emerald',
    icon: '🌸',
    sealText: 'JOY',
    content: [
      "Dear Anvii,",
      "Did you know that despite my serious, focused exterior when building systems, I actually have a very dry, quiet sense of humor?",
      "That tiny note I slipped into your bag during the 8 PM PCP program ('Kal se piche baith jana') still brings a smile to my face whenever I recall how brave I felt in that one minute!",
      "Never forget to smile at the small absurdities of life. Whatever brought a cloud over your day today is only temporary. Keep your head high."
    ],
    princePso: "P.S. Go try the 'How Well Do You Know Prince?' quiz in the menu for a quick smile!"
  }
];

interface OpenWhenLettersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenWhenLettersModal: React.FC<OpenWhenLettersModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedLetter, setSelectedLetter] = useState<OpenWhenLetter | null>(null);
  const [isOpenedSeal, setIsOpenedSeal] = useState(false);
  const [anviiReplies, setAnviiReplies] = useState<{ [letterId: string]: string }>(() => {
    try {
      const saved = localStorage.getItem('anvii_letter_replies');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [currentReplyText, setCurrentReplyText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (selectedLetter) {
      setCurrentReplyText(anviiReplies[selectedLetter.id] || '');
      setIsOpenedSeal(false);
      setSavedSuccess(false);
    }
  }, [selectedLetter]);

  const handleSaveReply = () => {
    if (!selectedLetter) return;
    const updated = { ...anviiReplies, [selectedLetter.id]: currentReplyText };
    setAnviiReplies(updated);
    try {
      localStorage.setItem('anvii_letter_replies', JSON.stringify(updated));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="open-when-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#0f0f13] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg md:text-xl text-white font-medium flex items-center gap-2">
                  <span>Open When... Letters for Anvii</span>
                  <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-400/30 text-orange-200">
                    Wax Sealed
                  </span>
                </h2>
                <p className="text-xs font-sans text-white/50">Handcrafted letters by Prince for specific moments in time</p>
              </div>
            </div>

            <button
              onClick={onClose}
              id="close-open-when-modal-btn"
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Content */}
          <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {!selectedLetter ? (
              /* Envelopes Grid View */
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2 py-2">
                  <p className="font-serif text-base text-orange-200/90 italic">
                    "Choose an envelope that matches how you feel right now."
                  </p>
                  <p className="text-xs text-white/50">
                    Click any letter to unseal the wax stamp and read Prince's private note inside.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {OPEN_WHEN_LETTERS.map((letter) => {
                    const hasReply = !!anviiReplies[letter.id];
                    return (
                      <motion.div
                        key={letter.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedLetter(letter)}
                        id={`letter-card-${letter.id}`}
                        className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-orange-400/40 transition-all cursor-pointer overflow-hidden shadow-lg"
                      >
                        {/* Glow accent */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all pointer-events-none" />

                        {/* Top Icon & Wax Stamp */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl">{letter.icon}</span>
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/30 text-orange-200 text-[10px] font-sans font-semibold tracking-wider uppercase">
                            <Lock className="w-3 h-3 text-orange-300" />
                            <span>{letter.sealText}</span>
                          </div>
                        </div>

                        {/* Letter Titles */}
                        <h3 className="font-serif text-base text-white font-medium group-hover:text-orange-200 transition-colors mb-1.5">
                          {letter.title}
                        </h3>
                        <p className="text-xs font-sans text-white/60 line-clamp-2 leading-relaxed mb-4">
                          {letter.subtitle}
                        </p>

                        {/* Bottom Footer Info */}
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-sans">
                          <span className="flex items-center gap-1">
                            <Feather className="w-3 h-3 text-orange-300" />
                            <span>Unseal Letter</span>
                          </span>
                          {hasReply && (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Your Note Saved</span>
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Single Letter Reader View */
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Back Button */}
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="inline-flex items-center gap-2 text-xs text-orange-300/90 hover:text-orange-200 transition-colors cursor-pointer"
                >
                  ← Back to all envelopes
                </button>

                {!isOpenedSeal ? (
                  /* Sealed Wax Animation Trigger */
                  <div className="text-center py-12 px-6 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-3xl space-y-6">
                    <div className="text-5xl animate-bounce mb-2">{selectedLetter.icon}</div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl text-white font-light">{selectedLetter.title}</h3>
                      <p className="text-xs text-white/60">{selectedLetter.subtitle}</p>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => setIsOpenedSeal(true)}
                        id="unseal-wax-btn"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 hover:opacity-95 text-white font-sans text-xs tracking-widest uppercase font-semibold shadow-xl cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-orange-100" />
                        <span>Break Wax Seal & Read Letter</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Letter Body Unsealed */
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="p-8 md:p-10 rounded-3xl bg-[#14141a] border border-orange-500/20 shadow-2xl space-y-6 relative"
                  >
                    {/* Header Stamp */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-2 text-orange-200 font-serif italic text-sm">
                        <Feather className="w-4 h-4 text-orange-300" />
                        <span>Handwritten by Prince for Anvii</span>
                      </div>
                      <span className="text-[10px] uppercase font-sans tracking-widest px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-400/20">
                        Private Letter
                      </span>
                    </div>

                    {/* Paragraphs */}
                    <div className="space-y-4 text-sm md:text-base font-sans text-white/90 leading-relaxed font-light">
                      {selectedLetter.content.map((paragraph, idx) => (
                        <p key={idx} className={idx === 0 ? "font-serif text-lg text-orange-200/90 font-medium italic" : ""}>
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Prince's P.S. Note */}
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-400/30 text-orange-200 text-xs font-serif italic">
                      {selectedLetter.princePso}
                    </div>

                    {/* Anvii's Optional Response Note */}
                    <div className="pt-6 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-serif text-white/80 italic flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
                          <span>Anvii's Reply or Note for this letter (Saved locally):</span>
                        </label>
                        {savedSuccess && (
                          <span className="text-xs text-emerald-400 font-sans flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Saved!
                          </span>
                        )}
                      </div>

                      <textarea
                        value={currentReplyText}
                        onChange={(e) => setCurrentReplyText(e.target.value)}
                        placeholder="Write a private thought or response here..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-orange-400 text-white text-xs placeholder:text-white/30 focus:outline-none resize-none"
                      />

                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveReply}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-orange-500/80 text-white font-sans text-xs tracking-wider uppercase font-medium transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-orange-200" />
                          <span>Save Note</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
