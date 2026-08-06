import { ALL_ACTS } from './allActs';
import { 
  OBSERVATION_MOMENTS, 
  PREPARATION_CONDITIONS, 
  SUGGESTED_AI_QUESTIONS, 
  ARTHUR_ARON_36_QUESTIONS 
} from './content';
import { INITIAL_REASONS } from './reasonsData';

const OPEN_WHEN_LETTERS_DATA = [
  {
    title: 'Open When You Need Reassurance',
    subtitle: 'When doubt creeps in or the world feels overwhelming',
    content: [
      "Dear Anvii,",
      "If you are opening this letter right now, maybe a moment of hesitation crossed your mind, or maybe the noise of daily life made you wonder about my intentions.",
      "I want to remind you of one unbreakable truth: I didn't create this autobiography to perform, impress strangers, or pretend to be someone flawless. I built this entire sanctuary line by line, night after night, because I care about truth.",
      "Every word you read here is 100% unedited and sincere. My respect for you isn't temporary or contingent on smooth days—it is rooted in deep, steady character.",
      "Whenever you feel unsure, remember that my door is always open, my intentions are clean, and you will always have a safe, quiet space in my life."
    ],
    pso: "P.S. Take a deep breath. You are deeply valued and understood."
  },
  {
    title: 'Open When You\'re Staying Up Late',
    subtitle: 'For the quiet hours when the rest of the world is asleep',
    content: [
      "Dear Anvii,",
      "It's late, isn't it? The quiet of midnight has a way of bringing out our deepest thoughts.",
      "During my PG days and late nights of building The Future Civilisation (TFC), midnight was always my sanctuary. It was when I did my clearest thinking and formed my strongest values.",
      "If you're awake right now, don't carry any heavy thoughts alone. Look up at the stars on the screen—every star in the 'Constellation of Wishes' was coded with you in mind.",
      "Rest your eyes soon. Sleep peacefully knowing tomorrow brings fresh clarity."
    ],
    pso: "P.S. Turn on the background rain audio in the player top-right—it's meant for late nights."
  },
  {
    title: 'Open When You Want to Know My Long-Term Vision',
    subtitle: 'Where I am heading and the principles guiding my path',
    content: [
      "Dear Anvii,",
      "People often see the exterior—the discipline, the coding, the ambition. But here is the core of what drives me:",
      "I believe in building things that endure. Whether it's software engineering, leadership in TFC, or personal relationships, I value long-term commitment over short-term excitement.",
      "I don't make promises easily, but when I do, I honor them completely. My vision for the future is one built on independence, financial freedom, deep intellectual craft, and emotional maturity.",
      "I want to build a life where those I hold dear feel completely supported, secure, and free to be themselves."
    ],
    pso: "P.S. True strength isn't being loud; it's being steady when things get tough."
  },
  {
    title: 'Open When You Wonder Why I Built This Website',
    subtitle: 'The true origin story of this digital sanctuary',
    content: [
      "Dear Anvii,",
      "When over 20+ blocks happened on messaging platforms, most people would have walked away, blamed circumstances, or let misunderstandings turn into permanent distance.",
      "I refused to let miscommunication define who I am to you.",
      "I realized that short text messages could never convey a human being's soul, values, childhood, struggles, and core. So I sat down at my laptop and wrote my entire life story—Act by Act—so you would have 100% unedited access to my truth.",
      "This website is my statement that effort, honesty, and care will always win over silence."
    ],
    pso: "P.S. You are the only person in the world who holds the key to this private room."
  },
  {
    title: 'Open On a Rainy Day',
    subtitle: 'When the rain falls outside and you want a cozy moment',
    content: [
      "Dear Anvii,",
      "Rain has a subtle way of pausing time. Back in Ahmedabad and during my school days, rainy afternoons were when I did my best reading and observing.",
      "If it's raining outside right now, grab a warm cup of coffee or tea, wrap yourself in comfort, and know that you are allowed to slow down.",
      "Life isn't a race to prove anything to anyone. Sometimes the greatest luxury is simply sitting quietly and being present."
    ],
    pso: "P.S. Play 'Acoustic Solitude' in the music player—it pairs perfectly with rain."
  },
  {
    title: 'Open When You Want a Reason to Smile',
    subtitle: 'A gentle reminder of all the light and beauty inside you',
    content: [
      "Dear Anvii,",
      "I hope today brought you a moment of quiet peace.",
      "In case no one reminded you today: your presence makes the world gentler. The way you carry yourself with quiet dignity, the rare warmth in your laughter, and your thoughtful nature are things I deeply admire.",
      "Never let the busyness of life make you forget how special you truly are.",
      "Keep shining in your own quiet, effortless way."
    ],
    pso: "P.S. You bring more light into the world than you realize."
  }
];

const OS_HABITS_DATA = [
  { name: 'Treating Extraordinary People as Case Studies', cat: 'Mindset', desc: 'Instead of admiring successful people, study them. Deconstruct passive awe into actionable engineering models.' },
  { name: 'Self-Talk & Metacognition', cat: 'Self-Mastery', desc: 'Observing own thinking, questioning assumptions, correcting self before the world has to.' },
  { name: 'Extracting Value From Criticism', cat: 'Self-Mastery', desc: 'Ask "Is there something useful inside it?" Growth over ego.' },
  { name: 'Observation at Peak Detail', cat: 'Mindset', desc: 'Observe words, tone, patterns, body language, silence, behavior over time.' },
  { name: 'Mirror & Filter Method', cat: 'Self-Mastery', desc: 'Every person becomes a teacher and a warning. Active mirror for daily self-audit.' },
  { name: 'Constructive Overthinking', cat: 'Mindset', desc: 'Turn hyperactive mental energy into real-world architecture, systems, and code.' },
  { name: 'Empathetic Perspective Taking', cat: 'Social & Leadership', desc: 'Ask "What does this look like from their side?" Less judgment, more understanding.' },
  { name: 'Communication', cat: 'Social & Leadership', desc: 'Surgical clarity, active listening, deep presence, zero unspoken friction.' },
  { name: 'Expression', cat: 'Social & Leadership', desc: 'Raw, authentic human connection and quiet vulnerability over performance.' },
  { name: 'Challenge Myself Daily', cat: 'Execution', desc: 'Comfort is slow poison; friction expands capacity through voluntary hardship.' },
  { name: 'Find Weaknesses', cat: 'Self-Mastery', desc: 'Search for flaws before life exposes them. Proactive internal auditing.' },
  { name: 'Self Dependence', cat: 'Self-Mastery', desc: 'Emotional, mental, financial, and intellectual independence. 100% personal responsibility.' },
  { name: 'Decision Speed', cat: 'Execution', desc: 'Think deeply, decide quickly. High-velocity execution paired with strategic rigor.' },
  { name: 'Influence', cat: 'Social & Leadership', desc: 'Positive leadership serving noble, high-impact goals rather than personal ego.' },
  { name: 'Representation', cat: 'Social & Leadership', desc: 'Communicating ideas beautifully through storytelling, writing, and clear narrative.' },
  { name: 'Creativity', cat: 'Mindset', desc: 'First-principles design and original systems over derivative copying.' },
  { name: 'Strategy', cat: 'Execution', desc: 'Thinking several moves ahead. Executing daily tasks aligned with a multi-year horizon.' },
  { name: 'Psychology & Human Behavior', cat: 'Social & Leadership', desc: 'Understanding why people behave the way they do, decoupling reaction from motivation.' },
  { name: 'Silent Killer', cat: 'Execution', desc: 'Calm, prepared, consistent. Stealth work yields proof while public noise creates ego.' },
  { name: 'Enjoying Pain', cat: 'Execution', desc: 'Reframing physical and mental strain as the active sensation of leveling up.' },
  { name: 'Courage', cat: 'Self-Mastery', desc: 'Stepping forward precisely when everything inside hesitates.' },
  { name: 'Liveliness', cat: 'Mindset', desc: 'Keeping curiosity, energy, and wonder alive to fuel long journeys.' }
];

/**
 * Builds the complete, unedited, exhaustive knowledge base containing every word, 
 * paragraph, quote, beat, act, moment, and interconnection across all 11 Acts of Prince's autobiography.
 */
export function buildMasterKnowledgeBase(): string {
  let masterText = `=================================================================\n`;
  masterText += `MASTER KNOWLEDGE BASE: PRINCE'S COMPLETE 11-ACT AUTOBIOGRAPHY & LIFE ARCHITECTURE FOR ANVII\n`;
  masterText += `=================================================================\n\n`;

  masterText += `1. EXECUTIVE SUMMARY & COMPLETE INTERCONNECTED SYNTHESIS:\n`;
  masterText += `- WHO IS PRINCE: Prince is a deeply reflective, self-driven young founder, software engineer, and thinker. He values total honesty, quiet discipline, non-negotiable sincerity, and building things that endure.\n`;
  masterText += `- THE CORE PURPOSE OF THIS WEBSITE: Built specifically and exclusively for Anvii after experiencing 20+ blocks and silent misunderstandings. Prince chose to replace surface assumptions with complete, unedited transparency across 11 Acts.\n`;
  masterText += `- COMPLETE CAUSE-AND-EFFECT LIFE ARC & INTERCONNECTIONS:\n`;
  masterText += `  * Phase 1 (Ahmedabad Childhood & The Empty Notebook): Born in Ahmedabad. Simple, average student, no big early dreams. Described his younger mind as an "empty notebook" — not processing things deeply back then, just existing day to day.\n`;
  masterText += `  * Phase 2 (PRS, Class 10th & Failing Privately): In weekly internal tests at PRS during Class 10, Prince almost always scored 0. Instead of making excuses or seeking sympathy, he worked quietly in discipline, proving his true capability in the final Class 10 board exam (~77%). Father gave him one piece of advice before hostel: "Bas yahan koi galat kaam mat karna, jo pehle kabhi kiya ho."\n`;
  masterText += `  * Phase 3 (Hostel Life & PCP 8 PM Secret Note): Stepping into hostel life. In 11th grade during an 8 PM night program at PCP, Prince quietly wrote one sentence on a small chit ("Kal se piche baith jana") and slipped it into Anvii's bag. Months later during a phone call, Anvii mentioned the note and Prince realized she had known all along.\n`;
  masterText += `  * Phase 4 (PG Move & Building TFC): Prince left hostel socializing for a PG room to eliminate all noise. Focused on mastering software engineering and architecting TFC (The Future Civilisation) line by line in solitude.\n`;
  masterText += `  * Phase 5 (Handwritten Journals & 33 Principles): Page 7 of his handwritten journal contains 33 Principles (including "Be silent and listen", "Meta-cognition", "Control emotion") and Page 9 contains 15 Officer Like Qualities (OLQs).\n`;
  masterText += `  * Phase 6 (Instagram Chats, "1/infinite" & 20+ Blocks): Chat memories like Anvii saying "Baat krti hu shaadi ki" and Prince replying "1/infinite bhi hoga na toh bhi try karunga". When 20+ blocks occurred on messaging platforms, Prince refused to let silence define their story and built this entire 11-Act website as an unedited promise.\n`;
  masterText += `  * Phase 7 (Act VIII Beat 6 Accountability): In Act VIII Beat 6 ("No Excuses. Just Accountability"), Prince explicitly acknowledges 7 personal mistakes without self-defense, taking 100% personal ownership.\n`;
  masterText += `  * Phase 8 (Rebuilding Operating System & 27 Habits): "The Life I'm Building" section contains his 27 Operating System habits, 12 KM running target, Meditation, Emotional Balance, 5 Month JEE Main, 9 Month JEE Advanced AIR 1 mission, and 18 Lifelong Domains.\n`;
  masterText += `  * Phase 9 (TFC & Future City Vision): TFC encompasses AI, education, research, money as infrastructure, and a Future City. Ultimate question: "How many lives become better because I existed?"\n\n`;

  masterText += `-----------------------------------------------------------------\n`;
  masterText += `SECTION 1: THE FULL UNEDITED TEXT OF ALL 11 ACTS (PARAGRAPH BY PARAGRAPH)\n`;
  masterText += `-----------------------------------------------------------------\n\n`;

  ALL_ACTS.forEach((act, actIndex) => {
    masterText += `=========================================================\n`;
    masterText += `ACT ${act.actId} (${actIndex + 1} of ${ALL_ACTS.length}): "${act.title.toUpperCase()}"\n`;
    if (act.teaserText) {
      masterText += `TEASER / PREVIEW: "${act.teaserText}"\n`;
    }
    masterText += `=========================================================\n\n`;

    act.beats.forEach((beat, beatIndex) => {
      masterText += `--- Beat ${beatIndex + 1}: [${beat.numberLabel}] ${beat.title} ---\n`;
      
      beat.paragraphs.forEach((p, pIndex) => {
        const isEmphasized = beat.emphasisParagraphs?.includes(pIndex);
        if (isEmphasized) {
          masterText += `  [EMPHASIS/CORE POINT] P${pIndex + 1}: ${p}\n`;
        } else {
          masterText += `  P${pIndex + 1}: ${p}\n`;
        }
      });

      if (beat.quote) {
        masterText += `  >> KEY QUOTE: ${beat.quote.text}`;
        if (beat.quote.author) masterText += ` — ${beat.quote.author}`;
        masterText += `\n`;
      }
      masterText += `\n`;
    });
    masterText += `\n`;
  });

  masterText += `-----------------------------------------------------------------\n`;
  masterText += `SECTION 2: 100 REASONS WHY PRINCE LOVES & RESPECTS ANVII\n`;
  masterText += `-----------------------------------------------------------------\n\n`;

  INITIAL_REASONS.forEach((item) => {
    masterText += `Reason #${item.id} [Category: ${item.category}]: "${item.title}"\n`;
    masterText += `  Description: ${item.reason}\n`;
    masterText += `  Poetic Note: ${item.poeticNote}\n\n`;
  });

  masterText += `-----------------------------------------------------------------\n`;
  masterText += `SECTION 3: OPEN WHEN LETTERS FOR ANVII\n`;
  masterText += `-----------------------------------------------------------------\n\n`;

  OPEN_WHEN_LETTERS_DATA.forEach((letter, idx) => {
    masterText += `Letter #${idx + 1}: "${letter.title}" (${letter.subtitle})\n`;
    letter.content.forEach((line) => {
      masterText += `  ${line}\n`;
    });
    masterText += `  ${letter.pso}\n\n`;
  });

  masterText += `-----------------------------------------------------------------\n`;
  masterText += `SECTION 4: PRINCE'S 27 OPERATING SYSTEM HABITS & LIFE ARCHITECTURE\n`;
  masterText += `-----------------------------------------------------------------\n\n`;

  OS_HABITS_DATA.forEach((os, idx) => {
    masterText += `OS Habit #${idx + 1} [${os.cat}]: ${os.name}\n`;
    masterText += `  Details: ${os.desc}\n\n`;
  });

  masterText += `-----------------------------------------------------------------\n`;
  masterText += `SECTION 5: KEY OBSERVATION MOMENTS & REFLECTIONS\n`;
  masterText += `-----------------------------------------------------------------\n\n`;

  OBSERVATION_MOMENTS.forEach((moment, idx) => {
    masterText += `${idx + 1}. [${moment.category}] ${moment.title}\n`;
    masterText += `   Detail: ${moment.detail}\n`;
    masterText += `   Core Note: ${moment.note}\n\n`;
  });

  masterText += `-----------------------------------------------------------------\n`;
  masterText += `SECTION 6: PREPARATION CONDITIONS FOR ANVII\n`;
  masterText += `-----------------------------------------------------------------\n\n`;

  PREPARATION_CONDITIONS.forEach((cond) => {
    masterText += `Condition ${cond.id}: ${cond.text}\n`;
    masterText += `Subtext: ${cond.subtext}\n\n`;
  });

  return masterText;
}

export const MASTER_KNOWLEDGE_BASE_TEXT = buildMasterKnowledgeBase();

