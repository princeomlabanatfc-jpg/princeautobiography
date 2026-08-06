import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareQuote, ArrowRight, Check } from 'lucide-react';

interface FirstConversationProps {
  onNextChapter: () => void;
}

const CONVERSATION_BEATS = [
  {
    id: 1,
    heading: "To Anvii,",
    text: "For months, miscommunications and over 20 blocks stood between us. Silence felt like the only shelter, but silence never tells the whole story.",
    subtext: "An incomplete truth creates an incomplete person."
  },
  {
    id: 2,
    heading: "Why I Wrote Everything Down",
    text: "Instead of sending fragmented messages or letting assumptions linger, I chose to document every single phase of my life — my mistakes, my growth, and my reasons.",
    subtext: "Because if someone is important enough to be part of my life, they deserve the complete picture."
  },
  {
    id: 3,
    heading: "Behind the Scenes",
    text: "From early childhood in Ahmedabad to quiet hostel nights and building TFC line by line in my PG room, every step was driven by a quiet desire to master my craft and shape my future.",
    subtext: "The person you see today was built one decision at a time."
  },
  {
    id: 4,
    heading: "From Prince",
    text: "I invite you to read these 11 Acts with an open mind. You don't have to agree with every choice, but I hope you understand the context in which they were made.",
    subtext: "Thank you for taking the time to see who I truly am."
  }
];

export const FirstConversation: React.FC<FirstConversationProps> = ({ onNextChapter }) => {
  const [activeBeat, setActiveBeat] = useState(0);

  const currentBeat = CONVERSATION_BEATS[activeBeat];
  const isLast = activeBeat === CONVERSATION_BEATS.length - 1;

  const handleNextBeat = () => {
    if (isLast) {
      onNextChapter();
    } else {
      setActiveBeat((prev) => prev + 1);
    }
  };

  return (
    <div 
      id="first-conversation-screen"
      className="min-h-screen w-full flex flex-col items-center justify-center relative px-6 py-12 bg-[#0a0a0c] text-[#eae5dc] overflow-hidden"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Progress timeline dots */}
      <div className="absolute top-12 flex items-center gap-3 opacity-70 z-10">
        {CONVERSATION_BEATS.map((beat, idx) => (
          <div
            key={beat.id}
            className={`flex items-center justify-center rounded-full transition-all duration-500 ${
              idx === activeBeat 
                ? 'w-7 h-7 bg-orange-200/20 border border-orange-200 text-orange-200 text-xs font-medium shadow-md backdrop-blur-md' 
                : idx < activeBeat 
                ? 'w-2.5 h-2.5 bg-orange-200/70' 
                : 'w-2.5 h-2.5 bg-white/20'
            }`}
          >
            {idx === activeBeat && (idx + 1)}
          </div>
        ))}
      </div>

      <div className="max-w-2xl w-full z-10 my-auto p-8 md:p-12 bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBeat}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-orange-200 text-xs tracking-widest uppercase backdrop-blur-md">
              <MessageSquareQuote className="w-3.5 h-3.5 text-orange-200" />
              <span>{currentBeat.heading}</span>
            </div>

            <p className="font-serif text-2xl md:text-4xl text-white/95 font-light leading-relaxed tracking-wide px-2">
              "{currentBeat.text}"
            </p>

            <p className="font-sans text-sm md:text-base text-white/60 font-normal italic max-w-md mx-auto pt-2">
              {currentBeat.subtext}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="pt-10 text-center">
          <button
            onClick={handleNextBeat}
            id={`conv-step-btn-${activeBeat}`}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500/80 to-amber-500/80 hover:from-orange-500 hover:to-amber-500 text-white font-sans text-xs tracking-widest uppercase font-medium shadow-lg cursor-pointer transition-all"
          >
            <span>{isLast ? "Enter the 11 Acts Autobiography" : "Listen Further"}</span>
            {isLast ? (
              <Check className="w-4 h-4 text-orange-200" />
            ) : (
              <ArrowRight className="w-4 h-4 text-orange-200" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
