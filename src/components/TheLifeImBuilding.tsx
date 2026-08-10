import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Brain,
  Compass,
  Target,
  Clock,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Shield,
  Eye,
  Filter,
  FlipHorizontal,
  HeartHandshake,
  MessageSquare,
  Flame,
  UserCheck,
  Presentation,
  Lightbulb,
  Users,
  VolumeX,
  Dumbbell,
  ShieldAlert,
  Sun,
  Repeat,
  Globe,
  Cpu,
  Anchor,
  BookOpen,
  Trophy,
  Maximize2,
  X,
  Search,
  Check,
  Lock,
  Unlock,
  Key,
  EyeOff
} from 'lucide-react';

interface OSCard {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  whyItMatters: string;
  realLifeImpact: string;
  category: 'Mindset' | 'Self-Mastery' | 'Social & Leadership' | 'Execution';
}

const OS_CARDS: OSCard[] = [
  {
    id: 'os-1',
    name: 'Treating Extraordinary People as Case Studies',
    icon: UserCheck,
    category: 'Mindset',
    description: 'Instead of admiring successful people... study them. Questions become: How did they think? How did they build discipline? Which habits repeated? What systems made success inevitable?',
    whyItMatters: 'Deconstructs passive awe into actionable, repeatable engineering models.',
    realLifeImpact: 'Turning admiration into repeatable learning.'
  },
  {
    id: 'os-2',
    name: 'Self-Talk & Metacognition',
    icon: Brain,
    category: 'Self-Mastery',
    description: 'Learning to observe my own thinking. Questioning assumptions. Correcting myself before the world has to.',
    whyItMatters: 'Prevents emotional drift, self-deception, and unexamined impulses.',
    realLifeImpact: 'Building self-awareness instead of self-deception.'
  },
  {
    id: 'os-3',
    name: 'Extracting Value From Criticism',
    icon: Filter,
    category: 'Self-Mastery',
    description: 'Instead of asking "Who said it?", ask "Is there something useful inside it?"',
    whyItMatters: 'Protects personal evolution from being blinded by defensive pride.',
    realLifeImpact: 'Growth becomes more important than ego.'
  },
  {
    id: 'os-4',
    name: 'Observation at Peak Detail',
    icon: Eye,
    category: 'Mindset',
    description: 'Observe words. Tone. Patterns. Body language. Silence. Behavior over time.',
    whyItMatters: 'Actions and subtle non-verbal cues reveal truth far deeper than rehearsed statements.',
    realLifeImpact: 'Understanding people beyond what they say.'
  },
  {
    id: 'os-5',
    name: 'Mirror & Filter Method',
    icon: FlipHorizontal,
    category: 'Self-Mastery',
    description: 'Every person becomes both a teacher and a warning. Copy good habits. Remove bad habits. Ask daily: "Do I also have this weakness?"',
    whyItMatters: 'Uses every human interaction as an active mirror for continuous self-audit.',
    realLifeImpact: 'Accelerated refinement without needing personal trial-and-error failures.'
  },
  {
    id: 'os-6',
    name: 'Constructive Overthinking',
    icon: Sparkles,
    category: 'Mindset',
    description: 'Instead of worrying... build. Imagine. Design. Write ideas. Create systems. Turn imagination into reality.',
    whyItMatters: 'Channels hyperactive mental energy into tangible systems rather than useless anxiety.',
    realLifeImpact: 'Turning imaginative depth into real-world architecture.'
  },
  {
    id: 'os-7',
    name: 'Empathetic Perspective Taking',
    icon: HeartHandshake,
    category: 'Social & Leadership',
    description: 'Before judging anyone... pause. Ask "What does this look like from their side?"',
    whyItMatters: 'De-escalates unnecessary conflict and opens genuine emotional clarity.',
    realLifeImpact: 'Less judgment. More understanding.'
  },
  {
    id: 'os-8',
    name: 'Communication',
    icon: MessageSquare,
    category: 'Social & Leadership',
    description: 'Learning to express thoughts clearly. Listening before speaking. Understanding before answering.',
    whyItMatters: 'Replaces noise and misunderstandings with surgical precision and active presence.',
    realLifeImpact: 'Deep clarity, mutual respect, and zero unspoken friction.'
  },
  {
    id: 'os-9',
    name: 'Expression',
    icon: Flame,
    category: 'Social & Leadership',
    description: 'Learning to communicate emotions honestly. Without fear. Without pretending.',
    whyItMatters: 'Performance builds walls; quiet vulnerability creates unbreakable trust.',
    realLifeImpact: 'Raw, authentic human connection.'
  },
  {
    id: 'os-10',
    name: 'Challenge Myself Daily',
    icon: Zap,
    category: 'Execution',
    description: 'Every day should contain something uncomfortable. Growth lives there.',
    whyItMatters: 'Comfort is a slow poison for potential; friction expands capacity.',
    realLifeImpact: 'Expanding mental and physical limits through voluntary hardship.'
  },
  {
    id: 'os-11',
    name: 'Find Weaknesses',
    icon: Target,
    category: 'Self-Mastery',
    description: 'Search for flaws before life exposes them.',
    whyItMatters: 'Proactive internal auditing prevents catastrophic real-world collapses.',
    realLifeImpact: 'Systematically eliminating blind spots before they hurt.'
  },
  {
    id: 'os-12',
    name: 'Self Dependence',
    icon: Shield,
    category: 'Self-Mastery',
    description: 'Become emotionally, mentally, financially, and intellectually independent.',
    whyItMatters: 'True freedom requires taking 100% responsibility for your own state.',
    realLifeImpact: 'Standing firmly on your own foundation regardless of external turbulence.'
  },
  {
    id: 'os-13',
    name: 'Decision Speed',
    icon: Clock,
    category: 'Execution',
    description: 'Think deeply. Decide quickly.',
    whyItMatters: 'Over-analysis leads to paralysis; rapid execution produces real feedback.',
    realLifeImpact: 'High-velocity execution paired with strategic rigor.'
  },
  {
    id: 'os-14',
    name: 'Influence',
    icon: Compass,
    category: 'Social & Leadership',
    description: 'Not manipulation. Positive leadership. Helping groups move toward better decisions.',
    whyItMatters: 'Authentic leadership serves the outcome, not personal ego.',
    realLifeImpact: 'Guiding collective energy toward noble, high-impact goals.'
  },
  {
    id: 'os-15',
    name: 'Representation',
    icon: Presentation,
    category: 'Social & Leadership',
    description: 'Learning how to communicate ideas beautifully. Presentations. Storytelling. Writing. Speaking.',
    whyItMatters: 'Great ideas die in silence if they cannot be articulated with power.',
    realLifeImpact: 'Inspiring others through compelling vision and clear narrative.'
  },
  {
    id: 'os-16',
    name: 'Creativity',
    icon: Lightbulb,
    category: 'Mindset',
    description: 'Building instead of copying. Original thinking. Original systems.',
    whyItMatters: 'Derivative thinking yields average results; first-principles design creates breakthroughs.',
    realLifeImpact: 'Crafting unique solutions built from scratch.'
  },
  {
    id: 'os-17',
    name: 'Strategy',
    icon: Layers,
    category: 'Execution',
    description: 'Thinking several moves ahead. Planning before acting.',
    whyItMatters: 'Action without long-term foresight is just wasted momentum.',
    realLifeImpact: 'Executing daily tasks aligned with a multi-year horizon.'
  },
  {
    id: 'os-18',
    name: 'Psychology & Human Behavior',
    icon: Users,
    category: 'Social & Leadership',
    description: 'Understanding why people behave the way they do. Not simply what they do.',
    whyItMatters: 'Decouples emotional reaction from underlying human motivations.',
    realLifeImpact: 'Deep empathy, foresight, and emotional intelligence.'
  },
  {
    id: 'os-19',
    name: 'Silent Killer',
    icon: VolumeX,
    category: 'Execution',
    description: 'Calm. Prepared. Consistent. Results speak louder than announcements.',
    whyItMatters: 'Public noise creates unnecessary expectation and ego; stealth work yields proof.',
    realLifeImpact: 'Shocking the world with finished results rather than empty claims.'
  },
  {
    id: 'os-20',
    name: 'Enjoying Pain',
    icon: Dumbbell,
    category: 'Execution',
    description: 'Seek discomfort intentionally. Daily. Growth rarely feels comfortable.',
    whyItMatters: 'Reframing physical and mental strain as the active sensation of leveling up.',
    realLifeImpact: 'Developing an unshakeable appetite for hard, grueling effort.'
  },
  {
    id: 'os-21',
    name: 'Courage',
    icon: ShieldAlert,
    category: 'Self-Mastery',
    description: 'Doing difficult things despite fear.',
    whyItMatters: 'Fear points directly toward the next crucial threshold of personal growth.',
    realLifeImpact: 'Stepping forward precisely when everything inside hesitates.'
  },
  {
    id: 'os-22',
    name: 'Liveliness',
    icon: Sun,
    category: 'Mindset',
    description: 'Keeping curiosity alive. Energy. Wonder. Joy.',
    whyItMatters: 'Rigid discipline without joy leads to burnout; enthusiasm fuels long journeys.',
    realLifeImpact: 'Radiating infectious energy and lifelong wonder for existence.'
  },
  {
    id: 'os-23',
    name: 'Determination',
    icon: Repeat,
    category: 'Execution',
    description: 'Continue after failure. Again. Again. Again.',
    whyItMatters: 'Failure is not an outcome; it is raw telemetry for the next iteration.',
    realLifeImpact: 'Relentless persistence until the objective is secured.'
  },
  {
    id: 'os-24',
    name: 'Social Adaptability',
    icon: Globe,
    category: 'Social & Leadership',
    description: 'Learning to connect with different personalities. Different cultures. Different environments.',
    whyItMatters: 'Universal adaptability allows seamless functioning anywhere in the world.',
    realLifeImpact: 'Building bridges across diverse minds and spaces.'
  },
  {
    id: 'os-25',
    name: 'Effective Intelligence',
    icon: Cpu,
    category: 'Mindset',
    description: 'Not collecting knowledge. Applying it.',
    whyItMatters: 'Theoretical knowledge without practical application is dead weight.',
    realLifeImpact: 'Converting ideas into real-world working systems.'
  },
  {
    id: 'os-26',
    name: 'Influencing Groups',
    icon: Users,
    category: 'Social & Leadership',
    description: 'Understanding leadership. Communication. Trust. Responsibility.',
    whyItMatters: 'Mobilizing collective effort requires unquestionable integrity and shared vision.',
    realLifeImpact: 'Unifying people toward ambitious, meaningful accomplishments.'
  },
  {
    id: 'os-27',
    name: 'Discipline',
    icon: Anchor,
    category: 'Execution',
    description: 'Doing the work whether motivation exists or not.',
    whyItMatters: 'Motivation is an unreliable feeling; discipline is non-negotiable habit.',
    realLifeImpact: 'Uncompromising daily execution regardless of mood or weather.'
  }
];

interface LearningSubject {
  title: string;
  category: string;
  description: string;
  keyConcepts: string[];
}

const LEARNING_ROADMAP: LearningSubject[] = [
  {
    title: 'Business',
    category: 'Value Creation',
    description: 'Understanding business models, unit economics, value exchange, distribution networks, and durable competitive moats.',
    keyConcepts: ['First-Principles Economics', 'Product-Market Fit', 'Scalable Operations', 'Moats & Margins']
  },
  {
    title: 'Artificial Intelligence',
    category: 'System Architectures',
    description: 'Mastering LLM orchestration, neural architectures, autonomous agent workflows, multimodal models, and AI-driven human augmentation.',
    keyConcepts: ['Deep Neural Networks', 'Agentic Workflows', 'Transformers', 'Reinforcement Learning']
  },
  {
    title: 'History',
    category: 'Human Patterns',
    description: 'Studying civilization rises and falls, technological revolutions, empire dynamics, and historical cycles to anticipate the future.',
    keyConcepts: ['Industrial Revolutions', 'Geopolitical Cycles', 'Civilization Lifecycles', 'Biographies of Pioneers']
  },
  {
    title: 'Geography',
    category: 'Spatial Dynamics',
    description: 'Understanding trade routes, natural resource distributions, urban geography, demographic shifts, and regional power hubs.',
    keyConcepts: ['Geopolitics', 'Resource Topography', 'Urban Planning', 'Climate & Migration']
  },
  {
    title: 'Political Science',
    category: 'Governance & Power',
    description: 'Analyzing institutional structures, statecraft, policy frameworks, governance design, and civic social contracts.',
    keyConcepts: ['Statecraft & Diplomacy', 'Constitutional Law', 'Public Policy', 'Institutional Incentives']
  },
  {
    title: 'Economics',
    category: 'Resource Allocation',
    description: 'Micro/macroeconomics, monetary policy, global supply chains, game theory, market dynamics, and wealth creation mechanics.',
    keyConcepts: ['Game Theory', 'Monetary Policy', 'Incentive Structure', 'Capital Efficiency']
  },
  {
    title: 'Law',
    category: 'Rule Systems',
    description: 'Legal reasoning, corporate structure, IP law, regulatory compliance, contract theory, and rule-based governance.',
    keyConcepts: ['Contract Philosophy', 'Intellectual Property', 'Corporate Law', 'Jurisprudence']
  },
  {
    title: 'Systems Thinking',
    category: 'Meta Architecture',
    description: 'Deconstructing complex non-linear feedback loops, emergent properties, leverage points, and systemic bottleneck resolution.',
    keyConcepts: ['Feedback Loops', 'Leverage Points', 'Bottleneck Identification', 'Emergence']
  },
  {
    title: 'Human Behavior',
    category: 'Social Dynamics',
    description: 'Observing micro-behaviors, evolutionary drives, group dynamics, cognitive biases, and non-verbal communication signals.',
    keyConcepts: ['Cognitive Biases', 'Evolutionary Drives', 'Social Dynamics', 'Behavioral Economics']
  },
  {
    title: 'Psychology',
    category: 'Internal Mechanics',
    description: 'Understanding subconscious motivations, emotional regulation, trauma mechanics, habit loops, and peak human performance.',
    keyConcepts: ['Subconscious Mind', 'Habit Loops', 'Emotional Regulation', 'Neuroplasticity']
  },
  {
    title: 'Sales',
    category: 'Persuasion & Value',
    description: 'Communication of value, active listening, overcoming friction, building genuine rapport, and closing commitments.',
    keyConcepts: ['Value Communication', 'Objection Handling', 'Empathy in Sales', 'Win-Win Dealmaking']
  },
  {
    title: 'Fundraising',
    category: 'Capital Orchestration',
    description: 'Pitching moonshot visions, investor relations, capital allocation strategy, venture mechanics, and equity structuring.',
    keyConcepts: ['Venture Capital', 'Pitch Mastery', 'Capital Structure', 'Investor Psychology']
  },
  {
    title: 'Communication',
    category: 'Clarity & Connection',
    description: 'Precision writing, public speaking, non-verbal presence, active listening, and friction-free dialogue.',
    keyConcepts: ['Precision Writing', 'Active Listening', 'Public Address', 'Rhetoric & Logic']
  },
  {
    title: 'Leadership',
    category: 'Vision & Accountability',
    description: 'Inspiring high-performing teams, setting culture, taking extreme ownership, and making tough decisions under pressure.',
    keyConcepts: ['Extreme Ownership', 'Culture Setting', 'Crisis Management', 'Decisive Direction']
  },
  {
    title: 'Negotiation',
    category: 'Strategic Alignment',
    description: 'Game theory in practice, principled negotiation, hostage negotiation principles, and creative win-win deal architecture.',
    keyConcepts: ['Tactical Empathy', 'BATNA Architecture', 'Win-Win Alignment', 'Friction Minimization']
  },
  {
    title: 'Design',
    category: 'Aesthetic Functionality',
    description: 'UI/UX precision, visual hierarchy, spatial composition, industrial design, typography, and human-centered design principles.',
    keyConcepts: ['Typography & Hierarchy', 'Spatial Proportion', 'UX Friction Loss', 'Design Systems']
  },
  {
    title: 'Technology',
    category: 'Substrate & Infrastructure',
    description: 'Software engineering, cloud infrastructure, distributed systems, silicon architectures, and technological evolution.',
    keyConcepts: ['Distributed Systems', 'Software Craft', 'Full-Stack Architecture', 'Compute Infrastructure']
  },
  {
    title: 'Future Civilizations',
    category: 'Long-Term Horizon',
    description: 'Designing autonomous cities, renewable energy grids, planetary engineering, space exploration, and post-scarcity societies.',
    keyConcepts: ['Autonomous Urban Design', 'Energy Substrates', 'Interplanetary Systems', 'Multi-Generational Vision']
  }
];

export const TheLifeImBuilding: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('the_life_im_building_unlocked') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [activeMilestone, setActiveMilestone] = useState<string>('today');
  const [selectedOSCard, setSelectedOSCard] = useState<OSCard | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [searchOS, setSearchOS] = useState<string>('');
  const [filterOSCategory, setFilterOSCategory] = useState<string>('All');

  // Days since restart live calculator
  const [daysElapsed, setDaysElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const handleUnlockSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'Prince_Anvii') {
      setIsUnlocked(true);
      sessionStorage.setItem('the_life_im_building_unlocked', 'true');
      setPasswordError('');
      setPasswordInput('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleLockSection = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('the_life_im_building_unlocked');
  };

  useEffect(() => {
    // Restart anchor date
    const restartDate = new Date('2026-08-01T00:00:00Z');

    const updateTimer = () => {
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - restartDate.getTime());
      
      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      setDaysElapsed({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredOSCards = OS_CARDS.filter((card) => {
    const matchesCategory = filterOSCategory === 'All' || card.category === filterOSCategory;
    const matchesSearch =
      card.name.toLowerCase().includes(searchOS.toLowerCase()) ||
      card.description.toLowerCase().includes(searchOS.toLowerCase()) ||
      card.realLifeImpact.toLowerCase().includes(searchOS.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToMilestone = (id: string) => {
    setActiveMilestone(id);
    const element = document.getElementById(`milestone-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isUnlocked) {
    return (
      <div className="w-full max-w-xl mx-auto py-12 px-4 text-center space-y-8 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-orange-400/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6 text-center"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Lock Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-200 shadow-inner">
            <Lock className="w-8 h-8 text-orange-300 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/30 text-orange-200 text-[11px] font-mono tracking-widest uppercase">
              <Shield className="w-3.5 h-3.5 text-orange-300" />
              <span>PROTECTED SECTION</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
              The Life I'm <span className="italic text-orange-200">Building</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto font-light leading-relaxed">
              This section contains Prince's future roadmap, 27 OS habits, and 5 & 9-month missions. Enter password to unlock.
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleUnlockSection} className="space-y-4 max-w-sm mx-auto pt-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Enter password..."
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm placeholder-white/40 focus:outline-none focus:border-orange-400 transition-all font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/80 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {passwordError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-400 font-mono"
              >
                {passwordError}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500/80 via-amber-500/80 to-rose-500/80 hover:from-orange-500 hover:to-rose-500 text-white font-sans text-xs tracking-widest uppercase font-semibold cursor-pointer shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Unlock Section</span>
              <Unlock className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </form>

          <p className="text-[11px] text-white/40 italic font-serif">
            Password: <span className="font-mono text-orange-200/80">Prince_Anvii</span>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-20 py-8 text-[#e8e6e3] font-sans">
      {/* 1. CINEMATIC INTRODUCTION */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-8 relative pt-6"
      >
        {/* Top pill & Re-lock button */}
        <div className="inline-flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-orange-200/90 text-xs tracking-widest uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-200" />
            <span>The Life I'm Building • Horizon Protocol</span>
          </div>

          <button
            onClick={handleLockSection}
            className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Re-lock this section"
          >
            <Lock className="w-3 h-3 text-rose-300" />
            <span>Lock</span>
          </button>
        </div>

        {/* Large Cinematic Title */}
        <div className="space-y-3">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-tight leading-none">
            The Life I'm <span className="italic font-serif text-orange-200">Building</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm md:text-base text-white/60 max-w-2xl mx-auto tracking-wide font-light leading-relaxed">
            "This section isn't about who I was. It's about who I'm choosing to become from this moment onward."
          </p>
        </div>

        {/* Manifesto Intro Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-left space-y-4"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <p className="text-sm md:text-base text-white/85 leading-relaxed font-light">
            You may or may not choose to walk beside me after reading everything.
            <br />
            <span className="text-orange-200 font-medium">That decision is completely yours.</span>
          </p>
          
          <p className="text-sm md:text-base text-white/85 leading-relaxed font-light">
            But regardless of the answer...
            <br />
            <span className="text-white font-normal">my journey doesn't stop here. This is where it begins again.</span>
          </p>

          <p className="text-xs sm:text-sm text-white/70 italic font-serif leading-relaxed border-l-2 border-orange-300/40 pl-4 py-1">
            Not because I forgot the past.
            <br />
            Because I finally understood it.
          </p>

          <div className="pt-2 text-xs sm:text-sm text-white/80 space-y-1 font-light border-t border-white/10">
            <p>These aren't promises made to impress anyone.</p>
            <p>They're systems I'm rebuilding inside myself.</p>
            <p className="text-orange-200 font-medium pt-1">Quietly. Consistently. One habit at a time.</p>
          </div>
        </motion.div>
      </motion.section>

      {/* 2. TIMELINE NAVIGATOR (Sticky Header Bar) */}
      <div className="sticky top-20 z-30 py-3 bg-[#0a0a0c]/90 backdrop-blur-xl border-y border-white/10 my-8">
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto px-2 scrollbar-none">
          {[
            { id: 'today', label: 'TODAY' },
            { id: 'week1-2', label: 'Week 1–2' },
            { id: 'week3-4', label: 'Week 3–4' },
            { id: 'mission-5m', label: '5 Months' },
            { id: 'mission-9m', label: '9 Months' },
            { id: 'lifelong', label: 'Lifelong' },
            { id: 'final', label: 'The Restart' }
          ].map((item, index, arr) => {
            const isActive = activeMilestone === item.id;
            return (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => scrollToMilestone(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-white shadow-lg border border-orange-300/50 scale-105'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
                {index < arr.length - 1 && (
                  <span className="text-white/20 text-xs shrink-0">↓</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. MILESTONE SECTIONS */}

      {/* MILESTONE: TODAY */}
      <section id="milestone-today" className="space-y-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-orange-400 animate-ping" />
          <span className="text-xs tracking-widest text-orange-200 uppercase font-mono">MILESTONE 01</span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/15 backdrop-blur-xl shadow-xl space-y-5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-orange-200" />
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
                Reset
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-200 text-xs font-mono border border-orange-400/30">
              Active Baseline
            </span>
          </div>

          <div className="space-y-3 font-sans text-sm sm:text-base text-white/85 leading-relaxed font-light">
            <p className="font-medium text-white text-base sm:text-lg">
              Today isn't a celebration. It's a restart.
            </p>
            <p className="text-white/70">
              I've accepted my mistakes. I've accepted the consequences.
            </p>
            <p className="text-white/90">
              Now I'm rebuilding everything that slowly disappeared over the last two years.
            </p>
            <p className="text-xs sm:text-sm text-orange-200/90 italic font-serif pt-2 border-t border-white/10">
              Not because someone told me to. Because I finally understand the cost of losing myself.
            </p>
          </div>
        </div>
      </section>

      {/* MILESTONE: WEEK 1–2 */}
      <section id="milestone-week1-2" className="space-y-6 pt-8 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-orange-200" />
            <span className="text-xs tracking-widest text-orange-200 uppercase font-mono">MILESTONE 02 • WEEK 1–2</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/50">Expected Time: <span className="text-white">2 Weeks</span></span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[11px] font-mono border border-amber-400/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
              Loading...
            </span>
          </div>
        </div>

        {/* Header & Progress Ring Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/15 backdrop-blur-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
              Rebuilding My Foundation
            </h2>
            <p className="font-sans text-sm text-white/80 leading-relaxed font-light">
              Within the first two weeks, my focus is not achievement. <strong className="text-white font-normal">It's identity.</strong>
            </p>
            <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed font-light">
              These are habits I already built once before. I'm not creating them for the first time. I'm rebuilding them. The advantage is that rebuilding takes far less time than learning from zero.
            </p>
          </div>

          {/* Foundation Calibration - No Data Available */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2 min-h-[140px]">
            <span className="text-xs font-mono text-white/50 tracking-widest uppercase">
              no data available
            </span>
          </div>
        </div>

        {/* 4 Foundation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Physical Discipline */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-orange-300/40 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-200">
                <Dumbbell className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-wider">Physical Discipline</span>
              </div>
              <span className="text-[10px] font-mono text-white/40">≈2 Weeks</span>
            </div>
            <h3 className="font-serif text-lg text-white font-medium">Running & Physical Resilience</h3>
            <div className="space-y-1.5 text-xs text-white/75 font-light">
              <p><strong className="text-white font-normal">Target:</strong> 12 KM Continuous Running</p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {['Strength', 'Mobility', 'Endurance', 'Recovery'].map((item) => (
                  <span key={item} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mental Discipline */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-orange-300/40 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-200">
                <Brain className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-wider">Mental Discipline</span>
              </div>
              <span className="text-[10px] font-mono text-white/40">Lifetime Journey</span>
            </div>
            <h3 className="font-serif text-lg text-white font-medium">Meditation & Mind Observation</h3>
            <p className="text-xs text-white/75 leading-relaxed font-light">
              First time in my life. No expectations. No shortcuts. Just consistency. Learning how to observe my own mind instead of constantly reacting to it.
            </p>
          </div>

          {/* Emotional Balance */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-orange-300/40 transition-all space-y-3">
            <div className="flex items-center gap-2 text-orange-200">
              <HeartHandshake className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider">Emotional Balance</span>
            </div>
            <h3 className="font-serif text-lg text-white font-medium">From Suppression to Mastery</h3>
            <div className="space-y-1 text-xs text-white/80 font-light">
              <p className="line-through text-white/40"><strong className="text-white/50">Old Goal:</strong> Destroy emotions.</p>
              <p className="text-orange-200"><strong className="text-white">New Goal:</strong> Understand them. Balance them. Control them. Never suppress them.</p>
            </div>
          </div>

          {/* Attention Shift */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-orange-300/40 transition-all space-y-3">
            <div className="flex items-center gap-2 text-orange-200">
              <Target className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider">Attention Shift</span>
            </div>
            <h3 className="font-serif text-lg text-white font-medium">Complete Focus Realignment</h3>
            <div className="space-y-1.5 text-xs text-white/80 font-light">
              <p className="text-white/40 line-through"><strong className="text-white/50">Previous Focus:</strong> Love, Social Media, Distractions</p>
              <p className="text-emerald-300"><strong className="text-white">Current Focus:</strong> Purpose, Discipline, Goals, Growth, Family, Future</p>
            </div>
          </div>
        </div>
      </section>

      {/* MILESTONE: WEEK 3–4 */}
      <section id="milestone-week3-4" className="space-y-6 pt-8 border-t border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-orange-200" />
            <span className="text-xs tracking-widest text-orange-200 uppercase font-mono">MILESTONE 03 • WEEK 3–4</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-light">
            Rebuilding My Operating System
          </h2>
          <p className="font-sans text-xs sm:text-sm text-white/70 max-w-2xl font-light leading-relaxed">
            The habits below aren't random. Each one changed my thinking once before. Now I'm bringing them back—stronger than before.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-3 backdrop-blur-md">
          {/* Categories */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {['All', 'Mindset', 'Self-Mastery', 'Social & Leadership', 'Execution'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterOSCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer whitespace-nowrap ${
                  filterOSCategory === cat
                    ? 'bg-orange-500/80 text-white font-medium shadow-md'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search 27 OS habits..."
              value={searchOS}
              onChange={(e) => setSearchOS(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-white/40 focus:outline-none focus:border-orange-300/50"
            />
          </div>
        </div>

        {/* 27 OS Habits Interactive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOSCards.map((card, idx) => {
            const IconComp = card.icon;

            return (
              <motion.div
                key={card.id}
                layout
                whileHover={{ y: -3 }}
                onClick={() => setSelectedOSCard(card)}
                className="group cursor-pointer p-5 rounded-2xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/10 hover:border-orange-300/40 transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden backdrop-blur-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-400/20 flex items-center justify-center text-orange-200 group-hover:scale-110 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      0{idx + 1} • {card.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-base text-white font-medium leading-snug group-hover:text-orange-200 transition-colors">
                    {card.name}
                  </h3>

                  <p className="font-sans text-xs text-white/70 font-light line-clamp-3 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-sans">
                  <span className="text-orange-200/90 italic font-serif truncate pr-2">
                    {card.realLifeImpact}
                  </span>
                  <Maximize2 className="w-3.5 h-3.5 text-white/30 group-hover:text-white shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* OS CARD DETAILED EXPANDED MODAL */}
      <AnimatePresence>
        {selectedOSCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="max-w-lg w-full bg-[#121216] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-left"
            >
              <button
                onClick={() => setSelectedOSCard(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-200">
                  <selectedOSCard.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-orange-200 uppercase tracking-widest">
                    {selectedOSCard.category} • OS Component
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-light">
                    {selectedOSCard.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-4 text-sm font-sans text-white/85 leading-relaxed font-light">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Core Description</span>
                  <p className="text-white/90">{selectedOSCard.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-orange-200 uppercase">Why It Matters</span>
                  <p className="text-white/80">{selectedOSCard.whyItMatters}</p>
                </div>

                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-400/20 space-y-1">
                  <span className="text-[10px] font-mono text-orange-200 uppercase">Real-Life Impact</span>
                  <p className="text-orange-200 font-serif italic text-base">"{selectedOSCard.realLifeImpact}"</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOSCard(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500/80 to-amber-500/80 hover:from-orange-500 hover:to-amber-500 text-white font-sans text-xs tracking-widest uppercase font-medium cursor-pointer transition-all"
              >
                Close Component
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MILESTONE: 5 MONTH MISSION */}
      <section id="milestone-mission-5m" className="space-y-6 pt-8 border-t border-white/10">
        <div className="flex items-center gap-3">
          <Target className="w-4 h-4 text-orange-200" />
          <span className="text-xs tracking-widest text-orange-200 uppercase font-mono">MILESTONE 04 • 5 MONTH MISSION</span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-orange-950/20 to-black/60 border border-orange-500/30 backdrop-blur-xl relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono text-orange-300 tracking-wider uppercase">Exam Target 1</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">JEE Main</h2>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-orange-500/20 border border-orange-400/40 text-orange-200 font-mono text-xs sm:text-sm text-center shrink-0">
              ≈ 5 Months Remaining
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4 font-sans text-sm sm:text-base text-white/85 leading-relaxed font-light">
              <p><strong className="text-white font-medium">Goal:</strong> Maximum Possible Rank.</p>
              <p className="text-white/70">
                I won't promise Rank 1. Not because I doubt my ability. Because time is limited.
              </p>
              <p className="text-orange-200 font-medium">
                But I will promise this: Every single day until the exam will be used. No excuses.
              </p>
            </div>

            <div className="md:col-span-5 p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-white/60">
                <span>Execution Standard:</span>
                <span className="text-orange-200 font-semibold">NON-NEGOTIABLE</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Daily Study Allocation:</span>
                <span className="text-white">Maximum Capacity</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Distraction Tolerance:</span>
                <span className="text-rose-400">0.00%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MILESTONE: 9 MONTH MISSION */}
      <section id="milestone-mission-9m" className="space-y-6 pt-8 border-t border-white/10">
        <div className="flex items-center gap-3">
          <Trophy className="w-4 h-4 text-orange-200" />
          <span className="text-xs tracking-widest text-orange-200 uppercase font-mono">MILESTONE 05 • 9 MONTH MISSION</span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/15 backdrop-blur-xl relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono text-orange-300 tracking-wider uppercase">Exam Target 2</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">JEE Advanced</h2>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 font-mono text-xs sm:text-sm text-center shrink-0">
              ≈ 9 Months Remaining
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-white/60">Target Benchmark</span>
              <span className="text-amber-200 font-bold text-lg">AIR 1</span>
            </div>

            {/* Clean Progress Tracker Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-white/40">
                <span>Preparation Velocity</span>
                <span>Calibrating...</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 w-[65%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MILESTONE: LIFELONG LEARNING */}
      <section id="milestone-lifelong" className="space-y-6 pt-8 border-t border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-orange-200" />
            <span className="text-xs tracking-widest text-orange-200 uppercase font-mono">MILESTONE 06 • LIFELONG LEARNING</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-light">
            Domains of Systemic Mastery
          </h2>
          <p className="font-sans text-xs sm:text-sm text-white/70 max-w-2xl font-light leading-relaxed">
            Beyond competitive exams, these 18 domains represent Prince's lifelong roadmap for knowledge, mastery, and human impact.
          </p>
        </div>

        {/* 18 Expanding Domain Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARNING_ROADMAP.map((subject) => {
            const isExpanded = expandedSubject === subject.title;

            return (
              <motion.div
                key={subject.title}
                layout
                onClick={() => setExpandedSubject(isExpanded ? null : subject.title)}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 space-y-3 backdrop-blur-md ${
                  isExpanded
                    ? 'bg-white/10 border-orange-300/60 shadow-xl'
                    : 'bg-white/[0.025] hover:bg-white/[0.05] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-orange-200 uppercase tracking-widest">
                    {subject.category}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isExpanded ? 'rotate-180 text-orange-200' : ''}`} />
                </div>

                <h3 className="font-serif text-lg text-white font-medium">
                  {subject.title}
                </h3>

                <p className="font-sans text-xs text-white/70 font-light leading-relaxed">
                  {subject.description}
                </p>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-white/10 space-y-2 text-xs"
                  >
                    <span className="text-[10px] font-mono text-white/40 uppercase block">Key Focus Areas</span>
                    <div className="flex flex-wrap gap-1.5">
                      {subject.keyConcepts.map((kc) => (
                        <span key={kc} className="px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-400/20 text-orange-200 text-[10px] font-mono">
                          {kc}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* MILESTONE 07: FINAL SECTION & LIVE COUNTER */}
      <section id="milestone-final" className="pt-16 pb-12 border-t border-white/10">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#050507] border border-white/10 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <p className="font-serif text-2xl sm:text-3xl text-white font-light italic leading-snug">
              "I'm not asking anyone to believe in who I am today."
            </p>

            <p className="text-white/40 font-mono text-xs tracking-widest uppercase">
              • pause •
            </p>

            <p className="font-serif text-2xl sm:text-3xl text-orange-200 font-light italic leading-snug">
              "I'd rather spend the next few years becoming someone who no longer needs to explain himself."
            </p>
          </div>

          {/* Live Counter Replacement */}
          <div className="pt-8 border-t border-white/10 inline-block">
            <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/15 backdrop-blur-xl inline-flex flex-col items-center space-y-2">
              <span className="text-xs font-mono text-white/50 tracking-widest uppercase">
                no data available
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
