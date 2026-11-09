import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Battery,
  BatteryCharging,
  Search,
  Sliders,
  RotateCcw,
  Lock,
  Info,
  Trash2,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { AccentColor, AppId } from '../../types/os';
import { soundEngine } from '../../services/audio';

interface TopBarProps {
  activeAppName?: string;
  accentColor: AccentColor;
  isOnline: boolean;
  batteryLevel: number;
  isCharging: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSpotlight: () => void;
  onToggleControlCenter: () => void;
  onLockScreen: () => void;
  onRestartDesktop: () => void;
  onResetVFS: () => void;
  onOpenApp: (appId: AppId) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeAppName,
  accentColor,
  isOnline,
  batteryLevel,
  isCharging,
  soundEnabled,
  onToggleSound,
  onOpenSpotlight,
  onToggleControlCenter,
  onLockScreen,
  onRestartDesktop,
  onResetVFS,
  onOpenApp,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showMenu, setShowMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-8 w-full bg-slate-950/70 backdrop-blur-xl border-b border-white/10 px-3.5 flex items-center justify-between text-xs text-slate-200 select-none z-50">
        {/* Zone 1: Brand wordmark & System Dropdown */}
        <div className="relative flex items-center gap-3 shrink-0" ref={menuRef}>
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowMenu(!showMenu);
            }}
            className="font-bold tracking-tight text-white hover:text-white/80 transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>NEW OS</span>
          </button>

          {/* System Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-8 left-0 w-52 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl py-1.5 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowAboutModal(true);
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>About NEW OS</span>
              </button>
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenApp('settings');
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>System Settings</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenApp('terminal');
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              >
                <span className="font-mono text-cyan-400 text-xs">&gt;_</span>
                <span>Open Terminal</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onResetVFS();
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-white/10 text-rose-300 flex items-center gap-2.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Reset Virtual Disk</span>
              </button>
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => {
                  setShowMenu(false);
                  onLockScreen();
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Lock Screen</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onRestartDesktop();
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-white/10 text-amber-300 flex items-center gap-2.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Restart Desktop</span>
              </button>
            </div>
          )}

          {/* Active Application Name */}
          <span className="text-white/40">|</span>
          <span className="font-semibold text-slate-300 whitespace-nowrap">
            {activeAppName || 'Desktop'}
          </span>
        </div>

        {/* Zone 2: Navigation Links / Quick App Launchers */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400">
          <button
            onClick={() => onOpenApp('terminal')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Terminal
          </button>
          <button
            onClick={() => onOpenApp('files')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Files
          </button>
          <button
            onClick={() => onOpenApp('editor')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Code
          </button>
          <button
            onClick={() => onOpenApp('nova-ai')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap text-cyan-300"
          >
            Nova Copilot
          </button>
          <button
            onClick={() => onOpenApp('monitor')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Activity
          </button>
        </nav>

        {/* Zone 3: Quick Action & Status Hub */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Spotlight Search Button */}
          <button
            onClick={onOpenSpotlight}
            title="Spotlight Search (Alt + Space)"
            className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors focus:outline-none"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors focus:outline-none"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-slate-300" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            )}
          </button>

          {/* Online / Network Indicator */}
          <div title={isOnline ? 'Online (Broadband Active)' : 'Offline (Local Host Mode)'}>
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-slate-300" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>

          {/* Battery Status */}
          <div
            className="flex items-center gap-1 text-[11px] text-slate-300 font-mono"
            title={`Battery: ${batteryLevel}% ${isCharging ? '(Charging)' : ''}`}
          >
            {isCharging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            )}
            <span className="hidden sm:inline">{batteryLevel}%</span>
          </div>

          {/* Control Center Trigger */}
          <button
            onClick={onToggleControlCenter}
            title="Control Center"
            className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors focus:outline-none"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Clock & Calendar Popover */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowCalendar(!showCalendar);
              }}
              className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-white/10 text-slate-200 font-medium transition-colors focus:outline-none"
            >
              <span>{currentDate}</span>
              <span className="font-mono text-cyan-300">{currentTime}</span>
            </button>

            {/* Calendar Popover */}
            {showCalendar && (
              <div className="absolute right-0 top-8 w-64 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl p-4 z-50 text-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 font-medium text-xs">
                    <CalendarIcon className="w-4 h-4 text-cyan-400" />
                    <span>System Calendar</span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-mono">{currentTime}</span>
                </div>
                <div className="pt-3 text-center">
                  <div className="text-xl font-bold tracking-tight text-white">{currentDate}</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    NEW OS Browser Session Active
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* About NEW OS Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="w-full max-w-md bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl p-6 text-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3.5 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-cyan-500/30">
                N
              </div>
              <div>
                <h3 className="text-base font-bold text-white">NEW OS</h3>
                <p className="text-xs text-slate-400">Version 2.4 (Browser-Native Engine)</p>
              </div>
            </div>

            <div className="py-4 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Architecture</span>
                <span className="font-mono text-cyan-300">x86_64 WebAssembly JIT</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">UI Composite</span>
                <span>React 19 + Tailwind v4 + Glassmorphism</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Audio Engine</span>
                <span>Web Audio Synthesizer (0 External MP3s)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">AI Engine</span>
                <span>Gemini 3.8 Flash + Search Grounding</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Deployment</span>
                <span>Automated GitHub Pages via GitHub Actions</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
