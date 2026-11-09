# 🌌 NEW OS — Browser-Native Operating System

[![Deploy to GitHub Pages](https://github.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-2.4.0--stable-emerald.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Browser--Native-cyan.svg)]()
[![Engine](https://img.shields.io/badge/Engine-React%2019%20%2B%20Tailwind%20v4-violet.svg)]()
[![AI Copilot](https://img.shields.io/badge/Copilot-Gemini%203.8%20Flash-indigo.svg)]()

> **NEW OS** is a complete, ultra-fast, visually stunning desktop operating system running **100% inside your web browser**. No ISO downloads, no USB flashing, no virtual machine emulators — pure browser-native execution ready for instant deployment on **GitHub Pages**.

---

## 🏛️ System Architecture

```
+=============================================================================+
|                                 NEW OS DESKTOP                              |
|   +---------------------------------------------------------------------+   |
|   |  TOP BAR: [Brand / Menu] · [Active App] · [WiFi/Battery/Audio/Clock] |   |
|   +---------------------------------------------------------------------+   |
|                                                                             |
|   +-------------------+  +-------------------+  +-----------------------+   |
|   |  Zenith Terminal  |  |  Virtual Files    |  |  Nova AI Copilot      |   |
|   |  - Posix shell    |  |  - Tree explorer  |  |  - Gemini 3.8 Flash   |   |
|   |  - 18+ unix cmds  |  |  - LocalStorage   |  |  - Search Grounding   |   |
|   |  - Matrix rain    |  |  - Upload/Download|  |  - Multi-turn state   |   |
|   +-------------------+  +-------------------+  +-----------------------+   |
|                                                                             |
|   +-------------------+  +-------------------+  +-----------------------+   |
|   |  Code Studio      |  |  System Activity  |  |  Web Audio Synth      |   |
|   |  - Syntax colors  |  |  - SVG live graph |  |  - Waveform engine    |   |
|   |  - Line numbers   |  |  - Task manager   |  |  - Zero MP3 assets    |   |
|   |  - Markdown live  |  |  - Host specs     |  |  - Piano keyboard     |   |
|   +-------------------+  +-------------------+  +-----------------------+   |
|                                                                             |
|   +---------------------------------------------------------------------+   |
|   |  FLOATING DOCK: [Term] [Files] [Code] [Nova] [Activity] [Paint] ... |   |
|   +---------------------------------------------------------------------+   |
+=============================================================================+
                                       |
+=============================================================================+
|                      CLIENT-SIDE EXECUTION ENGINE                           |
|  - Window Compositor: Dragging, Resizing, Snapping, Z-Index Sorting         |
|  - Virtual File System (VFS): POSIX directory hierarchy in LocalStorage     |
|  - Web Audio Synthesizer: Real-time waveform generation (Sine/Square/Saw)   |
|  - Spotlight Engine: Fast command palette (Alt + Space)                     |
|  - Performance Observer: Telemetry, Logical Cores, Memory, Event Loop       |
+=============================================================================+
                                       |
+=============================================================================+
|                   HOST PLATFORM & CONTINUOUS DEPLOYMENT                     |
|  - Vite 8 Bundler with relative base paths (`./`)                           |
|  - GitHub Actions Workflow (`.github/workflows/deploy.yml`)                 |
|  - GitHub Pages Static CDN Hosting (`https://<user>.github.io/<repo>/`)     |
|  - Optional Full-Stack Express Server with Gemini 3.8 Flash API proxy       |
+=============================================================================+
```

---

## ✨ Features & Applications

1. **Zenith Terminal (`nsh`)**:
   - Realistic POSIX-like interactive Unix shell with arrow history and Tab completion.
   - Built-in commands: `help`, `neofetch`, `matrix`, `ls`, `cat`, `touch`, `mkdir`, `rm`, `pwd`, `echo`, `calc`, `curl`, `theme`, `uptime`, `date`, `whoami`, `clear`, `reboot`.
   - Matrix digital green rain visualizer mode.

2. **File Manager (`Files`)**:
   - Persistent Virtual File System (VFS) backed by browser `LocalStorage`.
   - Seeded with `/home/user`, `/home/user/Documents`, `/home/user/Projects`, `/home/user/Notes`, and `/system`.
   - Create directories, files, upload files from your local computer, download files, or edit directly in Code Studio.

3. **Code Studio (`CodeEdit`)**:
   - Multi-feature code and text editor with line numbers, row/column counter, and character metrics.
   - Instant live Markdown renderer preview tab.
   - Save directly back to VFS (`Ctrl + S`) or export to `.txt`/`.js`/`.md`.

4. **Nova AI Copilot**:
   - Powered by **Gemini 3.8 Flash** with **Google Search Grounding**.
   - Multi-turn conversational memory with markdown responses, code copying, and external verified citation links.
   - Runs seamlessly with backend Express proxy in full-stack mode, or gracefully falls back to client-side heuristics on static GitHub Pages.

5. **System Monitor**:
   - Animated SVG real-time sparkline telemetry graphs for CPU load, Memory allocation, and Network I/O.
   - Interactive Process Manager with PID, CPU%, Memory (MB), and working "End Task / Kill" controls.
   - Real hardware detection (`navigator.hardwareConcurrency`, screen resolution, online status).

6. **Web Audio Synthesizer**:
   - Real-time sound engine running via the Web Audio API — **zero external MP3 or WAV files**.
   - Synthesizes boot chimes, window animations, tactile clicks, and alert tones.
   - Dedicated keyboard synthesizer app with visual piano keys, octave modifiers, and Sine/Square/Sawtooth/Triangle waveforms.

7. **NetSurfer Sandbox Browser**:
   - In-OS browser with address bar, search engine routing, bookmark presets (Wikipedia, DuckDuckGo, Hacker News, MDN, GitHub).

8. **Studio Paint**:
   - Canvas graphic studio with color palettes, brush sizes, eraser, canvas clearing, and PNG export.

9. **Calculator Pro**:
   - Glassmorphic calculator with standard, trigonometric, square root, power, and memory history tape.

10. **Settings & Customizer**:
    - Wallpaper presets (Cosmic Nebula, Obsidian Grid, Emerald Aurora, Solar Horizon, Abyssal Blue).
    - Accent theme switcher (Cyan, Emerald, Violet, Rose, Amber, Blue).
    - Dock position configuration (Bottom, Left, Right).
    - VFS disk storage gauge and JSON backup export / factory reset.

11. **Desktop Shell & Kiosk**:
    - Spotlight command palette (`Alt + Space` or `Cmd + K`).
    - macOS / Kiosk style Top Bar with system menu, active app name, sound toggle, WiFi, battery, and calendar popover.
    - Right-click desktop Context Menu.
    - Lock screen with animated time, date, and user avatar.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js 20+ installed
- npm 10+

### Installation & Launch
```bash
# Clone the repository
git clone https://github.com/<your-username>/new-os.git
cd new-os

# Install dependencies
npm install

# Start local full-stack development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🌐 Automated GitHub Pages Deployment

NEW OS is configured out of the box for automatic zero-config compilation and deployment via GitHub Actions.

### 1. Push to your GitHub Repository
```bash
git init
git add .
git commit -m "feat: initial commit of NEW OS"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### 2. Enable GitHub Pages in Repository Settings
1. Navigate to your repository on [GitHub](https://github.com).
2. Go to **Settings** > **Pages** (in the left navigation).
3. Under **Build and deployment > Source**, select **GitHub Actions**.

### 3. Automatic Deployment
Every time you push changes to the `main` branch, `.github/workflows/deploy.yml` will automatically:
1. Check out code and set up Node.js.
2. Run `npm ci` and `npm run build`.
3. Upload the `./dist` static output and deploy it to GitHub Pages.

Your OS is live at:
```
https://<your-username>.github.io/<your-repo-name>/
```

---

## 🛠️ Technology Stack

- **UI Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Glassmorphism (`backdrop-filter: blur`)
- **Icons**: Lucide React
- **Audio**: Web Audio API (Synthesized Real-Time AudioContext)
- **Filesystem**: Virtual POSIX File Tree persisted in `localStorage`
- **AI Engine**: `@google/genai` (Gemini 3.8 Flash + Google Search Grounding)
- **Build Tool**: Vite 8 (with relative asset base `./` for GitHub Pages)
- **CI/CD**: GitHub Actions (`deploy-pages@v4`)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
