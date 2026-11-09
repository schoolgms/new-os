import { FileSystemNode } from '../types/os';

const STORAGE_KEY = 'new_os_vfs_v2';

const INITIAL_NODES: FileSystemNode[] = [
  // Root directories
  {
    id: 'root',
    name: '',
    path: '/',
    isDirectory: true,
    parentId: null,
    size: 0,
    createdAt: Date.now() - 3600000 * 24,
    modifiedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'dir_home',
    name: 'home',
    path: '/home',
    isDirectory: true,
    parentId: 'root',
    size: 0,
    createdAt: Date.now() - 3600000 * 24,
    modifiedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'dir_user',
    name: 'user',
    path: '/home/user',
    isDirectory: true,
    parentId: 'dir_home',
    size: 0,
    createdAt: Date.now() - 3600000 * 24,
    modifiedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'dir_docs',
    name: 'Documents',
    path: '/home/user/Documents',
    isDirectory: true,
    parentId: 'dir_user',
    size: 0,
    createdAt: Date.now() - 3600000 * 24,
    modifiedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'dir_projects',
    name: 'Projects',
    path: '/home/user/Projects',
    isDirectory: true,
    parentId: 'dir_user',
    size: 0,
    createdAt: Date.now() - 3600000 * 24,
    modifiedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'dir_notes',
    name: 'Notes',
    path: '/home/user/Notes',
    isDirectory: true,
    parentId: 'dir_user',
    size: 0,
    createdAt: Date.now() - 3600000 * 24,
    modifiedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'dir_system',
    name: 'system',
    path: '/system',
    isDirectory: true,
    parentId: 'root',
    size: 0,
    createdAt: Date.now() - 3600000 * 24,
    modifiedAt: Date.now() - 3600000 * 24,
  },

  // Seed Files
  {
    id: 'file_welcome',
    name: 'Welcome.txt',
    path: '/home/user/Welcome.txt',
    isDirectory: false,
    parentId: 'dir_user',
    content: `=====================================================
               WELCOME TO NEW OS v2.4
       The Browser-Native Glassmorphic Operating System
=====================================================

NEW OS runs entirely in your browser window with zero local
installations or binary ISOs required. Built with:

• Pure Web Client Runtime (HTML5, React 19, Tailwind CSS v4)
• Glassmorphism dark-mode UI with fluid multi-window desktop
• Built-in Unix-like shell with tab completion and neofetch
• Virtual File System with persistent LocalStorage backing
• Real-time Activity & Process Monitor
• Full-stack Gemini AI Copilot (gemini-3.8-flash + Search)
• Synthesizer with real-time Web Audio API waveforms
• CI/CD pipeline targeting automated GitHub Pages deployment

Tip: Press [Alt + Space] to trigger the Spotlight launcher!`,
    size: 780,
    createdAt: Date.now() - 3600000 * 12,
    modifiedAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'file_arch',
    name: 'Architecture.md',
    path: '/home/user/Documents/Architecture.md',
    isDirectory: false,
    parentId: 'dir_docs',
    content: `# NEW OS System Architecture

\`\`\`
+-------------------------------------------------------------+
|                     USER INTERACTION LAYER                   |
|  [Desktop] [TopBar] [Dock] [Spotlight] [Control Center]     |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                  WINDOW MANAGER & APPS SUITE                |
|  - Terminal (nsh)        - File Manager (vfs)               |
|  - CodeEdit Studio       - Nova AI Copilot (Gemini 3.8)     |
|  - System Monitor        - Canvas Paint Studio              |
|  - Web Sandbox Browser   - Audio Synthesizer                |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                  CORE BROWSER HARDWARE ENGINES              |
|  * Web Audio API: Zero-asset real-time synthesis            |
|  * LocalStorage VFS: Posix-like virtual file tree           |
|  * Performance Observer: CPU, Memory & Event Loop telemetry |
|  * Web Workers / Sandbox: Isolated process execution        |
+-------------------------------------------------------------+
\`\`\`

## Key Highlights
1. **Zero ISO**: No hardware flashing needed; boots in milliseconds in Chrome, Firefox, Safari, Edge.
2. **Zero Dead Clicks**: Every menu, button, and terminal command is connected to functional handlers.
3. **Stateless Fallback**: When deployed to static GitHub Pages, all services operate purely in browser memory without server dependencies.`,
    size: 1540,
    createdAt: Date.now() - 3600000 * 10,
    modifiedAt: Date.now() - 3600000 * 10,
  },
  {
    id: 'file_deploy',
    name: 'GitHub_Deployment.md',
    path: '/home/user/Documents/GitHub_Deployment.md',
    isDirectory: false,
    parentId: 'dir_docs',
    content: `# Automated GitHub Pages Deployment Guide

To deploy NEW OS to your personal GitHub Pages URL:

1. **Push to GitHub**:
   \`\`\`bash
   git init
   git add .
   git commit -m "feat: initial commit of NEW OS"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   \`\`\`

2. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub.
   - Click on **Pages** in the left sidebar.
   - Under **Build and deployment > Source**, select **GitHub Actions**.

3. **Automatic Build & Publish**:
   - The workflow \`.github/workflows/deploy.yml\` runs automatically on push to \`main\`.
   - Once complete, your OS is live at:
     \`https://<your-username>.github.io/<repo-name>/\`
`,
    size: 890,
    createdAt: Date.now() - 3600000 * 8,
    modifiedAt: Date.now() - 3600000 * 8,
  },
  {
    id: 'file_code',
    name: 'quantum_sim.js',
    path: '/home/user/Projects/quantum_sim.js',
    isDirectory: false,
    parentId: 'dir_projects',
    content: `// NEW OS Quantum Superposition Simulation
function simulateQubit() {
  const theta = Math.random() * Math.PI;
  const alpha = Math.cos(theta / 2);
  const beta = Math.sin(theta / 2);
  const prob0 = Math.pow(alpha, 2);
  const prob1 = Math.pow(beta, 2);
  const measured = Math.random() < prob0 ? 0 : 1;

  console.log({
    state: \`\${alpha.toFixed(3)}|0> + \${beta.toFixed(3)}|1>\`,
    probabilityZero: \`\${(prob0 * 100).toFixed(1)}%\`,
    probabilityOne: \`\${(prob1 * 100).toFixed(1)}%\`,
    collapsedState: measured,
  });
  return measured;
}

simulateQubit();
`,
    size: 550,
    createdAt: Date.now() - 3600000 * 4,
    modifiedAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'file_todo',
    name: 'Todo.txt',
    path: '/home/user/Notes/Todo.txt',
    isDirectory: false,
    parentId: 'dir_notes',
    content: `[✓] Integrate Glassmorphic dark desktop layout
[✓] Connect Web Audio sound effects synthesizer
[✓] Implement interactive terminal with 18+ unix commands
[✓] Add Virtual File System with file upload & download
[✓] Wire Nova Gemini 3.8 Copilot with search grounding
[✓] Add real-time CPU & Memory activity charts
[✓] Setup automated GitHub Pages Actions workflow
[ ] Star this repository on GitHub!`,
    size: 420,
    createdAt: Date.now() - 3600000 * 2,
    modifiedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'file_sysconfig',
    name: 'config.json',
    path: '/system/config.json',
    isDirectory: false,
    parentId: 'dir_system',
    content: JSON.stringify(
      {
        os: 'NEW OS',
        version: '2.4.0-stable',
        architecture: 'browser-wasm-es2026',
        theme: 'glassmorphism-dark',
        kernel: 'WebAssembly Browser Runtime',
        features: [
          'VFS',
          'WebAudio',
          'WindowComposite',
          'GeminiNovaCopilot',
          'GitHubPagesDeployable',
        ],
      },
      null,
      2
    ),
    size: 290,
    createdAt: Date.now() - 3600000 * 24,
    modifiedAt: Date.now() - 3600000 * 24,
  },
];

class VirtualFileSystem {
  private nodes: Map<string, FileSystemNode> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: FileSystemNode[] = JSON.parse(stored);
        this.nodes.clear();
        parsed.forEach((n) => this.nodes.set(n.path, n));
        return;
      }
    } catch (e) {
      console.warn('Failed to load VFS from localStorage, using defaults', e);
    }
    this.resetToDefaults();
  }

  public saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      const arr = Array.from(this.nodes.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (e) {
      console.error('Failed to save VFS to localStorage', e);
    }
  }

  public resetToDefaults() {
    this.nodes.clear();
    INITIAL_NODES.forEach((n) => this.nodes.set(n.path, { ...n }));
    this.saveToStorage();
  }

  public getNode(path: string): FileSystemNode | undefined {
    const cleanPath = this.normalizePath(path);
    return this.nodes.get(cleanPath);
  }

  public listDirectory(path: string): FileSystemNode[] {
    const cleanPath = this.normalizePath(path);
    const parentNode = this.nodes.get(cleanPath);
    if (!parentNode || !parentNode.isDirectory) return [];

    return Array.from(this.nodes.values()).filter(
      (n) => n.parentId === parentNode.id
    ).sort((a, b) => {
      // Directories first, then alphabetical
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  public createFile(dirPath: string, name: string, content: string = ''): FileSystemNode {
    const parent = this.getNode(dirPath);
    if (!parent || !parent.isDirectory) {
      throw new Error(`Directory ${dirPath} does not exist`);
    }

    const fullPath = this.normalizePath(`${dirPath === '/' ? '' : dirPath}/${name}`);
    if (this.nodes.has(fullPath)) {
      throw new Error(`File or directory '${name}' already exists at ${dirPath}`);
    }

    const now = Date.now();
    const node: FileSystemNode = {
      id: 'file_' + Math.random().toString(36).substring(2, 9),
      name,
      path: fullPath,
      isDirectory: false,
      parentId: parent.id,
      content,
      size: new Blob([content]).size,
      createdAt: now,
      modifiedAt: now,
    };

    this.nodes.set(fullPath, node);
    this.saveToStorage();
    return node;
  }

  public updateFile(path: string, content: string): FileSystemNode {
    const cleanPath = this.normalizePath(path);
    const node = this.nodes.get(cleanPath);
    if (!node || node.isDirectory) {
      throw new Error(`File ${path} not found`);
    }

    node.content = content;
    node.size = new Blob([content]).size;
    node.modifiedAt = Date.now();
    this.saveToStorage();
    return node;
  }

  public createDirectory(dirPath: string, name: string): FileSystemNode {
    const parent = this.getNode(dirPath);
    if (!parent || !parent.isDirectory) {
      throw new Error(`Parent directory ${dirPath} does not exist`);
    }

    const fullPath = this.normalizePath(`${dirPath === '/' ? '' : dirPath}/${name}`);
    if (this.nodes.has(fullPath)) {
      throw new Error(`Directory '${name}' already exists`);
    }

    const now = Date.now();
    const node: FileSystemNode = {
      id: 'dir_' + Math.random().toString(36).substring(2, 9),
      name,
      path: fullPath,
      isDirectory: true,
      parentId: parent.id,
      size: 0,
      createdAt: now,
      modifiedAt: now,
    };

    this.nodes.set(fullPath, node);
    this.saveToStorage();
    return node;
  }

  public deleteNode(path: string): boolean {
    const cleanPath = this.normalizePath(path);
    const node = this.nodes.get(cleanPath);
    if (!node || node.id === 'root') return false;

    // If directory, delete children recursively
    if (node.isDirectory) {
      const toDelete: string[] = [];
      this.nodes.forEach((n) => {
        if (n.path.startsWith(cleanPath + '/') || n.path === cleanPath) {
          toDelete.push(n.path);
        }
      });
      toDelete.forEach((p) => this.nodes.delete(p));
    } else {
      this.nodes.delete(cleanPath);
    }

    this.saveToStorage();
    return true;
  }

  public renameNode(path: string, newName: string): boolean {
    const cleanPath = this.normalizePath(path);
    const node = this.nodes.get(cleanPath);
    if (!node || node.id === 'root') return false;

    const parentPath = cleanPath.substring(0, cleanPath.lastIndexOf('/')) || '/';
    const newPath = this.normalizePath(`${parentPath === '/' ? '' : parentPath}/${newName}`);

    if (this.nodes.has(newPath)) {
      throw new Error(`An item named '${newName}' already exists in this folder`);
    }

    this.nodes.delete(cleanPath);
    node.name = newName;
    node.path = newPath;
    node.modifiedAt = Date.now();
    this.nodes.set(newPath, node);

    // If directory, update all children paths
    if (node.isDirectory) {
      this.nodes.forEach((child) => {
        if (child.path.startsWith(cleanPath + '/')) {
          const updatedChildPath = child.path.replace(cleanPath, newPath);
          this.nodes.delete(child.path);
          child.path = updatedChildPath;
          this.nodes.set(updatedChildPath, child);
        }
      });
    }

    this.saveToStorage();
    return true;
  }

  public normalizePath(path: string): string {
    if (!path) return '/';
    let p = path.replace(/\/+/g, '/');
    if (p.length > 1 && p.endsWith('/')) {
      p = p.slice(0, -1);
    }
    return p.startsWith('/') ? p : '/' + p;
  }

  public resolvePath(currentDir: string, targetPath: string): string {
    if (targetPath.startsWith('/')) {
      return this.normalizePath(targetPath);
    }
    if (targetPath === '~' || targetPath === '~/') {
      return '/home/user';
    }
    if (targetPath.startsWith('~/')) {
      return this.normalizePath('/home/user/' + targetPath.slice(2));
    }

    const segments = (currentDir + '/' + targetPath).split('/').filter(Boolean);
    const resolved: string[] = [];

    for (const seg of segments) {
      if (seg === '.') continue;
      if (seg === '..') {
        resolved.pop();
      } else {
        resolved.push(seg);
      }
    }

    return '/' + resolved.join('/');
  }

  public getAllNodes(): FileSystemNode[] {
    return Array.from(this.nodes.values());
  }
}

export const vfs = new VirtualFileSystem();
