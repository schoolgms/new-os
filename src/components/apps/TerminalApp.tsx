import React, { useState, useEffect, useRef } from 'react';
import { vfs } from '../../services/vfs';
import { soundEngine } from '../../services/audio';
import { AccentColor } from '../../types/os';

interface TerminalAppProps {
  onSetAccentColor?: (c: AccentColor) => void;
  onRestartDesktop?: () => void;
}

interface CommandOutput {
  id: string;
  command: string;
  result: string | React.ReactNode;
  isError?: boolean;
}

const NEOFETCH_ASCII = `
   _  _ _____ _    _    ____   _____ 
  | \\| | ____| |  | |  / __ \\ / ____|
  | .\` |  _| | |/\\| | | |  | | (___  
  | |\\ | |___\\  /\\  / | |__| |\\___ \\ 
  |_| \\_|_____/\\/  \\/   \\____/ ____) |
                              |_____/ 
`;

export const TerminalApp: React.FC<TerminalAppProps> = ({ onSetAccentColor, onRestartDesktop }) => {
  const [currentDir, setCurrentDir] = useState<string>('/home/user');
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [outputs, setOutputs] = useState<CommandOutput[]>([
    {
      id: 'welcome',
      command: '',
      result: (
        <div className="space-y-1 text-slate-300">
          <div className="text-cyan-400 font-bold">
            Zenith POSIX Interactive Shell (nsh v2.4-wasm)
          </div>
          <div>Type <span className="text-emerald-400 font-semibold">help</span> to view available commands or <span className="text-emerald-400 font-semibold">neofetch</span> for system telemetry.</div>
        </div>
      ),
    },
  ]);
  const [isMatrixMode, setIsMatrixMode] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  // Terminal Matrix Rain Effect Mode
  useEffect(() => {
    if (!isMatrixMode) return;
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const characters = '0123456789ABCDEF0101010101';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isMatrixMode]);

  const executeCommand = async (rawCmd: string) => {
    soundEngine.playKeypress();
    const cmd = rawCmd.trim();
    if (!cmd) return;

    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const parts = cmd.split(' ').filter(Boolean);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let result: string | React.ReactNode = '';
    let isError = false;

    switch (command) {
      case 'help':
        result = (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-xs">
            <div><span className="text-cyan-400 font-semibold">help</span> : Show this manual</div>
            <div><span className="text-cyan-400 font-semibold">neofetch</span> : Show hardware specs</div>
            <div><span className="text-cyan-400 font-semibold">matrix</span> : Toggle digital rain</div>
            <div><span className="text-cyan-400 font-semibold">clear</span> : Clear terminal display</div>
            <div><span className="text-cyan-400 font-semibold">ls [path]</span> : List directory files</div>
            <div><span className="text-cyan-400 font-semibold">cd &lt;dir&gt;</span> : Change current directory</div>
            <div><span className="text-cyan-400 font-semibold">pwd</span> : Print current directory</div>
            <div><span className="text-cyan-400 font-semibold">cat &lt;file&gt;</span> : View file contents</div>
            <div><span className="text-cyan-400 font-semibold">touch &lt;file&gt;</span> : Create new empty file</div>
            <div><span className="text-cyan-400 font-semibold">mkdir &lt;dir&gt;</span> : Create directory</div>
            <div><span className="text-cyan-400 font-semibold">rm &lt;path&gt;</span> : Remove file/folder</div>
            <div><span className="text-cyan-400 font-semibold">echo &lt;text&gt;</span> : Print text</div>
            <div><span className="text-cyan-400 font-semibold">calc &lt;math&gt;</span> : Evaluate expression</div>
            <div><span className="text-cyan-400 font-semibold">curl &lt;url&gt;</span> : HTTP fetch simulation</div>
            <div><span className="text-cyan-400 font-semibold">theme &lt;color&gt;</span> : Set accent color</div>
            <div><span className="text-cyan-400 font-semibold">uptime / date</span> : Telemetry info</div>
          </div>
        );
        break;

      case 'clear':
        setOutputs([]);
        setInputVal('');
        return;

      case 'matrix':
        setIsMatrixMode(!isMatrixMode);
        result = isMatrixMode ? 'Matrix mode disabled.' : 'Matrix visual mode enabled. Press matrix again to stop.';
        break;

      case 'pwd':
        result = currentDir;
        break;

      case 'cd': {
        const target = args[0] || '~';
        const resolved = vfs.resolvePath(currentDir, target);
        const node = vfs.getNode(resolved);
        if (node && node.isDirectory) {
          setCurrentDir(resolved);
        } else {
          result = `cd: no such file or directory: ${target}`;
          isError = true;
        }
        break;
      }

      case 'ls': {
        const target = args[0] ? vfs.resolvePath(currentDir, args[0]) : currentDir;
        const items = vfs.listDirectory(target);
        if (items.length === 0) {
          result = '(empty directory)';
        } else {
          result = (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {items.map((item) => (
                <span
                  key={item.id}
                  className={item.isDirectory ? 'text-cyan-400 font-bold' : 'text-slate-200'}
                >
                  {item.name}{item.isDirectory ? '/' : ''}
                </span>
              ))}
            </div>
          );
        }
        break;
      }

      case 'cat': {
        if (!args[0]) {
          result = 'cat: missing file operand';
          isError = true;
        } else {
          const path = vfs.resolvePath(currentDir, args[0]);
          const node = vfs.getNode(path);
          if (!node) {
            result = `cat: ${args[0]}: No such file or directory`;
            isError = true;
          } else if (node.isDirectory) {
            result = `cat: ${args[0]}: Is a directory`;
            isError = true;
          } else {
            result = <pre className="whitespace-pre-wrap font-mono text-xs">{node.content}</pre>;
          }
        }
        break;
      }

      case 'touch': {
        if (!args[0]) {
          result = 'touch: missing file operand';
          isError = true;
        } else {
          try {
            vfs.createFile(currentDir, args[0], '');
            result = `Created file '${args[0]}'`;
          } catch (e: any) {
            result = e.message;
            isError = true;
          }
        }
        break;
      }

      case 'mkdir': {
        if (!args[0]) {
          result = 'mkdir: missing operand';
          isError = true;
        } else {
          try {
            vfs.createDirectory(currentDir, args[0]);
            result = `Created directory '${args[0]}'`;
          } catch (e: any) {
            result = e.message;
            isError = true;
          }
        }
        break;
      }

      case 'rm': {
        if (!args[0]) {
          result = 'rm: missing operand';
          isError = true;
        } else {
          const target = vfs.resolvePath(currentDir, args[0]);
          const success = vfs.deleteNode(target);
          if (success) {
            result = `Removed '${args[0]}'`;
          } else {
            result = `rm: cannot remove '${args[0]}': No such file or directory`;
            isError = true;
          }
        }
        break;
      }

      case 'echo':
        result = args.join(' ');
        break;

      case 'whoami':
        result = 'user (System Architect)';
        break;

      case 'date':
        result = new Date().toString();
        break;

      case 'uptime':
        result = `System uptime: ${Math.floor(performance.now() / 1000)} seconds since browser window initialization.`;
        break;

      case 'calc': {
        const expr = args.join(' ');
        if (!expr) {
          result = 'Usage: calc <mathematical expression>, e.g. calc (14 * 8) + 42';
        } else {
          try {
            // Safe evaluation of basic math tokens
            if (/^[0-9+\-*/().^% \t]+$/.test(expr)) {
              // eslint-disable-next-line no-eval
              const calculated = Function(`'use strict'; return (${expr})`)();
              result = `${expr} = ${calculated}`;
            } else {
              result = 'calc: invalid characters in mathematical expression';
              isError = true;
            }
          } catch (e: any) {
            result = `calc error: ${e.message}`;
            isError = true;
          }
        }
        break;
      }

      case 'theme': {
        const validThemes: AccentColor[] = ['cyan', 'emerald', 'violet', 'rose', 'amber', 'blue'];
        const chosen = args[0] as AccentColor;
        if (validThemes.includes(chosen) && onSetAccentColor) {
          onSetAccentColor(chosen);
          result = `Accent theme updated to '${chosen}'.`;
        } else {
          result = `Usage: theme <${validThemes.join('|')}>`;
        }
        break;
      }

      case 'curl': {
        const url = args[0];
        if (!url) {
          result = 'Usage: curl <https://api-endpoint.com/data>';
        } else {
          try {
            const res = await fetch(url);
            const text = await res.text();
            result = text.slice(0, 1500) + (text.length > 1500 ? '\n...[output truncated]' : '');
          } catch (e: any) {
            result = `curl error: ${e.message} (CORS policy may apply to external hosts)`;
            isError = true;
          }
        }
        break;
      }

      case 'reboot':
        if (onRestartDesktop) {
          onRestartDesktop();
          result = 'Rebooting NEW OS desktop...';
        }
        break;

      case 'neofetch':
      case 'sysinfo':
        result = (
          <div className="flex flex-col sm:flex-row gap-4 items-start py-2">
            <pre className="text-cyan-400 font-mono text-[10px] leading-tight select-none">
              {NEOFETCH_ASCII}
            </pre>
            <div className="space-y-1 text-xs font-mono">
              <div><span className="text-cyan-400 font-bold">OS</span>: NEW OS v2.4 (Browser-Native)</div>
              <div><span className="text-cyan-400 font-bold">Host</span>: WebAssembly Posix Simulator</div>
              <div><span className="text-cyan-400 font-bold">Kernel</span>: ECMAScript 2026 JIT Engine</div>
              <div><span className="text-cyan-400 font-bold">Uptime</span>: {Math.floor(performance.now() / 1000)}s</div>
              <div><span className="text-cyan-400 font-bold">Shell</span>: Zenith Shell (nsh v2.4)</div>
              <div><span className="text-cyan-400 font-bold">Resolution</span>: {window.innerWidth}x{window.innerHeight}</div>
              <div><span className="text-cyan-400 font-bold">Memory</span>: ~128MB / 4096MB (Allocated)</div>
              <div><span className="text-cyan-400 font-bold">Deploy</span>: GitHub Pages Ready</div>
            </div>
          </div>
        );
        break;

      default:
        result = `nsh: command not found: ${command}. Type 'help' for command list.`;
        isError = true;
        break;
    }

    setOutputs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: cmd,
        result,
        isError,
      },
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < history.length) {
          setHistoryIndex(nextIndex);
          setInputVal(history[nextIndex]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete files or commands
      const parts = inputVal.split(' ');
      if (parts.length === 1) {
        const cmdList = ['help', 'clear', 'neofetch', 'matrix', 'ls', 'cat', 'touch', 'mkdir', 'rm', 'pwd', 'calc', 'curl', 'theme'];
        const match = cmdList.find((c) => c.startsWith(parts[0]));
        if (match) setInputVal(match);
      } else {
        const items = vfs.listDirectory(currentDir);
        const lastPart = parts[parts.length - 1];
        const match = items.find((i) => i.name.startsWith(lastPart));
        if (match) {
          parts[parts.length - 1] = match.name;
          setInputVal(parts.join(' '));
        }
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="relative flex-1 bg-slate-950/90 text-slate-100 p-4 font-mono text-xs overflow-y-auto flex flex-col justify-start"
    >
      {isMatrixMode && (
        <canvas id="matrix-canvas" className="absolute inset-0 pointer-events-none opacity-30 z-0" />
      )}

      <div className="relative z-10 space-y-3">
        {outputs.map((out) => (
          <div key={out.id} className="space-y-1">
            {out.command && (
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-emerald-400 font-bold">user@new-os</span>
                <span className="text-slate-500">:</span>
                <span className="text-cyan-400 font-medium">{currentDir}</span>
                <span className="text-slate-300">$</span>
                <span className="text-white font-medium">{out.command}</span>
              </div>
            )}
            <div className={out.isError ? 'text-rose-400' : 'text-slate-200'}>
              {out.result}
            </div>
          </div>
        ))}

        {/* Active command prompt */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold">user@new-os</span>
          <span className="text-slate-500">:</span>
          <span className="text-cyan-400 font-medium">{currentDir}</span>
          <span className="text-slate-300">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white focus:outline-none caret-cyan-400 font-mono"
            autoFocus
            spellCheck={false}
          />
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
