import React, { useState, useEffect } from 'react';
import { Stage } from './types';
import { SilentAgreementScreen } from './components/SilentAgreementScreen';
import { PasswordGate } from './components/PasswordGate';
import { CinematicIntroSequence } from './components/CinematicIntroSequence';
import { EntryExperience } from './components/EntryExperience';
import { PreparationRitual } from './components/PreparationRitual';
import { Threshold } from './components/Threshold';
import { FirstConversation } from './components/FirstConversation';
import { AutobiographyReader } from './components/AutobiographyReader';
import { MomentsAndObservations } from './components/MomentsAndObservations';
import { ReflectionSpace } from './components/ReflectionSpace';
import { Farewell } from './components/Farewell';
import { InvisibleHeader } from './components/InvisibleHeader';
import { InteractiveBackground } from './components/InteractiveBackground';
import { AIAssistantModal } from './components/AIAssistantModal';
import { OpenWhenLettersModal } from './components/OpenWhenLettersModal';
import { PrinceQuizGame } from './components/PrinceQuizGame';
import { HeartMathModal } from './components/HeartMathModal';
import { Reasons100Modal } from './components/Reasons100Modal';
import { RosePetalShower } from './components/RosePetalShower';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles, Mail, Heart, Gift, Flower } from 'lucide-react';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('anvii_prince_unlocked') === 'true';
  });

  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return sessionStorage.getItem('anvii_prince_intro_played') !== 'true';
  });

  const [hasAgreedToRules, setHasAgreedToRules] = useState<boolean>(() => {
    return sessionStorage.getItem('anvii_prince_rules_agreed') === 'true';
  });

  const [stage, setStage] = useState<Stage>('ENTRY');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isOpenWhenOpen, setIsOpenWhenOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isHeartMathOpen, setIsHeartMathOpen] = useState(false);
  const [isReasonsOpen, setIsReasonsOpen] = useState(false);
  const [isRoseShowerActive, setIsRoseShowerActive] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);

  const isAnyModalOpen = isAIAssistantOpen || isOpenWhenOpen || isQuizOpen || isHeartMathOpen || isReasonsOpen || isRoseShowerActive || isStageModalOpen;

  // Scroll to top on stage change & reset stage modal state
  useEffect(() => {
    setIsStageModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage]);

  const handleUnlock = () => {
    sessionStorage.setItem('anvii_prince_unlocked', 'true');
    setIsUnlocked(true);
    setShowIntro(true);
  };

  const handleCompleteIntro = () => {
    sessionStorage.setItem('anvii_prince_intro_played', 'true');
    setShowIntro(false);
  };

  if (!isUnlocked) {
    if (!hasAgreedToRules) {
      return (
        <SilentAgreementScreen 
          onAgree={() => {
            sessionStorage.setItem('anvii_prince_rules_agreed', 'true');
            setHasAgreedToRules(true);
          }} 
        />
      );
    }
    return (
      <PasswordGate 
        onUnlock={handleUnlock} 
        onViewRules={() => setHasAgreedToRules(false)}
      />
    );
  }

  if (showIntro) {
    return <CinematicIntroSequence onComplete={handleCompleteIntro} />;
  }

  const renderStage = () => {
    switch (stage) {
      case 'ENTRY':
        return (
          <EntryExperience
            onContinue={() => setStage('PREPARATION')}
          />
        );
      case 'PREPARATION':
        return (
          <PreparationRitual
            onComplete={() => setStage('THRESHOLD')}
          />
        );
      case 'THRESHOLD':
        return (
          <Threshold
            onEnter={() => setStage('CONVERSATION')}
          />
        );
      case 'CONVERSATION':
        return (
          <FirstConversation
            onNextChapter={() => setStage('AUTOBIOGRAPHY')}
          />
        );
      case 'AUTOBIOGRAPHY':
        return (
          <AutobiographyReader 
            onStageChange={(st) => setStage(st)}
            onModalToggle={(open) => setIsStageModalOpen(open)}
          />
        );
      case 'MOMENTS':
        return (
          <MomentsAndObservations
            onCompleteMoments={() => setStage('REFLECTION')}
            onModalToggle={(open) => setIsStageModalOpen(open)}
          />
        );
      case 'REFLECTION':
        return (
          <ReflectionSpace
            onCompleteReflection={() => setStage('FAREWELL')}
            onModalToggle={(open) => setIsStageModalOpen(open)}
          />
        );
      case 'FAREWELL':
        return (
          <Farewell
            onRestart={() => setStage('ENTRY')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0b] text-[#e8e6e3] relative font-sans selection:bg-[#c9a87c]/30 selection:text-[#f4eae0] overflow-x-hidden">
      {/* Dynamic 3D Interactive Breathing Background Canvas */}
      <InteractiveBackground currentStage={stage} isModalOpen={isAnyModalOpen} />

      {/* Subtle Side HUD Frame Accents */}
      <div className={`fixed left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-[9px] tracking-[0.4em] uppercase text-white/70 pointer-events-none z-20 hidden lg:block transition-all duration-300 ${
        isAnyModalOpen ? 'opacity-0 invisible' : 'opacity-25'
      }`}>
        Prince
      </div>
      <div className={`fixed right-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[9px] tracking-[0.4em] uppercase text-white/70 pointer-events-none z-20 hidden lg:block transition-all duration-300 ${
        isAnyModalOpen ? 'opacity-0 invisible' : 'opacity-25'
      }`}>
        The Invisible Experience — For Anvii
      </div>

      {/* Header with quick navigation */}
      <InvisibleHeader
        currentStage={stage}
        onSelectStage={(newStage) => setStage(newStage)}
        onReplayIntro={() => setShowIntro(true)}
        onOpenLetters={() => setIsOpenWhenOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenHeartMath={() => setIsHeartMathOpen(true)}
        onOpenReasons={() => setIsReasonsOpen(true)}
        onTriggerRoseShower={() => setIsRoseShowerActive(true)}
        isHidden={isAnyModalOpen}
      />

      {/* Main Emotional Journey Container */}
      <main className="w-full min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-screen"
          >
            {renderStage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Control Hub */}
      <div className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 transition-all duration-300 ${
        isAnyModalOpen ? 'opacity-0 pointer-events-none invisible translate-y-4 scale-95' : 'opacity-100 pointer-events-auto translate-y-0 scale-100'
      }`}>
        <button
          onClick={() => setIsRoseShowerActive(true)}
          id="floating-rose-shower-btn"
          className="p-3 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 shadow-xl backdrop-blur-md transition-all cursor-pointer"
          title="Secret Rose Petal Shower (Type ANVII)"
        >
          <Flower className="w-4 h-4 text-rose-300" />
        </button>

        <button
          onClick={() => setIsReasonsOpen(true)}
          id="floating-reasons-btn"
          className="p-3 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 shadow-xl backdrop-blur-md transition-all cursor-pointer"
          title="100 Reasons Why Scratch-Card Deck"
        >
          <Gift className="w-4 h-4 text-amber-300" />
        </button>

        <button
          onClick={() => setIsHeartMathOpen(true)}
          id="floating-heart-math-btn"
          className="p-3 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-400/30 shadow-xl backdrop-blur-md transition-all cursor-pointer"
          title="Cardioid Flower Heart Math Animation"
        >
          <Heart className="w-4 h-4 fill-pink-300/50 text-pink-200" />
        </button>

        <button
          onClick={() => setIsOpenWhenOpen(true)}
          id="floating-open-when-btn"
          className="p-3 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 shadow-xl backdrop-blur-md transition-all cursor-pointer"
          title="Open When... Letters"
        >
          <Mail className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsQuizOpen(true)}
          id="floating-quiz-btn"
          className="p-3 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 shadow-xl backdrop-blur-md transition-all cursor-pointer"
          title="How Well Do You Know Prince Quiz"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsAIAssistantOpen(true)}
          id="floating-ai-assistant-btn"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-orange-500/90 to-amber-500/90 hover:from-orange-500 hover:to-amber-500 text-white font-sans text-xs tracking-wider font-medium shadow-2xl hover:shadow-orange-500/25 border border-white/20 transition-all duration-300 cursor-pointer backdrop-blur-md"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="hidden sm:inline">Ask Prince's AI Assistant</span>
          <span className="sm:hidden">Ask AI</span>
          <Sparkles className="w-3.5 h-3.5 text-orange-200 animate-pulse" />
        </button>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />

      {/* Open When Letters Modal */}
      <OpenWhenLettersModal
        isOpen={isOpenWhenOpen}
        onClose={() => setIsOpenWhenOpen(false)}
      />

      {/* Prince Quiz Game Modal */}
      <PrinceQuizGame
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      {/* Heart Math Video Animation Modal */}
      <HeartMathModal
        isOpen={isHeartMathOpen}
        onClose={() => setIsHeartMathOpen(false)}
      />

      {/* 100 Reasons Why Scratch-Card Deck Modal */}
      <Reasons100Modal
        isOpen={isReasonsOpen}
        onClose={() => setIsReasonsOpen(false)}
      />

      {/* Rose Petal Shower & Secret Easter Egg Listener */}
      <RosePetalShower
        isActive={isRoseShowerActive}
        onClose={() => setIsRoseShowerActive(false)}
        onTriggerShower={() => setIsRoseShowerActive(true)}
      />
    </div>
  );
}


