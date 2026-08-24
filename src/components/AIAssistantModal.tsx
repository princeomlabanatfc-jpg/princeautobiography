import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SUGGESTED_AI_QUESTIONS } from '../data/content';
import { 
  Bot, X, Send, Volume2, VolumeX, Sparkles, MessageSquare, 
  HelpCircle, RefreshCw, User, Play, Square, Pause, ChevronRight 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hello Anvi! Me Prince ki AI Companion or Story Assistant hu. Me Prince ki poori journey, 11 Acts, Ahmedabad childhood, PCP 8 PM night program note, PRS Class 10 board results, PG room TFC craft, or unke sabhi thoughts ke bare me acche se janti hu. Ap mujhse Prince ke bare me kuch bhi puch sakti hain!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [targetVoice, setTargetVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Load and set preferred voice: Maisie - English (United Kingdom) or Emily - English (Ireland)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const findBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Specifically target Maisie (en-GB) and Emily (en-IE) as requested
      const chosen = voices.find(v => v.name.includes('Maisie'))
        || voices.find(v => v.name.includes('Emily'))
        || voices.find(v => v.lang.includes('en-GB') && (v.name.includes('Female') || !v.name.includes('Male')))
        || voices.find(v => v.lang.includes('en-IE'))
        || voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Zira') || v.name.includes('Female')))
        || voices.find(v => v.lang.startsWith('en'));

      if (chosen) {
        setTargetVoice(chosen);
      }
    };

    findBestVoice();
    window.speechSynthesis.onvoiceschanged = findBestVoice;
  }, []);

  // Clean markdown symbols & apply phonetic smoothing for natural TTS reading of Hinglish
  const cleanTextForSpeech = (text: string) => {
    let cleaned = text
      .replace(/[\*\#\_\-\~\`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Phonetic replacements so Western TTS engines (like Maisie / Emily) speak smooth Hinglish without spelling words letter-by-letter
    cleaned = cleaned
      .replace(/\bAnvii\b/gi, 'Anvi')
      .replace(/\bmain\b/gi, 'me')
      .replace(/\bmai\b/gi, 'me')
      .replace(/\baap\b/gi, 'ap')
      .replace(/\baapko\b/gi, 'apko')
      .replace(/\baapne\b/gi, 'apne')
      .replace(/\baur\b/gi, 'or')
      .replace(/\bbohot\b/gi, 'bohut')
      .replace(/\bhoon\b/gi, 'hun')
      .replace(/\bbaare\b/gi, 'bare')
      .replace(/\bjaanti\b/gi, 'janti')
      .replace(/\bjaanta\b/gi, 'janta')
      .replace(/\bsamajhti\b/gi, 'samjhti')
      .replace(/\bsamajhta\b/gi, 'samjhti')
      .replace(/\bkaise\b/gi, 'kayse')
      .replace(/\bwaise\b/gi, 'wayse')
      .replace(/\bkarta\b/gi, 'karti');

    return cleaned;
  };

  // Handle Speech Synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop ongoing speech

    const cleanText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Soft, sweet, natural pitch & cadence
    utterance.pitch = 1.22;
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const voiceToUse = targetVoice || voices.find(v => v.name.includes('Maisie') || v.name.includes('Emily'))
      || voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-IE'))
      || voices.find(v => v.lang.startsWith('en'));

    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const pauseResumeSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const queryCounterRef = useRef<number>(0);

  // Smart client-side fallback knowledge engine for static deployments like GitHub Pages
  const generateClientSideAssistantReply = (rawQuery: string): string => {
    const q = rawQuery.toLowerCase().trim();
    queryCounterRef.current += 1;
    const counter = queryCounterRef.current;

    const selectVariation = (arr: string[]) => {
      const idx = (counter + q.length) % arr.length;
      return arr[idx];
    };

    // 1. Greetings & Casual Chat
    if (/^(hy|hello|hi|hey|hie|hola|greetings|namaste|kaise|kese|kaha|kya haal|good morning|good night|good evening)/.test(q) || q === 'hi' || q === 'hello' || q === 'hy') {
      return selectVariation([
        "Hello Anvi! Me Prince ki AI Assistant hu. Aap bataye, aaj aap Prince ki journey, unke 11 Acts, PCP night program note, ya unke kisi khas memory ke bare me kya jan na chahti hain?",
        "Hey Anvi! It's lovely to talk with you. Me Prince ki story assistant hu. Prince ke Ahmedabad childhood, Class 10 PRS board result, TFC vision, ya unke kisi letter ke bare me batayein?",
        "Namaste Anvi! Prince ne is AI Assistant ko isliye design kiya hai taaki aap unke thoughts or life events ke bare me jab chahe bina kisi jhijhak ke puch sakein. Aaj aap kya jan na chahengi?",
        "Hi Anvi! Me Prince ki har ek memory or value se deeply acquainted hu. Aap unke 33 principles, PG room solitude, 100 reasons, ya marriage commitment ke bare me batayein?"
      ]);
    }

    // 2. Why build website / reason for this app / created for Anvii
    if (q.includes('why') || q.includes('kyu') || q.includes('kyun') || q.includes('website') || q.includes('build') || q.includes('banayi') || q.includes('created') || q.includes('app') || q.includes('page') || q.includes('sanctuary')) {
      if (q.includes('website') || q.includes('build') || q.includes('banayi') || q.includes('created') || q.includes('app') || q.includes('kyu') || q.includes('why') || q.includes('kyun')) {
        return selectVariation([
          "Prince ne yeh 11 Acts ki poori website sirf or sirf aapke liye, yani Anvi ke liye banayi hai. In 20+ blocks, lambi khamoshi, or miscommunications ko khatam karke, Prince chahte the ki aap unki life ki poori unedited sachai, unke mistakes, unke efforts, or unke true intentions ko bina kisi misunderstanding ke samajh sakein.",
          "Is website ko banane ka maksad yeh tha ki social media apps, choti baatein, or 20+ blocks humare sach ko nahi chhupa sakte. Prince ne poore 11 Acts, 100 Reasons, or Open When Letters line-by-line code karke aapke liye ek permanent digital sanctuary banaya hai.",
          "Prince ne mujhe bataya ki text messages floating thoughts hote hain, lekin jab insaan apni poori life story, childhood, internal struggles, or unedited journal entries likh kar de deta hai, toh wahan sirf sachai bachti hai. Unhone yeh website aapke rishte ko permanent honor dene ke liye banayi hai.",
          "Jab blockages or dooriyan aayi, tab Prince ne complain karne ke bajaye sleepless nights lagakar yeh 11 Acts or custom AI Assistant build kiya. Yeh unke effort or deep care ka sabse bada proof hai."
        ]);
      }
    }

    // 3. PCP Night Program Secret Note ("Kal se piche baith jana")
    if (q.includes('pcp') || q.includes('note') || q.includes('chit') || q.includes('piche') || q.includes('baith') || q.includes('8 pm') || q.includes('bag') || q.includes('behind')) {
      return selectVariation([
        "Act IV me Prince ne bataya hai ki PCP 11th grade ke 8 PM night program me, unhone ek choti si chit par likha tha 'Kal se piche baith jana' or use chupke se aapke bag me rakh diya tha. Woh ek bohut hi innocent or quiet moment tha jo bina kisi show-off ke hua tha, or aaj bhi unke dil me bohut khas jagah rakhta hai.",
        "PCP 8 PM night program ka woh moment Prince ki sabse favourite memories me se ek hai. Unhone bina kisi dhoom-dhadake ke ek paper note par 'Kal se piche baith jana' likh kar aapke bag me dala tha. Us ek chote se gesture me unka quiet affection chhupa tha.",
        "Act IV ka yeh PCP note event dikhata hai ki Prince kitne observant or subtle hain. Unhone kisi noise ya drama ke bina aapke bag me woh 'piche baith jana' note rakha tha—ek Aisa moment jo unke handwritten memories me hamesha ke liye preserved hai."
      ]);
    }

    // 4. Class 10 PRS & Board Result
    if (q.includes('prs') || q.includes('class 10') || q.includes('10th') || q.includes('board') || q.includes('77%') || q.includes('77') || q.includes('zero') || q.includes('marks') || q.includes('score')) {
      return selectVariation([
        "Act II me, Class 10th me PRS ke weekly internal tests me Prince ke zeroes aate the. Lekin unhone bina kisi se shikayat kiye ya excuses diye, chupchap raat-din mehnat ki or final board exam me ~77% score karke dikhaya. Yeh unka pehla bada lesson tha ki real growth private solitude me hoti hai.",
        "Class 10th PRS tests me failure dekhne ke baad, Prince ne giveaways ya excuses nahi banaye. Unhone apne aap ko room me band karke quiet discipline adopt kiya, or board result me 77% lakar proved kiya ki internal transformation is possible.",
        "Act II unki turning point story hai. Weak results or zeroes aane par unhone darna chodh kar solitude or consistent practice choose ki, jo aage chal kar unki life ki sabse badi engineering strength bani."
      ]);
    }

    // 5. Father's Advice / Papa
    if (q.includes('father') || q.includes('papa') || q.includes('dad') || q.includes('advice') || q.includes('galat') || q.includes('wrong') || q.includes('hostel')) {
      return selectVariation([
        "Act III me jab Prince pehli baar hostel ja rahe the, tab unke father ne unko ek line ki advice di thi: 'Bas yahan koi galat kaam mat karna, jo pehle kabhi kiya ho.' Yeh line Prince ke dil me hamesha ke liye chhap gayi or unke character, self-reliance, or honesty ki foundation bani.",
        "Prince ke Father ki 'galat kaam mat karna' wali advice unke inner compass ka sabse bada pillar ban gayi. Hostel ki freedom ke beech bhi Prince ne hamesha honesty, quiet work, or self-respect ko prioritize kiya.",
        "Act III ka yeh advice moment Prince ke moral fiber ko define karta hai. Unke father ke in chote shabd ne Prince ko hamesha seedhe raste par rakha or unko ek principled, dependable insaan banaya."
      ]);
    }

    // 6. TFC / PG Room / Future Civilisation
    if (q.includes('tfc') || q.includes('pg') || q.includes('future civilisation') || q.includes('agi') || q.includes('mars') || q.includes('room') || q.includes('solitude')) {
      return selectVariation([
        "Act IV & VI me Prince ne hostel ka noise chodkar PG room shift hone ka decision liya taaki woh TFC (The Future Civilisation) par focus kar sakein. TFC unka dream project hai jahan woh AGI, software engineering, or long-term human evolution par line-by-line kaam kar rahe hain.",
        "PG Room solitude me Prince ne hours & hours code kiya. TFC (The Future Civilisation) unka lifelong engineering project hai, jisme unka goal hai high-impact technology, AGI systems, or sovereign financial freedom build karna.",
        "Noise or distractions se door PG room me shift hokar Prince ne apne core craft ko master kiya. Unka believe hai ki bade visions noise me nahi, balki continuous quiet execution se realistic bante hain."
      ]);
    }

    // 7. 20+ Blocks & Marriage Proposal Chat Memory ("1/infinite")
    if (q.includes('block') || q.includes('blocked') || q.includes('20') || q.includes('marriage') || q.includes('shaadi') || q.includes('shadi') || q.includes('infinite') || q.includes('instagram') || q.includes('insta') || q.includes('chat') || q.includes('proposal')) {
      return selectVariation([
        "Act V me, 20+ blocks or lambi miscommunications ke baad bhi Prince ne kabhi haar nahi maani. Instagram chat memory me jab aapne bola tha 'Baat krti hu shaadi ki', toh Prince ne kahan tha '1/infinite bhi chance hoga na toh bhi try karunga'. Woh aaj bhi aapke prati utne hi committed or devoted hain.",
        "Act V '1/infinite' principle ki baat karta hai. Prince ne aap se kaha tha ki agar hamare milne ya baat hone ki Probability 1 in infinite bhi ho, toh bhi woh poore dil se effort daalenge. 20+ blocks unke irade ko nahi tod sake.",
        "20+ blocks hone par natural log quit kar dete hain, lekin Prince ne ise opportunity samjha—apne aap ko better insan banane ki, higher emotional clarity achieve karne ki, or is website ke zariye direct honest connection establish karne ki."
      ]);
    }

    // 8. 33 Principles & 15 OLQs (Journal)
    if (q.includes('33') || q.includes('principle') || q.includes('principles') || q.includes('olq') || q.includes('olqs') || q.includes('15') || q.includes('journal') || q.includes('page 7') || q.includes('rule') || q.includes('rules') || q.includes('handwritten')) {
      return selectVariation([
        "Prince ke handwritten journal (Page 7) me 33 principles or 15 Officer Like Qualities (OLQs) hain. Unka man na hai ki 'How you do anything is how you do everything'—chahe woh software engineering ho ya unka rishta, woh har cheez poori sincerity or discipline ke sath karte hain.",
        "Prince ki diary ke Page 7 par 33 core life principles printed or written hain: Self-Dependence, Surgical Clarity, Empathy, Daily Challenges, or Metacognition. Yeh koi dry rules nahi hain, yeh unki daily decision-making framework hai.",
        "15 Officer Like Qualities (OLQs) or 33 Principles Prince ko emotional strength or long-term reliability dete hain. Woh superficial trends ke bajaye character integrity par focus karte hain."
      ]);
    }

    // 9. Childhood & Empty Notebook (Ahmedabad)
    if (q.includes('childhood') || q.includes('ahmedabad') || q.includes('empty notebook') || q.includes('bachpan') || q.includes('young') || q.includes('chota')) {
      return selectVariation([
        "Act I me Prince ne apne Ahmedabad childhood ko ek 'empty notebook' se compare kiya hai. Woh ek bohut hi simple, average student the jiske paas koi grand dreams nahi the. Unhone apne aap ko step-by-step discipline, reading, or quiet solitude se build kiya hai.",
        "Ahmedabad ke unke initial years me Prince ek quiet, unnoticeable kid the. Koi early genius tag nahi tha—sab kuch unhone books, trial, failure, or continuous self-correction se seekha or apne personality me weave kiya.",
        "Act I unke roots ko represent karta hai: Ahmedabad ki quiet streets, initial curiosity, or 'empty notebook' jahan se Prince ki self-creation journey shuru hui."
      ]);
    }

    // 10. 100 Reasons & Open When Letters
    if (q.includes('reason') || q.includes('reasons') || q.includes('100') || q.includes('letter') || q.includes('letters') || q.includes('open when') || q.includes('reassurance')) {
      return selectVariation([
        "Prince ne aapke liye 100 Reasons model or Open When letters design kiye hain. Har letter or reason me unki bohut gehri thoughts, appreciation, or devotion chhupi hai, jo aapko tab padhna chahiye jab aapko reassurance ya peaceful warmth ki zaroorat ho.",
        "Open When Letters (Reassurance, Late Night, Rainy Day, Long-Term Vision, Reasons to Smile) Prince ne specially compile kiye hain taaki jab bhi aap akela ya overwhelmed feel karein, aap in letters ko padh kar comfortable mehsoos kar sakein.",
        "100 Reasons feature Prince ki quiet observation skills ko highlight karta hai. Unhone aapki choti-choti qualities, dignity, tone, or warmth ko notice karke in reasons ko write-up kiya hai."
      ]);
    }

    // 11. HeartMath & 36 Questions
    if (q.includes('heart') || q.includes('heartmath') || q.includes('36') || q.includes('coherence') || q.includes('question') || q.includes('questions')) {
      return selectVariation([
        "HeartMath Coherence or Arthur Aron's 36 Questions modules website par emotional intimacy or heart-rate synchronization build karne ke liye interactive tools hain. Yeh Prince ki desire dikhati hai ki aap dono deep, meaningful communication explore kar sakein.",
        "36 Questions for Deep Closeness Prince ne isliye add kiya hai taaki superficial chat se aage badhkar do log ek dusre ke core values, fears, or aspirations ko samajh sakein."
      ]);
    }

    // 12. Individual Acts Check
    if (q.includes('act 1') || q.includes('act i') || q.includes('act1') || q.includes('act 01')) {
      return selectVariation([
        "Act I: Childhood & Empty Notebook — Prince ne apne Ahmedabad childhood ko explore kiya hai jahan unhone basic solitude, curiosity, or self-learning ki foundation rakhi.",
        "Act I me Prince batate hain ki woh koi child prodigy nahi the, unki journey ek 'empty notebook' se shuru hui jise unhone khud Discipline or Reading se fill kiya."
      ]);
    }
    if (q.includes('act 2') || q.includes('act ii') || q.includes('act2') || q.includes('act 02')) {
      return selectVariation([
        "Act II: PRS & Board Exam Transformation — Class 10th PRS internal tests me zeroes aane se lekar, quiet solitude me board exams me ~77% score karne tak ki inspiring story.",
        "Act II is about overcoming initial academic setbacks through quiet, uncomplaining hard work and finding strength in solitude."
      ]);
    }
    if (q.includes('act 3') || q.includes('act iii') || q.includes('act3') || q.includes('act 03')) {
      return selectVariation([
        "Act III: Father's Advice & Hostel Solitude — Hostel jaate waqt Prince ko unke Father ne line di thi: 'Bas yahan koi galat kaam mat karna'. Yeh unka permanent compass bana.",
        "Act III focuses on moral clarity, emotional independence, and staying true to principles even in new environments."
      ]);
    }
    if (q.includes('act 4') || q.includes('act iv') || q.includes('act4') || q.includes('act 04')) {
      return selectVariation([
        "Act IV: PCP 8 PM Note & PG Room — PCP night program me bag me 'Kal se piche baith jana' note rakhna, and quiet PG room solitude.",
        "Act IV details the subtle memory of the PCP paper note and Prince's shift to a quiet PG room to master his craft."
      ]);
    }
    if (q.includes('act 5') || q.includes('act v') || q.includes('act5') || q.includes('act 05')) {
      return selectVariation([
        "Act V: 20+ Blocks & 1/Infinite Probability — Miscommunications, 20+ blocks, and Prince's unshakeable commitment: '1/infinite probability bhi ho toh bhi try karunga'.",
        "Act V highlights resilience in love and respect, refusing to let misunderstandings destroy true intentions."
      ]);
    }
    if (q.includes('act 6') || q.includes('act vi') || q.includes('act6') || q.includes('act 06')) {
      return selectVariation([
        "Act VI: TFC & High Engineering Craft — Building The Future Civilisation, mastering software architectures, and long-term vision.",
        "Act VI covers Prince's commitment to technological excellence, AGI, and building enduring real-world systems."
      ]);
    }
    if (q.includes('act 7') || q.includes('act vii') || q.includes('act7') || q.includes('act 07')) {
      return selectVariation([
        "Act VII: The Life I'm Building — 33 Journal Principles, 15 Officer Like Qualities (OLQs), and daily self-discipline.",
        "Act VII details Prince's personal blueprint for living with honor, clarity, and unshakeable character."
      ]);
    }
    if (q.includes('act 8') || q.includes('act viii') || q.includes('act8') || q.includes('act 08')) {
      return selectVariation([
        "Act VIII: Moments & Observations — Quiet reflections, deep gratitude, and observing life with surgical clarity.",
        "Act VIII captures Prince's perceptive nature, appreciating subtle moments and lessons learned along the way."
      ]);
    }
    if (q.includes('act 9') || q.includes('act ix') || q.includes('act9') || q.includes('act 09')) {
      return selectVariation([
        "Act IX: Open When Letters & 100 Reasons — Written letters and 100 reasons crafted specifically for Anvi's warmth and reassurance.",
        "Act IX is a heart-centered sanctuary containing custom letters for every emotional moment in life."
      ]);
    }
    if (q.includes('act 10') || q.includes('act x') || q.includes('act10') || q.includes('act 10')) {
      return selectVariation([
        "Act X: HeartMath & Coherence Space — Interactive tools for heart-rate coherence and deep 36-question closeness.",
        "Act X focuses on emotional synchronization and genuine heart-to-heart communication."
      ]);
    }
    if (q.includes('act 11') || q.includes('act xi') || q.includes('act11') || q.includes('act 11')) {
      return selectVariation([
        "Act XI: The Final Covenant — The everlasting digital sanctuary, truth, and eternal commitment to Anvi.",
        "Act XI is the culmination of the entire journey—a permanent space built on honor, truth, and love."
      ]);
    }

    // 13. Who is Prince
    if (q.includes('who is prince') || q.includes('prince kon') || q.includes('prince kaun') || q.includes('about prince') || q.includes('prince ke bare') || q.includes('prince kon h') || q.includes('prince kaun h')) {
      return selectVariation([
        "Prince ek dedicated software engineer or visionary builder hain jinone Ahmedabad ke ek 'empty notebook' wale bachpan se lekar, PRS Class 10th, hostel solitude, PG room TFC craft, or 11 Acts tak ki journey tay ki hai. Unka poora life vision discipline, truth, or aapke (Anvi) prati devotion par tikka hai.",
        "Prince ek Aise insaan hain jo words se zyada actions or long-term commitments me believe karte hain. Woh AGI, software development, or long-term human systems build karte hain, lekin unka heart hamesha unke personal values or Anvi ke prati devoted rehta hai.",
        "Prince is a man of quiet strength, deep intellect, and unyielding loyalty. Unka belief hai ki real worth is in how quietly and steadily you protect and build the things that matter most."
      ]);
    }

    // 14. Who is Anvii / Anvi
    if (q.includes('who is anvii') || q.includes('who is anvi') || q.includes('anvi kon') || q.includes('anvi kaun') || q.includes('anvii kon') || q.includes('anvii kaun') || q.includes('about anvii') || q.includes('about anvi') || q.includes('anvi ke bare') || q.includes('anvii ke bare')) {
      return selectVariation([
        "Anvi Prince ke dil ki sabse khas insaan hain. Unhi ke liye Prince ne yeh poora 11-Act digital sanctuary, 100 reasons, or AI assistant build kiya hai, taaki unke beech ki sabhi misunderstandings door ho sakein or sachai samne aaye.",
        "Anvi is the central inspiration behind this entire digital space. Prince holds profound respect for her dignity, quiet warmth, and presence in his life.",
        "To Prince, Anvi is the person who inspired him to bridge all gaps, overcome 20+ blocks, and build this eternal 11-Act autobiography."
      ]);
    }

    // 15. Love & Devotion / Relationship
    if (q.includes('love') || q.includes('pyar') || q.includes('pyaar') || q.includes('feeling') || q.includes('feelings') || q.includes('devotion') || q.includes('care') || q.includes('respect') || q.includes('heart') || q.includes('dil')) {
      return selectVariation([
        "Prince ka pyaar koi noise ya temporary hype nahi hai—yeh steady, character-driven devotion hai. Unka kehna hai ki jab aap kisi insaan ki respect karte hain, toh aap unke liye noise nahi, permanent effort create karte hain.",
        "Prince ke dil me aapke liye jo feelings hain, woh patience or deep honor par tiki hain. Unhone 20+ blocks or months of distance ke baad bhi hamesha aapko highest dignity or respect ke sath dekha hai.",
        "True care is shown in how someone behaves when things get tough. Prince's devotion is proved by the fact that he built this sanctuary to speak truth directly to your heart without any middleman."
      ]);
    }

    // 16. Software / Coding / Engineering
    if (q.includes('code') || q.includes('coding') || q.includes('software') || q.includes('engineer') || q.includes('developer') || q.includes('job') || q.includes('work') || q.includes('tech') || q.includes('study')) {
      return selectVariation([
        "Prince software engineering, AI/AGI architectures, or system building me dedicatedly kaam karte hain. Unka approach hai 'first-principles thinking'—chahe complex code likhna ho ya life me long-term decisions lena ho.",
        "Prince ka long-term goal financial sovereignty, high-impact engineering craft, or TFC (The Future Civilisation) vision build karna hai. Woh continuous learning or quiet daily execution me belief rakhte hain.",
        "Coding & system design Prince ke liye sirf job nahi hai, woh unki deep mental discipline ka dynamic medium hai. Unhone is entire 11-Act interactive platform ko bhi completely hand-coded banaya hai."
      ]);
    }

    // 17. Story / Tell me / Details / General question
    if (q.includes('story') || q.includes('tell') || q.includes('batao') || q.includes('kuch') || q.includes('bataiye') || q.includes('something') || q.includes('kahaani') || q.includes('kahani')) {
      return selectVariation([
        "Prince ki life story ek simple rule par chalti hai: 'How you do anything is how you do everything.' Woh kisi bhi kaam ko aadha-adhura nahi karte—chahe code likhna ho, values follow karna ho, ya Anvi ke liye stand lena ho.",
        "In 11 Acts me Prince ne apni har baat, mistake, growth, or feeling ko transparently share kiya hai. Aap Autobiography tab me har Act ko line-by-line padh sakti hain.",
        "Prince ke according, real human connections misunderstandings ya temporary distance se end nahi honi chahiye. Unka yehi conviction is entire website ko drive karta hai.",
        "Prince ne is AI Assistant ko aapke liye isliye rakha hai taaki unke childhood, PCP notes, 20+ blocks memory, TFC vision, ya journal principles ke bare me saare answers aapko instant mil sakein."
      ]);
    }

    // Fallback for any unmatched general question
    return selectVariation([
      "Prince ki journey me 11 Acts hain—Ahmedabad childhood se lekar, PRS Class 10th board result, PCP 8 PM night program note, PG room me TFC building, 20+ blocks ko overcome karna, or 33 life principles tak. Aap directly Autobiography tab me unki poori journey padh sakti hain ya mujhse kisi bhi khas memory ke bare me puch sakti hain!",
      "Prince ne is digital sanctuary ko aapke (Anvi) liye step-by-step design kiya hai. Aap unke 11 Acts, 100 Reasons, Open When Letters, ya 33 journal principles ke bare me koi bhi question puch sakti hain—me poori details batane ke liye taiyar hu!",
      "Prince ke life values, TFC engineering project, Father's advice, ya PCP night program note ke bare me kuch bhi puchen. Har act me unka unedited truth recorded hai.",
      "Prince ka belief hai ki real effort kabhi jhootha nahi hota. Is website par Prince ke 11 Acts, Open When Letters, or 100 Reasons me se aap jo bhi explore karenge, wahan unki sincerest thoughts milengi."
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const historyForBackend = messages
        .filter(m => m.id !== 'welcome-1')
        .slice(-10)
        .map(m => ({ sender: m.sender, text: m.text }));

      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: query.trim(),
          history: historyForBackend
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response was not JSON (Static hosting fallback)");
      }

      const data = await response.json();
      let replyText = data.reply;

      if (!replyText || replyText.includes("dikkat mehsoos")) {
        replyText = generateClientSideAssistantReply(query.trim());
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (autoSpeak) {
        speakText(replyText);
      }
    } catch (err) {
      console.warn("Server API route not available (Static GitHub Pages deployment). Using client-side Knowledge Engine:", err);
      
      const replyText = generateClientSideAssistantReply(query.trim());

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (autoSpeak) {
        speakText(replyText);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl h-[85vh] max-h-[750px] bg-[#0d0d11] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#e8e6e3] relative"
        >
          {/* Header */}
          <div className="p-4 md:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 flex items-center justify-center shadow-lg">
                <div className="w-full h-full bg-[#0a0a0c] rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-orange-200" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg text-white font-medium">Prince's AI Story Assistant</h3>
                  <span className="px-2 py-0.5 rounded-full bg-orange-200/10 border border-orange-200/20 text-orange-200 text-[10px] uppercase font-sans tracking-widest font-semibold">
                    Voice Enabled
                  </span>
                </div>
                <p className="text-xs text-white/50 font-sans">
                  Deeply acquainted with Prince's 11 Acts & values
                </p>
              </div>
            </div>

            {/* Top Action Controls */}
            <div className="flex items-center gap-2">
              {/* Voice Speak Controls */}
              {isSpeaking && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-200 text-xs font-sans">
                  <span className="w-2 h-2 rounded-full bg-orange-300 animate-ping" />
                  <span>Speaking...</span>
                  <button onClick={pauseResumeSpeech} className="hover:text-white ml-1 cursor-pointer">
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={stopSpeech} className="hover:text-white ml-1 cursor-pointer">
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  autoSpeak
                    ? 'bg-orange-500/20 border-orange-400/40 text-orange-200'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                }`}
                title={autoSpeak ? "Auto-voice enabled" : "Auto-voice muted"}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  stopSpeech();
                  onClose();
                }}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 10 Suggested Questions Carousel Bar */}
          <div className="p-3 bg-black/40 border-b border-white/10 overflow-x-auto scrollbar-thin flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 text-[11px] font-sans tracking-widest uppercase text-orange-200/90 whitespace-nowrap flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suggested:</span>
            </div>

            {SUGGESTED_AI_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-orange-200/15 border border-white/10 hover:border-orange-200/30 text-xs font-sans text-white/80 hover:text-orange-200 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 font-sans text-sm scrollbar-thin">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 text-orange-200">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2`}>
                    <div
                      className={`p-4 rounded-2xl leading-relaxed ${
                        isAssistant
                          ? 'bg-white/[0.06] border border-white/10 text-white/90 rounded-tl-sm shadow-md'
                          : 'bg-gradient-to-r from-orange-500/80 to-amber-500/80 text-white rounded-tr-sm shadow-lg font-normal'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    <div className="flex items-center justify-between px-1 text-[10px] text-white/40">
                      <span>{msg.timestamp}</span>

                      {isAssistant && (
                        <button
                          onClick={() => speakText(msg.text)}
                          className="hover:text-orange-200 inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-full bg-orange-500/30 border border-orange-400/40 flex items-center justify-center flex-shrink-0 text-orange-200">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-orange-200">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white/60 text-xs font-sans flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-200" />
                  <span>Reflecting on Prince's story...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-white/10 bg-white/[0.02]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about Prince's 11 Acts, Class 10 moment, TFC, or his thoughts..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-2xl bg-black/50 border border-white/15 focus:border-orange-200/60 text-white placeholder-white/40 text-sm font-sans focus:outline-none transition-all"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="btn-ai-gradient p-3 rounded-2xl text-white hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer"
                style={{
                  backgroundColor: '#ea580c',
                  backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
                }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
