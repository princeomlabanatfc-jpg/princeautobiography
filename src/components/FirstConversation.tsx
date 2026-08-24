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
      className="min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center relative px-4 sm:px-6 pt-20 pb-16 sm:py-12 bg-[#0a0a0c] text-[#eae5dc] overflow-hidden"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Progress timeline dots */}
      <div className="relative sm:absolute sm:top-16 flex items-center justify-center gap-3 opacity-90 z-10 mb-6 sm:mb-0">
        {CONVERSATION_BEATS.map((beat, idx) => (
          <div
            key={beat.id}
            className={`flex items-center justify-center rounded-full transition-all duration-500 ${
              idx === activeBeat 
                ? 'w-7 h-7 bg-orange-500/30 border border-orange-300 text-orange-200 text-xs font-bold shadow-md backdrop-blur-md' 
                : idx < activeBeat 
                ? 'w-2.5 h-2.5 bg-orange-400' 
                : 'w-2.5 h-2.5 bg-white/30'
            }`}
          >
            {idx === activeBeat && (idx + 1)}
          </div>
        ))}
      </div>

      <div className="max-w-2xl w-full z-10 my-auto p-6 sm:p-8 md:p-12 bg-[#121217]/95 border border-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBeat}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 sm:space-y-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-orange-200 text-xs tracking-widest uppercase backdrop-blur-md">
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

        <div className="pt-8 sm:pt-10 text-center">
          <button
            onClick={handleNextBeat}
            id={`conv-step-btn-${activeBeat}`}
            className="btn-primary-gradient inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-sans text-xs tracking-widest uppercase font-semibold shadow-2xl hover:shadow-orange-500/40 cursor-pointer transition-all"
            style={{
              backgroundColor: '#ea580c',
              backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #f43f5e 100%)',
            }}
          >
            <span>{isLast ? "Enter the 11 Acts Autobiography" : "Listen Further"}</span>
            {isLast ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <ArrowRight className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
