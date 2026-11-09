import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json());

// Initialize GoogleGenAI client (accessed securely server-side)
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Server API Endpoint for Gemini Copilot with Search Grounding
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, history, systemInstruction } = req.body;

    if (!prompt && (!history || history.length === 0)) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      // If server does not have API key configured, respond with simulated assistant
      return res.json({
        text: `[NEW OS Kernel AI]: System operational. Gemini API key is not yet set in environment secrets. However, the system is fully running in local heuristic mode. Your query: "${prompt}".`,
        groundingSources: [],
        mode: 'offline-fallback',
      });
    }

    // Build contents for multi-turn or single turn
    let contents: any = prompt;
    if (history && Array.isArray(history) && history.length > 0) {
      contents = history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));
      contents.push({
        role: 'user',
        parts: [{ text: prompt }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction:
          systemInstruction ||
          'You are Nova AI, the intelligent built-in copilot for NEW OS, a futuristic high-performance browser-native operating system. You are helpful, concise, technical, and accurate. Provide clean markdown, clear instructions, code snippets when relevant, and reference search grounding when looking up recent facts.',
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const rawChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const groundingSources = rawChunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || chunk.web.uri,
        uri: chunk.web.uri,
      }));

    return res.json({
      text,
      groundingSources,
      mode: 'live-gemini',
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process AI query',
      text: `[NEW OS AI Kernel]: An error occurred while communicating with Gemini API: ${error.message || 'Unknown error'}. Switching to local recovery mode.`,
      groundingSources: [],
    });
  }
});

// System info endpoint
app.get('/api/system/info', (_req, res) => {
  res.json({
    os: 'NEW OS v2.4 (Browser-Native Engine)',
    kernel: 'WebAssembly / ECMAScript 2026',
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    status: 'OPTIMAL',
  });
});

async function startServer() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEW OS Server active on port ${PORT}`);
  });
}

startServer();
