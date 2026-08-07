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

  // Smart client-side fallback knowledge engine for static deployments like GitHub Pages
  const generateClientSideAssistantReply = (rawQuery: string): string => {
    const q = rawQuery.toLowerCase().trim();

    // 1. Greetings & Casual Chat
    if (/^(hy|hello|hi|hey|hie|hola|greetings|namaste|kaise|kese|kaha|kya haal)/.test(q)) {
      return "Hello Anvi! Me Prince ki AI Assistant hu. Aap bataye, aaj aap Prince ki journey, unke 11 Acts, PCP night program note, ya unke kisi khas memory ke bare me kya jan na chahti hain?";
    }

    // 2. Why build website / reason for this app / created for Anvii
    if (q.includes('why') || q.includes('kyu') || q.includes('website') || q.includes('build') || q.includes('banayi') || q.includes('created') || q.includes('app') || q.includes('page')) {
      if (q.includes('website') || q.includes('build') || q.includes('banayi') || q.includes('created') || q.includes('app') || q.includes('kyu') || q.includes('why')) {
        return "Prince ne yeh 11 Acts ki poori website sirf or sirf aapke liye, yani Anvi ke liye banayi hai. In 20+ blocks, lambi khamoshi, or miscommunications ko khatam karke, Prince chahte the ki aap unki life ki poori unedited sachai, unke mistakes, unke efforts, or unke true intentions ko bina kisi misunderstanding ke samajh sakein.";
      }
    }

    // 3. PCP Night Program Secret Note ("Kal se piche baith jana")
    if (q.includes('pcp') || q.includes('note') || q.includes('chit') || q.includes('piche baith') || q.includes('8 pm') || q.includes('bag')) {
      return "Act IV me Prince ne bataya hai ki PCP 11th grade ke 8 PM night program me, unhone ek choti si chit par likha tha 'Kal se piche baith jana' or use chupke se aapke bag me rakh diya tha. Woh ek bohut hi innocent or quiet moment tha jo bina kisi show-off ke hua tha, or aaj bhi unke dil me bohut khas jagah rakhta hai.";
    }

    // 4. Class 10 PRS & Board Result
    if (q.includes('class 10') || q.includes('prs') || q.includes('board') || q.includes('weekly test') || q.includes('77%') || q.includes('77') || q.includes('zero')) {
      return "Act II me, Class 10th me PRS ke weekly internal tests me Prince ke zeroes aate the. Lekin unhone bina kisi se shikayat kiye ya excuses diye, chupchap raat-din mehnat ki or final board exam me ~77% score karke dikhaya. Yeh unka pehla bada lesson tha ki real growth private solitude me hoti hai.";
    }

    // 5. Father's Advice / Papa
    if (q.includes('father') || q.includes('papa') || q.includes('advice') || q.includes('dad') || q.includes('galat kaam')) {
      return "Act III me jab Prince pehli baar hostel ja rahe the, tab unke father ne unko ek line ki advice di thi: 'Bas yahan koi galat kaam mat karna, jo pehle kabhi kiya ho.' Yeh line Prince ke dil me hamesha ke liye chhap gayi or unke character, self-reliance, or honesty ki foundation bani.";
    }

    // 6. TFC / PG Room / Future Civilisation
    if (q.includes('tfc') || q.includes('pg') || q.includes('future civilisation') || q.includes('agi') || q.includes('mars') || q.includes('room')) {
      return "Act IV & VI me Prince ne hostel ka noise chodkar PG room shift hone ka decision liya taaki woh TFC (The Future Civilisation) par focus kar sakein. TFC unka dream project hai jahan woh AGI, software engineering, or long-term human evolution par line-by-line kaam kar rahe hain.";
    }

    // 7. 20+ Blocks & Marriage Proposal Chat Memory ("1/infinite")
    if (q.includes('block') || q.includes('20') || q.includes('marriage') || q.includes('shaadi') || q.includes('infinite') || q.includes('instagram') || q.includes('chat')) {
      return "Act V me, 20+ blocks or lambi miscommunications ke baad bhi Prince ne kabhi haar nahi maani. Instagram chat memory me jab aapne bola tha 'Baat krti hu shaadi ki', toh Prince ne kahan tha '1/infinite bhi chance hoga na toh bhi try karunga'. Woh aaj bhi aapke prati utne hi committed or devoted hain.";
    }

    // 8. 33 Principles & 15 OLQs (Journal)
    if (q.includes('33') || q.includes('principle') || q.includes('olq') || q.includes('journal') || q.includes('rule') || q.includes('page 7')) {
      return "Prince ke handwritten journal (Page 7) me 33 principles or 15 Officer Like Qualities (OLQs) hain. Unka man na hai ki 'How you do anything is how you do everything'—chahe woh software engineering ho ya unka rishta, woh har cheez poori sincerity or discipline ke sath karte hain.";
    }

    // 9. Childhood & Empty Notebook (Ahmedabad)
    if (q.includes('childhood') || q.includes('ahmedabad') || q.includes('empty notebook') || q.includes('bachpan') || q.includes('young')) {
      return "Act I me Prince ne apne Ahmedabad childhood ko ek 'empty notebook' se compare kiya hai. Woh ek bohut hi simple, average student the jiske paas koi grand dreams nahi the. Unhone apne aap ko step-by-step discipline, reading, or quiet solitude se build kiya hai.";
    }

    // 10. 100 Reasons & Open When Letters
    if (q.includes('reason') || q.includes('open when') || q.includes('letter') || q.includes('100')) {
      return "Prince ne aapke liye 100 Reasons model or Open When letters design kiye hain. Har letter or reason me unki bohut gehri thoughts, appreciation, or devotion chhupi hai, jo aapko tab padhna chahiye jab aapko reassurance ya peaceful warmth ki zaroorat ho.";
    }

    // 11. Who is Prince
    if (q.includes('prince') || q.includes('who is prince') || q.includes('prince kon') || q.includes('prince kaun')) {
      return "Prince ek dedicated software engineer or visionary builder hain jinone Ahmedabad ke ek 'empty notebook' wale bachpan se lekar, PRS Class 10th, hostel solitude, PG room TFC craft, or 11 Acts tak ki journey tay ki hai. Unka poora life vision discipline, truth, or aapke (Anvi) prati devotion par tikka hai.";
    }

    // 12. Who is Anvii / Anvi
    if (q.includes('anvi') || q.includes('anvii')) {
      return "Anvi Prince ke dil ki sabse khas insaan hain. Unhi ke liye Prince ne yeh poora 11-Act digital sanctuary, 100 reasons, or AI assistant build kiya hai, taaki unke beech ki sabhi misunderstandings door ho sakein or sachai samne aaye.";
    }

    // Fallback for general questions
    return "Prince ki journey me 11 Acts hain—Ahmedabad childhood se lekar, PRS Class 10th board result, PCP 8 PM night program note, PG room me TFC building, 20+ blocks ko overcome karna, or 33 life principles tak. Aap directly Autobiography tab me unki poori journey padh sakti hain ya mujhse kisi bhi khas memory ke bare me puch sakti hain!";
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
                className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
