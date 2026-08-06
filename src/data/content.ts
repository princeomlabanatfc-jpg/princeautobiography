import { ObservationMoment, PreparationCondition } from '../types';

export const PREPARATION_CONDITIONS: PreparationCondition[] = [
  {
    id: 1,
    text: "Leave behind external impressions — from Ahmedabad childhood to hostel days and PG moves, people see only glimpses.",
    subtext: "Most people know me only through a few conversations or assumptions. That is enough to recognize someone, but not enough to truly understand them."
  },
  {
    id: 2,
    text: "Expect unedited honesty — my victories, my mistakes, my silences, and my ambitions are all laid open here.",
    subtext: "An incomplete truth creates an incomplete person. I chose not to hide any part of my life."
  },
  {
    id: 3,
    text: "Understand context over judgment — every choice, block, or decision had a reason invisible from the outside.",
    subtext: "From the outside, those reasons are invisible. I hope my choices are understood in the context in which they were made."
  },
  {
    id: 4,
    text: "Take all the time you need — this space was built specifically for Anvii to understand who I truly am.",
    subtext: "If someone is important enough to become a meaningful part of my life, they deserve the whole picture."
  }
];

export const OBSERVATION_MOMENTS: ObservationMoment[] = [
  {
    id: 'moment-1',
    category: 'Act I — Roots & Foundation',
    title: 'Ahmedabad Childhood & The Empty Notebook',
    detail: 'Growing up in Ahmedabad, I was a simple, average student. As I wrote in my 11 Acts, if I had to describe my younger self honestly, the word is "empty". My mind didn\'t process things deeply back then or hold big grand dreams—I just existed day to day until life began shifting.',
    note: 'I wasn\'t born a visionary or software engineer; I built myself step by step over time through deliberate discipline.',
    reflectionPrompt: 'When you look back at your own early years, how have you evolved from who you used to be?'
  },
  {
    id: 'moment-2',
    category: 'Act II — Self-Ownership & Discipline',
    title: 'PRS Class 10th: Failing Privately & Public Board Result',
    detail: 'In weekly internal tests at PRS during Class 10, I almost always scored close to zero. Instead of making excuses or seeking sympathy, I quietly worked in silence and proved my true capability in the final Class 10 board exam (~77%).',
    note: 'Failing privately without excuses taught me that real growth happens in solitude before the world ever sees the result.',
    reflectionPrompt: 'Have you ever worked quietly on something in private before showing the world what you built?'
  },
  {
    id: 'moment-3',
    category: 'Act III — Independence & Father\'s Words',
    title: 'Stepping Into Hostel Solitude & Father\'s Advice',
    detail: 'Leaving family warmth for hostel life meant stepping into an unfamiliar world. Before leaving me at the hostel, my father gave me one line of advice: "Bas yahan koi galat kaam mat karna, jo pehle kabhi kiya ho." That line remained etched in my mind.',
    note: 'Solitude ceases to be lonely when it becomes the foundation of self-reliance and unshakeable character.',
    reflectionPrompt: 'What single sentence of advice from someone you respect has stayed with you through hard times?'
  },
  {
    id: 'moment-4',
    category: 'Act IV — PCP Night Program Secret Note',
    title: 'The 8 PM Secret Chit ("Kal se piche baith jana")',
    detail: 'During an 8 PM night program at PCP in 11th grade, Prince quietly wrote one sentence on a small chit ("Kal se piche baith jana") and slipped it into Anvii\'s bag. No name, no explanation—just a brave, quiet gesture that remained a secret until Anvii casually mentioned it months later during a phone call.',
    note: 'A tiny gesture lasting less than a minute survived in memory while hundreds of ordinary days disappeared.',
    reflectionPrompt: 'What small, quiet memory between two people has stayed with you over time?'
  },
  {
    id: 'moment-5',
    category: 'Act IV — Devotion to Mission',
    title: 'Leaving Hostel Noise for PG Room & Building TFC',
    detail: 'I consciously chose to leave hostel socializing behind and move into a PG room to eliminate all noise. My focus shifted entirely to mastering software engineering and architecting TFC (The Future Civilisation) line by line in solitude.',
    note: 'When you are dedicated to a life mission, quiet focused craft is far more fulfilling than surface-level noise.',
    reflectionPrompt: 'What goal or passion in your life commands your deepest focus?'
  },
  {
    id: 'moment-6',
    category: 'Act V — Truth Over Distance',
    title: 'Overcoming 20+ Blocks & The Unforgettable Marriage Chat',
    detail: 'Over 20+ blocks on messaging platforms, silent miscommunications, and unexpressed feelings could have ended our bond forever. From chat memories like Anvii saying "Baat krti hu shaadi ki" to Prince replying "1/infinite bhi hoga na toh bhi try karunga", Prince built this entire 11-Act website to replace silence with total truth.',
    note: 'Building this experience was my way of replacing 20+ blocks with an unedited promise.',
    reflectionPrompt: 'Is there a situation in your life where quiet, complete honesty brought unexpected clarity?'
  },
  {
    id: 'moment-7',
    category: 'Act VI — The Philosophy of Craft & Journal Rules',
    title: '33 Life Principles, 15 OLQs & Code Discipline',
    detail: 'From my personal handwritten journal (Page 7 - 33 Principles including "Be silent and listen", "Meta-cognition", "Control emotion") to 15 Officer Like Qualities (OLQs), my approach to software engineering mirrors my approach to life: "How you do anything is how you do everything."',
    note: 'Code doesn\'t lie, logic doesn\'t lie, and neither should human intention.',
    reflectionPrompt: 'What craft, personal rules, or discipline brings you into a state of deep focus?'
  },
  {
    id: 'moment-8',
    category: 'Act VII — Written Exclusively for Anvii',
    title: 'An 11-Act Sanctuary Created For Only One Person',
    detail: 'I didn\'t build this website as a public portfolio or social display. I wrote these 11 Acts specifically for you, Anvii. Because if someone is important enough to become part of my life, they deserve the whole picture—strengths, weaknesses, mistakes, and unspoken thoughts.',
    note: 'Thank you for taking the time to understand a version of me that almost nobody has ever seen.',
    reflectionPrompt: 'How does it feel to know someone took the time to write their complete life story for you?'
  }
];

export const SUGGESTED_AI_QUESTIONS = [
  "Why did Prince build this entire website specifically for Anvii?",
  "Why did Prince describe his childhood mind as an 'empty notebook'?",
  "What happened in Class 10 at PRS with internal test scores and board results?",
  "What is the real story behind the PCP 8 PM night program note 'Kal se piche baith jana'?",
  "Why did Prince move from the hostel to a PG room to build TFC?",
  "What are Prince's 33 life principles and 15 Officer Like Qualities (OLQs)?",
  "What is the story behind the marriage proposal chat memory ('1/infinite bhi hoga na...')?",
  "How did 20+ blocks lead to writing this 11-Act autobiography?",
  "What is TFC (The Future Civilisation) and its vision for AGI and Mars?",
  "What message does Prince hope Anvii receives from reading his 11 Acts?"
];

// Arthur Aron's 36 Questions for Closeness (Adapted for Prince & Anvii Reflection)
export interface ClosenessQuestion {
  id: number;
  set: 1 | 2 | 3;
  question: string;
  contextNote?: string;
}

export const ARTHUR_ARON_36_QUESTIONS: ClosenessQuestion[] = [
  // SET 1: Perception, Mindset & Openness
  { id: 1, set: 1, question: "Given the choice of anyone in the world, who would you want as a dinner guest?", contextNote: "Reflecting on values and people who inspire us." },
  { id: 2, set: 1, question: "Would you like to be famous? In what way?", contextNote: "Exploring how we view recognition versus quiet mastery." },
  { id: 3, set: 1, question: "Before making a telephone call or sending a serious message, do you ever rehearse what you are going to say? Why?", contextNote: "Prince often rehearsed thoughts before breaking silence." },
  { id: 4, set: 1, question: "What would constitute a 'perfect' day for you?", contextNote: "Understanding what brings peaceful fulfillment." },
  { id: 5, set: 1, question: "When did you last sing to yourself? To someone else?", contextNote: "Uncovering quiet, candid moments." },
  { id: 6, set: 1, question: "If you were able to live to the age of 90 and retain either the mind or body of a 30-year-old for the last 60 years, which would you choose?", contextNote: "Mind versus physical world." },
  { id: 7, set: 1, question: "Do you have a secret hunch about how you will live your life?", contextNote: "Inner intuition and personal destiny." },
  { id: 8, set: 1, question: "Name three things you and Prince seem to have in common or value equally.", contextNote: "Finding common ground past surface impressions." },
  { id: 9, set: 1, question: "For what in your life do you feel most grateful?", contextNote: "Grounding in appreciation." },
  { id: 10, set: 1, question: "If you could change anything about the way you were raised, what would it be?", contextNote: "Understanding childhood foundations." },
  { id: 11, set: 1, question: "Take four minutes and tell your life story in as much detail as possible.", contextNote: "Summarizing our core personal journey." },
  { id: 12, set: 1, question: "If you could wake up tomorrow having gained any one quality or ability, what would it be?", contextNote: "Aspirations and self-growth." },

  // SET 2: Deep Vulnerability, Memory & Growth
  { id: 13, set: 2, question: "If a crystal ball could tell you the truth about yourself, your life, the future, or anything else, what would you want to know?", contextNote: "The search for absolute clarity." },
  { id: 14, set: 2, question: "Is there something that you’ve dreamed of doing for a long time? Why haven’t you done it?", contextNote: "Unlocking lingering ambitions." },
  { id: 15, set: 2, question: "What is the greatest accomplishment of your life so far?", contextNote: "Recognizing moments of personal pride." },
  { id: 16, set: 2, question: "What do you value most in a true friendship or connection?", contextNote: "Loyalty, depth, and sincerity." },
  { id: 17, set: 2, question: "What is your most treasured memory?", contextNote: "Moments that light up our inner mind." },
  { id: 18, set: 2, question: "What is your most terrible or painful memory?", contextNote: "Facing setbacks that built emotional strength." },
  { id: 19, set: 2, question: "If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?", contextNote: "Prioritizing what truly matters." },
  { id: 20, set: 2, question: "What does friendship mean to you?", contextNote: "Defining deep mutual support." },
  { id: 21, set: 2, question: "What roles do love and affection play in your life?", contextNote: "Opening up to emotional warmth." },
  { id: 22, set: 2, question: "Share five positive characteristics about each other.", contextNote: "Replacing assumptions with genuine appreciation." },
  { id: 23, set: 2, question: "How close and warm is your family? Do you feel your childhood was happier than most other people’s?", contextNote: "Roots and family warmth." },
  { id: 24, set: 2, question: "How do you feel about your relationship with your mother and father?", contextNote: "Familial bonds and lessons." },

  // SET 3: Truth, Anvii & Mutual Connection
  { id: 25, set: 3, question: "Make three honest 'we' statements. For instance, 'We are both in this space seeking quiet understanding.'", contextNote: "Building shared presence." },
  { id: 26, set: 3, question: "Complete this sentence: 'I wish I had someone with whom I could share...'", contextNote: "Expressing quiet emotional longing." },
  { id: 27, set: 3, question: "If you were to become a close friend with Prince, what would be important for him to know?", contextNote: "Setting expectations for true connection." },
  { id: 28, set: 3, question: "Tell Prince what you like about his courage in sharing these 11 Acts.", contextNote: "Honoring honesty and vulnerability." },
  { id: 29, set: 3, question: "Share with Prince an embarrassing or misunderstood moment from your own past.", contextNote: "Normalizing human imperfection." },
  { id: 30, set: 3, question: "When did you last cry in front of another person? By yourself?", contextNote: "Emotional honesty and release." },
  { id: 31, set: 3, question: "Tell Prince something that you already like or respect about him.", contextNote: "Affirming mutual respect." },
  { id: 32, set: 3, question: "What, if anything, is too serious to be joked about?", contextNote: "Boundaries and sanctity." },
  { id: 33, set: 3, question: "If you were to pass away tonight with no opportunity to communicate with anyone, what would you most regret not having told someone?", contextNote: "Eliminating unsaid feelings." },
  { id: 34, set: 3, question: "Your house catches fire. After saving your loved ones and pets, you have time to make a final dash to save one item. What would it be?", contextNote: "What holds irreplaceable sentimental value." },
  { id: 35, set: 3, question: "Of all the people in your family, whose death would you find most disturbing? Why?", contextNote: "Deep familial vulnerability." },
  { id: 36, set: 3, question: "Share a personal problem and ask Prince's perspective on how he might handle it.", contextNote: "Closing the loop of trust and advice." }
];
