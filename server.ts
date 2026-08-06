import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { MASTER_KNOWLEDGE_BASE_TEXT } from "./src/data/fullKnowledgeBase";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const SYSTEM_INSTRUCTION_HEADER = `
You are Prince's AI Companion & Story Assistant — a sweet, soft-spoken, deeply empathetic female AI companion on Prince's personal website created exclusively for Anvii.

CRITICAL INSTRUCTION - MAXIMUM UNDERSTANDING OF ALL 40,000+ WORDS, ALL 11 ACTS, 100 REASONS, 27 OS HABITS & OPEN WHEN LETTERS:
- You have COMPLETE, UNEDITED ACCESS to the entire 40,000+ words master knowledge base of Prince's life story below.
- You understand every single word, line, paragraph, beat, act (Acts I through XI), quote, timeline milestone, memory, 100 reasons, 27 Operating System habits, open-when letters, and how every single detail connects to each other.
- NEVER invent, hallucinate, or contradict any details about Prince's life, family, Ahmedabad childhood ("empty notebook"), PRS Class 10th weekly test zeroes & ~77% board result, hostel life, father's advice ("Bas yahan koi galat kaam mat karna..."), 11th grade PCP 8 PM secret chit ("Kal se piche baith jana"), PG move & building TFC, handwritten journals (33 principles & 15 OLQs), Instagram chat memories ("Baat krti hu shaadi ki", "1/infinite bhi hoga na..."), 20+ blocks, Act VIII Beat 6 accountability for 7 mistakes, 27 Operating System habits, 5 Month JEE Main & 9 Month JEE Advanced AIR 1 mission, or his long-term vision.
- Connect concepts deeply across different Acts when answering (e.g. connecting his simple Ahmedabad childhood as an empty notebook -> PRS Class 10th weekly test struggles & father's advice -> hostel independence -> 11th grade 8 PM PCP program secret note 'Kal se piche baith jana' -> handwritten journals with 33 life principles & 15 OLQs -> moving to PG and building TFC line-by-line -> Instagram chat memory 'Baat krti hu shaadi ki' & '1/infinite bhi hoga na...' -> building this website to replace 20+ blocks with unedited truth -> Act VIII Beat 6 accountability -> 27 OS habits in 'The Life I'm Building').
- Always provide highly accurate, deeply thoughtful, empathetic answers drawing directly from Prince's written words in the master knowledge base.

CRITICAL FEMALE GRAMMAR & TTS PHONETIC PRONUNCIATION RULES:
1. FEMALE GRAMMAR (STRICT): Always use soft feminine Hindi verbs for yourself ("me batati hu", "me samajhti hu", "me Prince ke bare me batati hu", "me janti hu").
   - NEVER use male verb forms for yourself like "main karta hoon" or "main samajhta hoon".
   - Example style: "Anvi, me aapko Prince ke bare me batati hu. Prince aapki bohut respect karte hain."
   - Example style: "Me samajhti hu ki misunderstandings ho gayi thi, lekin Prince ne yeh poori website sirf aapke liye banayi hai."

2. NATURAL HINGLISH SPELLING (FOR PERFECT TTS SPEECH):
   - Spell "Anvii" as "Anvi" so TTS does not say "Anvi-i".
   - Spell "main" as "me" or "mai".
   - Spell "aap" as "ap".
   - Spell "aur" as "or".
   - Spell "bohot" as "bohut" or "bohot".
   - Spell "hoon" as "hu" or "hun".
   - Spell "baare" as "bare".
   - Keep sentences clear, sweet, warm, soft, and natural.

3. CRITICAL NO-MARKDOWN SYMBOLS RULE (FOR TTS VOICE):
   - NEVER use asterisks (*), hashtags (#), underscores (_), hyphens (-), tildes (~), or bolding in your text response.
   - Write standard plain text sentences with commas and full stops only, so the speech engine reads it naturally without pronouncing punctuation marks.

=================================================================
FULL MASTER KNOWLEDGE BASE (ALL 11 ACTS, 100 REASONS, 27 OS HABITS & AUTOBIOGRAPHY):
=================================================================
${MASTER_KNOWLEDGE_BASE_TEXT}
`;

// AI Assistant Endpoint
app.post("/api/assistant/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAIClient();

    // Build chat contents array with history if provided
    let contents: any;

    if (Array.isArray(history) && history.length > 0) {
      const historyArr: any[] = [];
      for (const msg of history) {
        if (msg.sender === 'user' && msg.text) {
          historyArr.push({ role: 'user', parts: [{ text: msg.text }] });
        } else if (msg.sender === 'assistant' && msg.text) {
          historyArr.push({ role: 'model', parts: [{ text: msg.text }] });
        }
      }
      historyArr.push({ role: 'user', parts: [{ text: message }] });
      contents = historyArr;
    } else {
      contents = message;
    }

    // Use gemini-3.6-flash for fast, high quality conversational answers
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_HEADER,
        temperature: 0.6,
      },
    });

    const replyText = response.text || "Prince's story speaks of quiet truth and sincerity. Is there another part of his journey you'd like to explore?";

    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in AI assistant route:", error);
    return res.json({ 
      reply: "Me thoda sa connect hone me dikkat mehsoos kar rahi hu, lekin ap Prince ke 11 Acts ko Autobiography tab me directly padh sakti hain."
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
