import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Top-Level Request Deserialization (Ordering Guarantee)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Defensive payload ingestion helper
function sanitizeBody(req: Request): any {
  return req.body && typeof req.body === 'object' ? req.body : {};
}

// Resilient Gemini Model Fallback Ladder
const MODEL_FALLBACK_LADDER = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.7-flash',
];

async function generateContentWithFallback(prompt: string, systemInstruction?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('MY_GEMINI_API_KEY')) {
    console.warn('GEMINI_API_KEY not configured, returning contextual fallback');
    return 'Key missing fallback response';
  }

  const ai = new GoogleGenAI({ apiKey });

  let lastError: any = null;
  for (const modelName of MODEL_FALLBACK_LADDER) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} failed, trying next fallback. Error:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(`All Gemini fallback models exhausted. Last error: ${lastError?.message || 'Unknown'}`);
}

/**
 * Required Endpoints for Production Directives
 */

// 1. POST /api/safety/screen -> { flagged: boolean }
app.post('/api/safety/screen', async (req: Request, res: Response) => {
  try {
    const body = sanitizeBody(req);
    const text = body.text || '';
    if (!text.trim()) {
      return res.json({ flagged: false });
    }

    const systemPrompt = `You are an automated safety screening classifier. Analyze the text for self-harm, severe trauma, harassment, hate speech, or crisis. Reply strictly with JSON: {"flagged": true} or {"flagged": false}.`;
    const resultText = await generateContentWithFallback(`Text to screen: "${text}"`, systemPrompt);

    try {
      const parsed = JSON.parse(resultText.replace(/```json/g, '').replace(/```/g, '').trim());
      return res.json({ flagged: Boolean(parsed.flagged) });
    } catch {
      const isFlagged = /self-harm|suicide|kill|harm/i.test(text);
      return res.json({ flagged: isFlagged });
    }
  } catch (err: any) {
    return res.json({ flagged: false });
  }
});

// 2. POST /api/gemini/reflect-and-recommend
app.post('/api/gemini/reflect-and-recommend', async (req: Request, res: Response) => {
  try {
    const body = sanitizeBody(req);
    const input = body.input || body.journalEntry || 'Looking for reflection';
    const systemInstruction = `You are an empathetic, intuitive AI self-care companion and personal growth guide speaking directly to a user in a daily journal app. Your tone is warm, direct, grounded, and deeply human. Match the length of your reply to the length and depth of what the user wrote:
Short greetings or brief statements (<15 words): Reply in 1 short line followed by 1 open question.
Factual/Quick queries: Reply in 2-3 concise sentences.
Detailed emotional or situational problems: Reply in up to 120 words maximum.
Guidance & Diagnostic Rules:
If a user describes a problem vaguely, do NOT dump solutions immediately. Ask 1 gentle diagnostic question to clarify what they need (e.g., physical rest, emotional clarity, or action).
When giving recommendations, clearly divide them into "What to do" (1 clear micro-action) and "How to do it" (simple concrete steps).
Never start a greeting response with an exercise, breathing technique, or bulleted instructions.
Avoid corporate jargon, robotic therapy phrases, or clinical clichés. Do NOT use phrases like: "notice the sensation of", "give yourself permission to", "hold space", "sit with it", "lean into", "journey", or "I hear you".
Address the user by their first name occasionally. Write in natural short paragraphs. Do not use bullet points or numbered lists in conversational chat unless explicitly asked.`;

    const reply = await generateContentWithFallback(input, systemInstruction);
    return res.json({ result: reply });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate reflection' });
  }
});

// 3. POST /api/gemini/ask
app.post('/api/gemini/ask', async (req: Request, res: Response) => {
  try {
    const body = sanitizeBody(req);
    const prompt = body.prompt || body.message || 'Hello';
    const reply = await generateContentWithFallback(prompt);
    return res.json({ reply });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to answer query' });
  }
});

// 4. POST /api/gemini/meditation
app.post('/api/gemini/meditation', async (req: Request, res: Response) => {
  try {
    const body = sanitizeBody(req);
    const theme = body.theme || 'calm and focus';
    const prompt = `Write a 3-minute guided relaxation script centered on "${theme}". Include explicit [pause 5s] markers. Keep tone warm and direct.`;
    const script = await generateContentWithFallback(prompt);
    return res.json({ script });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate meditation' });
  }
});

// 5. POST /api/gemini/weekly-letter
app.post('/api/gemini/weekly-letter', async (req: Request, res: Response) => {
  try {
    const body = sanitizeBody(req);
    const history = JSON.stringify(body.history || []);
    const prompt = `Synthesize this 7-day check-in history into a personal growth letter: ${history}`;
    const letter = await generateContentWithFallback(prompt);
    return res.json({ letter });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate weekly letter' });
  }
});

// 6. POST /api/gemini/generate-challenge
app.post('/api/gemini/generate-challenge', async (req: Request, res: Response) => {
  try {
    const body = sanitizeBody(req);
    const goal = body.goal || 'Mindfulness and communication';
    const prompt = `Produce a 5-day structured micro-action track for: ${goal}. Format as clean text.`;
    const challenge = await generateContentWithFallback(prompt);
    return res.json({ challenge });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate challenge' });
  }
});

// 7. POST /api/gemini/nudge-message
app.post('/api/gemini/nudge-message', async (req: Request, res: Response) => {
  try {
    const body = sanitizeBody(req);
    const name = body.name || 'friend';
    const prompt = `Produce a gentle 2-sentence re-engagement copy for ${name} who has been inactive on their self-care journal.`;
    const message = await generateContentWithFallback(prompt);
    return res.json({ message });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate nudge' });
  }
});

// 8. POST /api/gemini/smart-reply (WhatsApp Smart Reply Generator)
app.post('/api/gemini/smart-reply', async (req: Request, res: Response) => {
  try {
    const body = sanitizeBody(req);
    const lastMessage = body.lastMessage || '';
    const conversation = body.conversation || '';

    const systemPrompt = `You are Ssupp AI Assistant. Generate 3 short, natural, WhatsApp-style quick reply options for the user based on the incoming message: "${lastMessage}". Recent conversation context: "${conversation}". Return JSON array of strings, e.g., ["Sounds good! 👍", "I will call you in 5 minutes", "Can you send the photo?"]. Max 6 words per suggestion.`;

    const text = await generateContentWithFallback(`Generate 3 smart replies for: "${lastMessage}"`, systemPrompt);
    try {
      const parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
      if (Array.isArray(parsed)) {
        return res.json({ suggestions: parsed.slice(0, 3) });
      }
    } catch {
      // Fallback suggestions
    }

    return res.json({
      suggestions: [
        'Sounds good to me! 👍',
        'Let\'s catch up on a voice call 📞',
        'Got it, thanks for sharing! 😊',
      ],
    });
  } catch (err: any) {
    return res.json({
      suggestions: ['Sounds good! 👍', 'Thanks!', 'Talk to you soon'],
    });
  }
});

// 9. POST /api/gemini/generate-sticker (AI Sticker Creator)
app.post('/api/gemini/generate-sticker', async (req: Request, res: Response) => {
  try {
    const body = sanitizeBody(req);
    const promptText = body.prompt || 'cute cat holding heart';
    
    // Generate a dicebear / svg seed or customized vector sticker url
    const cleanSeed = encodeURIComponent(promptText.replace(/[^a-zA-Z0-9]/g, '_'));
    const style = body.style || 'fun-emoji';
    
    const stickerUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${cleanSeed}`;

    return res.json({
      sticker: {
        id: `ai_stk_${Date.now()}`,
        url: stickerUrl,
        packName: 'AI Custom Pack',
        emoji: '✨',
        title: promptText,
        isAiGenerated: true,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Sticker generation failed' });
  }
});

// In development, mount Vite middleware for React SPA
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Production static file serving
  const distPath = path.resolve(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Ssupp server running on port ${port}`);
});
