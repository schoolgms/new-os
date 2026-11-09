import { GroundingSource } from '../types/os';

export interface GenerateResult {
  text: string;
  groundingSources: GroundingSource[];
  mode: 'live-gemini' | 'offline-fallback';
}

export async function askGeminiCopilot(
  prompt: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<GenerateResult> {
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        history,
        systemInstruction:
          'You are Nova AI, the ultra-smart native copilot for NEW OS (a high-performance browser-native operating system). You have deep knowledge of Linux, WebAssembly, TypeScript, systems architecture, and web runtimes. When asked questions about current world facts or technical docs, leverage Google Search Grounding. Provide clear, concise, beautifully formatted markdown responses.',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        text: data.text || 'No response generated.',
        groundingSources: data.groundingSources || [],
        mode: data.mode || 'live-gemini',
      };
    }
  } catch (_e) {
    // Backend API unavailable (typical in static GitHub Pages deployment)
  }

  // Pure Client-Side Static GitHub Pages Intelligence Engine
  return generateClientFallback(prompt);
}

function generateClientFallback(prompt: string): GenerateResult {
  const p = prompt.toLowerCase().trim();

  if (p.includes('neofetch') || p.includes('sysinfo') || p.includes('system') || p.includes('specs')) {
    return {
      text: `### 💻 NEW OS Host Diagnostics
- **Kernel:** WebAssembly Posix Simulator (x86_64 JS-JIT)
- **Runtime:** React 19 + Tailwind v4 + Vite 8
- **Audio Engine:** 100% Web Audio Synthesizer (No MP3 assets)
- **Storage:** LocalStorage-backed Posix VFS (\`/home/user\`)
- **Status:** All browser subsystems running at 60fps nominal rate.`,
      groundingSources: [],
      mode: 'offline-fallback',
    };
  }

  if (p.includes('github') || p.includes('deploy') || p.includes('pages') || p.includes('action')) {
    return {
      text: `### 🚀 GitHub Pages Automated Deployment
NEW OS includes a pre-configured CI/CD workflow at \`.github/workflows/deploy.yml\`.

To deploy:
1. Push your repository to GitHub on branch \`main\`.
2. Under your repo's **Settings > Pages**, set **Source** to **GitHub Actions**.
3. GitHub Actions builds the static Vite bundle and deploys to \`https://<user>.github.io/<repo>/\`.`,
      groundingSources: [
        {
          title: 'GitHub Pages Documentation',
          uri: 'https://docs.github.com/en/pages',
        },
      ],
      mode: 'offline-fallback',
    };
  }

  if (p.includes('command') || p.includes('terminal') || p.includes('shell')) {
    return {
      text: `### ⚡ Zenith Shell (nsh) Commands
NEW OS includes a functional terminal with:
- \`help\` - Displays all available commands
- \`neofetch\` - Prints the ASCII logo and system information
- \`matrix\` - Starts the iconic falling green digital rain
- \`ls\`, \`cat\`, \`touch\`, \`mkdir\`, \`rm\`, \`pwd\` - POSIX file operations
- \`calc <expr>\` - Evaluates mathematical expressions safely
- \`curl <url>\` - Fetches data from web endpoints
- \`theme <color>\` - Switches the system accent color`,
      groundingSources: [],
      mode: 'offline-fallback',
    };
  }

  return {
    text: `### 🤖 Nova AI Response
I have analyzed your request: **"${prompt}"** within the NEW OS environment.

NEW OS operates seamlessly in pure browser client mode. If you run the full-stack server with \`npm run dev\`, live Gemini 3.8 Flash reasoning with Google Search Grounding activates automatically.

**Suggestions:**
- Type \`neofetch\` in the Terminal for hardware telemetry.
- Open **File Manager** to browse and edit local documents in \`/home/user\`.
- Launch **Studio Paint** or **Audio Synth** from the dock for creative work.`,
    groundingSources: [],
    mode: 'offline-fallback',
  };
}
