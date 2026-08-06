import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, 
  Heart, X, Feather
} from 'lucide-react';

export interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; isCorrect: boolean }[];
  explanation: string;
  princeComment: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Act I — Who I Was
  {
    id: 1,
    question: "What was consuming most of Prince's time before he failed Class 9?",
    options: [
      { label: "A) Cricket", isCorrect: false },
      { label: "B) Free Fire", isCorrect: true },
      { label: "C) YouTube", isCorrect: false },
      { label: "D) Free time with friends", isCorrect: false }
    ],
    explanation: "Before Class 9, Prince spent endless hours playing Free Fire on his phone until failing Class 9 became a turning point in his life.",
    princeComment: "Free Fire took away my time back then, but hitting rock bottom made me rebuild my life from scratch."
  },
  {
    id: 2,
    question: "What did Manushree tell Prince was the reason she didn't want to take things further?",
    options: [
      { label: "A) She liked someone else", isCorrect: false },
      { label: "B) Her parents said no", isCorrect: false },
      { label: "C) The whole school found out because he proposed publicly", isCorrect: true },
      { label: "D) She was moving away", isCorrect: false }
    ],
    explanation: "In Act I, Prince proposed publicly in school, causing the whole school to find out, which made Manushree pull back.",
    princeComment: "That taught me that genuine feelings should be handled with privacy and care, not public drama."
  },
  {
    id: 3,
    question: "How did Prince's father react the one time it actually mattered most — after the Class 9 failure?",
    options: [
      { label: "A) He hit him harder than usual", isCorrect: false },
      { label: "B) He didn't react at all", isCorrect: false },
      { label: "C) He didn't get angry, just talked to him calmly", isCorrect: true },
      { label: "D) He stopped talking to him for a week", isCorrect: false }
    ],
    explanation: "After failing Class 9, Prince's father didn't explode in anger; instead, he talked to him with calm disappointment and care.",
    princeComment: "My father's quiet composure in that moment hit me deeper than any harsh punishment ever could."
  },
  {
    id: 4,
    question: "What was the name of Prince's childhood \"girlfriend\" in 4th or 5th class, before he changed schools?",
    options: [
      { label: "A) Riya", isCorrect: false },
      { label: "B) Mahi", isCorrect: true },
      { label: "C) Pooja", isCorrect: false },
      { label: "D) Simran", isCorrect: false }
    ],
    explanation: "In Act I, Prince fondly recalls his childhood innocent friendship with Mahi in 4th/5th class before moving schools.",
    princeComment: "An innocent childhood memory from my early school days in Ahmedabad."
  },
  {
    id: 5,
    question: "What curriculum was Prince studying under during the two months between Class 9 and moving to Sikar?",
    options: [
      { label: "A) ICSE", isCorrect: false },
      { label: "B) State board", isCorrect: false },
      { label: "C) CBSE", isCorrect: true },
      { label: "D) IB", isCorrect: false }
    ],
    explanation: "During the transition period after Class 9, Prince spent two months studying under the CBSE curriculum before moving to Sikar.",
    princeComment: "Those two months laid the foundation for shifting my academic mindset."
  },

  // Act II — The Eight Months
  {
    id: 6,
    question: "What was Prince's actual Class 10 board percentage?",
    options: [
      { label: "A) 91%", isCorrect: false },
      { label: "B) 85%", isCorrect: false },
      { label: "C) 77%", isCorrect: true },
      { label: "D) 68%", isCorrect: false }
    ],
    explanation: "Prince scored 77% in his Class 10 board exams after dedicated preparation during those eight months.",
    princeComment: "Scoring 77% proved to myself that I could turn failure into steady growth."
  },
  {
    id: 7,
    question: "How far could Prince run the very first time he tried seriously?",
    options: [
      { label: "A) 1 km", isCorrect: false },
      { label: "B) 200 meters", isCorrect: true },
      { label: "C) 2 km", isCorrect: false },
      { label: "D) 500 meters", isCorrect: false }
    ],
    explanation: "When Prince first decided to run to build physical endurance, he gassed out after just 200 meters.",
    princeComment: "Starting at 200 meters taught me humility. Consistency did the rest."
  },
  {
    id: 8,
    question: "What was his final distance after the daily 2km jumps?",
    options: [
      { label: "A) 10 km", isCorrect: false },
      { label: "B) 15 km", isCorrect: false },
      { label: "C) 12 km", isCorrect: true },
      { label: "D) 8 km", isCorrect: false }
    ],
    explanation: "By gradually pushing his limits every day, Prince eventually reached a daily running distance of 12 km.",
    princeComment: "Going from 200 meters to 12 km proved that limits are mostly mental."
  },
  {
    id: 9,
    question: "What question did Prince start asking about successful people, instead of just admiring them?",
    options: [
      { label: "A) \"How much do they earn?\"", isCorrect: false },
      { label: "B) \"How did they become extraordinary?\"", isCorrect: true },
      { label: "C) \"Where did they study?\"", isCorrect: false },
      { label: "D) \"Who helped them?\"", isCorrect: false }
    ],
    explanation: "Prince shifted his mindset from passive admiration to asking how extraordinary people built their discipline and habits.",
    princeComment: "Understanding the underlying process is the key to building excellence."
  },
  {
    id: 10,
    question: "What happened to the friend Prince used to run with?",
    options: [
      { label: "A) He got injured", isCorrect: false },
      { label: "B) He moved away", isCorrect: false },
      { label: "C) He stopped coming, to focus on his studies", isCorrect: true },
      { label: "D) He joined a different sport", isCorrect: false }
    ],
    explanation: "His running partner eventually stopped coming in order to concentrate on his studies.",
    princeComment: "Even when running alone, I kept pushing my boundaries every single morning."
  },

  // Act III — Then You Entered My Story
  {
    id: 11,
    question: "What promise had Prince made to himself before ever meeting Anvii?",
    options: [
      { label: "A) To never leave Sikar", isCorrect: false },
      { label: "B) To not fall in love until his goals were built", isCorrect: true },
      { label: "C) To always score above 90%", isCorrect: false },
      { label: "D) To never argue with his father again", isCorrect: false }
    ],
    explanation: "Prince had resolved to focus exclusively on his mission and goals before letting anyone into his heart.",
    princeComment: "I built high walls around my focus, until meeting you quietly dismantled them."
  },
  {
    id: 12,
    question: "About how long after joining PCP (Prince Career Pioneer) did Prince first notice Anvii?",
    options: [
      { label: "A) A month", isCorrect: false },
      { label: "B) A week", isCorrect: true },
      { label: "C) A day", isCorrect: false },
      { label: "D) A semester", isCorrect: false }
    ],
    explanation: "Within just a week of joining PCP (Prince Career Pioneer), Prince first noticed Anvii's presence.",
    princeComment: "It took only a week at PCP for me to notice your quiet grace."
  },
  {
    id: 13,
    question: "What did Prince say actually attracted him to JEE, beyond it leading to IIT?",
    options: [
      { label: "A) His friends were all doing it", isCorrect: false },
      { label: "B) The nature of the journey itself — logical thinking, first principles, patience under pressure", isCorrect: true },
      { label: "C) It was the easiest path", isCorrect: false },
      { label: "D) His father chose it for him", isCorrect: false }
    ],
    explanation: "Prince fell in love with JEE's rigorous first-principles problem-solving approach rather than just the IIT brand.",
    princeComment: "The discipline of first-principles thinking shaped my entire software engineering philosophy."
  },
  {
    id: 14,
    question: "What batch did Prince join at PCP (Prince Career Pioneer)?",
    options: [
      { label: "A) Alpha", isCorrect: false },
      { label: "B) Omega", isCorrect: false },
      { label: "C) Sigma", isCorrect: true },
      { label: "D) Delta", isCorrect: false }
    ],
    explanation: "Prince was placed in the Sigma batch during his time at PCP (Prince Career Pioneer).",
    princeComment: "The Sigma batch classrooms at PCP were where our story quietly began."
  },

  // Act IV — The Person I Became
  {
    id: 15,
    question: "According to Prince, what's the actual difference between loneliness and solitude?",
    options: [
      { label: "A) There's no real difference", isCorrect: false },
      { label: "B) Loneliness is wanting someone beside you; solitude is being at peace even alone", isCorrect: true },
      { label: "C) Solitude is worse", isCorrect: false },
      { label: "D) Loneliness only happens at night", isCorrect: false }
    ],
    explanation: "In Act IV, Prince describes solitude as a peaceful, constructive state of mind, unlike loneliness which yearns for external presence.",
    princeComment: "Solitude gave me the space to master code, write my thoughts, and find inner strength."
  },
  {
    id: 16,
    question: "According to Prince, what actually happens to trust after enough small disappointments — not one big betrayal?",
    options: [
      { label: "A) It disappears instantly", isCorrect: false },
      { label: "B) It disappears little by little, through ordinary moments", isCorrect: true },
      { label: "C) It gets stronger", isCorrect: false },
      { label: "D) Nothing changes", isCorrect: false }
    ],
    explanation: "Prince noted that trust is rarely destroyed by a single event, but wears away silently through small, unaddressed disappointments.",
    princeComment: "Small moments matter most. Paying attention to details preserves trust."
  },
  {
    id: 17,
    question: "What question did Prince start asking about people who disappointed him, instead of \"why did this happen to me\"?",
    options: [
      { label: "A) \"How do I get revenge?\"", isCorrect: false },
      { label: "B) \"Why did they choose to do this?\"", isCorrect: true },
      { label: "C) \"Why me?\"", isCorrect: false },
      { label: "D) \"What did I do wrong?\"", isCorrect: false }
    ],
    explanation: "Instead of playing the victim, Prince sought to understand human motivations and choices objectively.",
    princeComment: "Seeking to understand why people act replaces anger with clarity."
  },

  // Act V — Our Story
  {
    id: 18,
    question: "What did Prince search for during Raksha Bandhan in 2025, without success?",
    options: [
      { label: "A) Her phone number", isCorrect: false },
      { label: "B) Her Instagram", isCorrect: true },
      { label: "C) Her home address", isCorrect: false },
      { label: "D) Her class schedule", isCorrect: false }
    ],
    explanation: "During Raksha Bandhan in 2025, Prince tried searching for Anvii's Instagram profile without success.",
    princeComment: "I searched quietly, hoping to reconnect after time had passed."
  },
  {
    id: 19,
    question: "What did the note he slipped into her bag actually say?",
    options: [
      { label: "A) \"I like you\"", isCorrect: false },
      { label: "B) \"Kal se piche baith jana\"", isCorrect: true },
      { label: "C) Nothing, it was blank", isCorrect: false },
      { label: "D) His phone number", isCorrect: false }
    ],
    explanation: "During an 8 PM night program at PCP, Prince slipped a small note into Anvii's bag saying 'Kal se piche baith jana'.",
    princeComment: "A simple 5-word note that became an unforgettable memory between us."
  },
  {
    id: 20,
    question: "What were the first two words Anvii sent once she recognized him?",
    options: [
      { label: "A) \"Who's this?\"", isCorrect: false },
      { label: "B) \"Oh hey\"", isCorrect: false },
      { label: "C) \"I remember\"", isCorrect: true },
      { label: "D) \"Nice to meet you\"", isCorrect: false }
    ],
    explanation: "When Anvii realized who was messaging her, her first two words were 'I remember'.",
    princeComment: "Hearing 'I remember' meant everything to me."
  },
  {
    id: 21,
    question: "Roughly how many times did Anvii block Prince over the course of their story?",
    options: [
      { label: "A) Three", isCorrect: false },
      { label: "B) About ten", isCorrect: false },
      { label: "C) More than twenty", isCorrect: true },
      { label: "D) Just once", isCorrect: false }
    ],
    explanation: "Throughout their complex communication history, Anvii blocked Prince more than twenty times on messaging apps.",
    princeComment: "Over 20+ blocks occurred, but my commitment to honest communication never wavered."
  },
  {
    id: 22,
    question: "What did she say to him on July 12th when he tried to get her attention?",
    options: [
      { label: "A) \"Main nahi aa rahi\"", isCorrect: true },
      { label: "B) \"Abhi nahi\"", isCorrect: false },
      { label: "C) She didn't respond", isCorrect: false },
      { label: "D) \"Kal milte hai\"", isCorrect: false }
    ],
    explanation: "On July 12th, when Prince reached out, Anvii responded with 'Main nahi aa rahi'.",
    princeComment: "A moment of direct rejection that made me pause and reflect deeply on my approach."
  },
  {
    id: 23,
    question: "Who sent Prince Anvii's Instagram ID?",
    options: [
      { label: "A) A teacher", isCorrect: false },
      { label: "B) Dev", isCorrect: true },
      { label: "C) His brother", isCorrect: false },
      { label: "D) Anvii herself", isCorrect: false }
    ],
    explanation: "It was Dev who eventually provided Prince with Anvii's Instagram handle.",
    princeComment: "Dev helped bridge the gap when I was trying to find a way to reach out."
  },
  {
    id: 24,
    question: "Whose phone was Prince's Instagram account actually logged into when he first messaged Anvii?",
    options: [
      { label: "A) His own", isCorrect: false },
      { label: "B) Dev's", isCorrect: true },
      { label: "C) His brother's", isCorrect: false },
      { label: "D) It wasn't logged in anywhere", isCorrect: false }
    ],
    explanation: "Prince's Instagram account was logged into Dev's phone when he sent those initial messages.",
    princeComment: "A quirky detail of how those initial messages were dispatched."
  },
  {
    id: 25,
    question: "What did Anvii guess when Prince asked her to guess three words?",
    options: [
      { label: "A) \"Do you like me?\"", isCorrect: false },
      { label: "B) \"Are you like me?\"", isCorrect: true },
      { label: "C) \"Kaun ho tum?\"", isCorrect: false },
      { label: "D) She refused to guess", isCorrect: false }
    ],
    explanation: "When Prince challenged Anvii to guess three words, she guessed 'Are you like me?'.",
    princeComment: "Your guess showed how perceptive you were from the very start."
  },
  {
    id: 26,
    question: "Why did Prince take screenshots of their conversations, leading to the first block?",
    options: [
      { label: "A) To show his friends", isCorrect: false },
      { label: "B) Because he deletes chats often and wanted to preserve the memories", isCorrect: true },
      { label: "C) For evidence", isCorrect: false },
      { label: "D) By accident", isCorrect: false }
    ],
    explanation: "Prince habitually clears chat histories, so he saved screenshots purely to preserve memories of their conversations.",
    princeComment: "I saved those screenshots out of genuine sentiment, even though it led to a misunderstanding."
  },
  {
    id: 27,
    question: "What did Prince's father ask him, half-joking, about marrying \"Sikar mein hi\"?",
    options: [
      { label: "A) \"Sikar mein hi shaadi karni hai kya?\"", isCorrect: true },
      { label: "B) \"Kab shaadi karoge?\"", isCorrect: false },
      { label: "C) He never asked", isCorrect: false },
      { label: "D) \"Anvii kaun hai?\"", isCorrect: false }
    ],
    explanation: "Prince's father half-jokingly asked him 'Sikar mein hi shaadi karni hai kya?'.",
    princeComment: "A lighthearted moment with my father that surprised me at the time."
  },
  {
    id: 28,
    question: "What did Prince jokingly offer Anvii when she said she didn't have a house?",
    options: [
      { label: "A) To buy her one", isCorrect: false },
      { label: "B) To let her live at his place, with rent and a discount", isCorrect: true },
      { label: "C) Nothing, he changed the subject", isCorrect: false },
      { label: "D) To build her a Future City", isCorrect: false }
    ],
    explanation: "When Anvii mentioned not having a house, Prince jokingly offered to rent her space at his place with a discount.",
    princeComment: "A humorous banter memory that made both of us smile."
  },

  // Act VI — Who I Am Today
  {
    id: 29,
    question: "What does Prince say is actually harder for him than feeling something deeply?",
    options: [
      { label: "A) Thinking clearly", isCorrect: false },
      { label: "B) Expressing it", isCorrect: true },
      { label: "C) Forgetting it", isCorrect: false },
      { label: "D) Admitting he's wrong", isCorrect: false }
    ],
    explanation: "In Act VI, Prince admits that while he feels emotions with intense depth, putting them into words is his true challenge.",
    princeComment: "Expressing feelings verbally was hard for me—which is why I built this website to write them out completely."
  },
  {
    id: 30,
    question: "According to Prince, what does he ask instead of \"who made the mistake\" when something goes wrong?",
    options: [
      { label: "A) \"Who should apologize?\"", isCorrect: false },
      { label: "B) \"What system allowed this to happen?\"", isCorrect: true },
      { label: "C) \"How do I punish this?\"", isCorrect: false },
      { label: "D) \"Was it intentional?\"", isCorrect: false }
    ],
    explanation: "Prince adopts an engineering root-cause mindset, looking at systemic causes rather than personal fault.",
    princeComment: "Fixing systems prevents repeat mistakes and builds reliable processes."
  },
  {
    id: 31,
    question: "What does Prince say scares him more than an ordinary failure?",
    options: [
      { label: "A) Being poor", isCorrect: false },
      { label: "B) Never reaching what he was actually capable of becoming", isCorrect: true },
      { label: "C) Being alone", isCorrect: false },
      { label: "D) Public embarrassment", isCorrect: false }
    ],
    explanation: "Prince's deepest fear is falling short of his potential and living an unfulfilled, average existence.",
    princeComment: "The fear of unfulfilled potential drives my work ethic every day."
  },

  // Act VII — The Truth I Never Told You
  {
    id: 32,
    question: "What does Prince say was the real reason he sometimes pushed Anvii away?",
    options: [
      { label: "A) He'd stopped caring", isCorrect: false },
      { label: "B) His friends told him to", isCorrect: false },
      { label: "C) He was hoping it would make his own heart stop loving her, so his focus would return", isCorrect: true },
      { label: "D) He was testing her loyalty", isCorrect: false }
    ],
    explanation: "In Act VII, Prince confesses that pushing her away was a desperate attempt to protect his focus and mute his feelings.",
    princeComment: "It was a misguided attempt to guard my heart, which I deeply regret."
  },
  {
    id: 33,
    question: "According to Prince, what does he say true intentions can'erase?",
    options: [
      { label: "A) Time", isCorrect: false },
      { label: "B) Pain", isCorrect: true },
      { label: "C) Memory", isCorrect: false },
      { label: "D) Trust", isCorrect: false }
    ],
    explanation: "Prince realizes that good intentions do not nullify the real emotional pain caused by missteps.",
    princeComment: "Acknowledging pain is necessary, no matter how good my intentions were."
  },
  {
    id: 34,
    question: "What does Prince say marriage would actually be, if Anvii chose him — not the finish line?",
    options: [
      { label: "A) A formality", isCorrect: false },
      { label: "B) The starting line", isCorrect: true },
      { label: "C) A reward", isCorrect: false },
      { label: "D) An obligation", isCorrect: false }
    ],
    explanation: "Prince views marriage as the starting line of a shared lifelong journey of growth and partnership.",
    princeComment: "It's not an achievement trophy; it's the beginning of building a life together."
  },

  // Act VIII — The Mission
  {
    id: 35,
    question: "What does Prince say money actually is, to him — not the goal itself?",
    options: [
      { label: "A) A prize", isCorrect: false },
      { label: "B) Infrastructure", isCorrect: true },
      { label: "C) A distraction", isCorrect: false },
      { label: "D) Proof of success", isCorrect: false }
    ],
    explanation: "To Prince, money is essential infrastructure and leverage to build scale, compute, and physical systems for humanity.",
    princeComment: "Capital is fuel for engineering and civilizational progress."
  },
  {
    id: 36,
    question: "Why did Prince first imagine Future City on the coast of Gujarat?",
    options: [
      { label: "A) Cheapest land", isCorrect: false },
      { label: "B) Government incentives", isCorrect: false },
      { label: "C) It's home", isCorrect: true },
      { label: "D) Best weather", isCorrect: false }
    ],
    explanation: "Prince envisioned building Future City along the Gujarat coast because it represents his roots and homeland.",
    princeComment: "Gujarat is where my roots lie, and where my vision for Future City takes root."
  },
  {
    id: 37,
    question: "What question does Prince say guides almost every long-term decision he makes?",
    options: [
      { label: "A) \"How much will this cost?\"", isCorrect: false },
      { label: "B) \"How many people's lives become better because I existed?\"", isCorrect: true },
      { label: "C) \"Will this make me famous?\"", isCorrect: false },
      { label: "D) \"What will people think?\"", isCorrect: false }
    ],
    explanation: "Prince evaluates decisions based on whether they leave a net positive impact on human lives.",
    princeComment: "Measuring life by positive human impact gives meaning to every effort."
  },
  {
    id: 38,
    question: "What does Prince say his greatest regret would be — more than failure itself?",
    options: [
      { label: "A) Not making enough money", isCorrect: false },
      { label: "B) Never attempting the impossible at all", isCorrect: true },
      { label: "C) Not finishing JEE", isCorrect: false },
      { label: "D) Losing touch with friends", isCorrect: false }
    ],
    explanation: "Prince fears timid comfort more than noble failure—he would rather attempt the impossible and fail than never try.",
    princeComment: "Daring to attempt the impossible is the only way humanity moves forward."
  },

  // Act IX — The Letter
  {
    id: 39,
    question: "What does Prince say the website actually became, more than an attempt to win Anvii back?",
    options: [
      { label: "A) A business pitch", isCorrect: false },
      { label: "B) The most honest thing he's ever written about himself", isCorrect: true },
      { label: "C) A dating profile", isCorrect: false },
      { label: "D) A legal document", isCorrect: false }
    ],
    explanation: "This application evolved into Prince's most transparent, unedited reflection on his life, character, and journey.",
    princeComment: "Every word here was written with total sincerity and zero pretense."
  },
  {
    id: 40,
    question: "What does Prince say happened to him, without Anvii even trying, that makes her \"special\" regardless of how anything ends?",
    options: [
      { label: "A) She got him better marks", isCorrect: false },
      { label: "B) She changed the direction of his life", isCorrect: true },
      { label: "C) She introduced him to his friends", isCorrect: false },
      { label: "D) She taught him a new language", isCorrect: false }
    ],
    explanation: "Simply by existing in his life, Anvii permanently altered Prince's trajectory toward growth, maturity, and purpose.",
    princeComment: "You altered my trajectory forever, and for that, I am endlessly grateful."
  }
];

interface PrinceQuizGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrinceQuizGame: React.FC<PrinceQuizGameProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (currentQ.options[idx].isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowExplanation(false);
    setIsCompleted(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="prince-quiz-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-2xl bg-[#0f0f13] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg text-white font-medium">How Well Do You Know Prince?</h2>
                <p className="text-xs font-sans text-white/50">A romantic & fun interactive 40-question quiz for Anvii</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8">
            {!isCompleted ? (
              <div className="space-y-6">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-white/60 font-sans">
                  <span>Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span className="text-orange-300 font-medium">Score: {score}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <h3 className="font-serif text-lg md:text-xl text-white font-light leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    let btnStyle = "bg-white/[0.04] border-white/10 hover:border-orange-400/50 text-white/90";
                    
                    if (showExplanation) {
                      if (option.isCorrect) {
                        btnStyle = "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-medium";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-500/20 border-rose-400 text-rose-200";
                      } else {
                        btnStyle = "bg-white/[0.02] border-white/5 text-white/40";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={showExplanation}
                        className={`w-full text-left p-4 rounded-2xl border text-xs md:text-sm font-sans transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{option.label}</span>
                        {showExplanation && option.isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                        {showExplanation && isSelected && !option.isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-orange-500/10 border border-orange-400/30 space-y-2 text-xs md:text-sm font-sans"
                  >
                    <p className="text-white/90 leading-relaxed">{currentQ.explanation}</p>
                    <p className="text-orange-200 font-serif italic text-xs pt-1">
                      "{currentQ.princeComment}" — Prince
                    </p>

                    <div className="pt-3 flex justify-end">
                      <button
                        onClick={handleNext}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-sans text-xs tracking-wider uppercase font-medium cursor-pointer"
                      >
                        <span>{currentIndex + 1 === QUIZ_QUESTIONS.length ? "See My Result" : "Next Question"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Completion Certificate View */
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/30 to-rose-500/30 p-1 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#0f0f13] flex items-center justify-center">
                    <Award className="w-10 h-10 text-orange-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-sans uppercase tracking-widest text-orange-300 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/30">
                    Certificate of Closeness
                  </span>
                  <h3 className="font-serif text-2xl text-white font-light">
                    You scored {score} / {QUIZ_QUESTIONS.length}
                  </h3>
                  <p className="text-xs text-white/70 max-w-md mx-auto font-sans leading-relaxed">
                    {score >= 35 
                      ? "Unbelievable score! You understand Prince's journey, values, and story with profound depth."
                      : "Thank you for taking the time to read through Prince's life story with such care."}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto text-center space-y-2 font-serif text-sm italic text-orange-200/90">
                  <Feather className="w-5 h-5 mx-auto text-orange-300" />
                  <p>
                    "Knowing someone isn't about memorizing facts—it's about understanding why they choose truth over silence."
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-orange-100 fill-orange-100/40" />
                    <span>Return to Room</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
