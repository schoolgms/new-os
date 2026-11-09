import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { soundEngine } from '../../services/audio';

interface LockScreenProps {
  onUnlock: () => void;
  wallpaperStyle?: React.CSSProperties;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, wallpaperStyle }) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = () => {
    soundEngine.playBootChime();
    onUnlock();
  };

  return (
    <div
      style={wallpaperStyle}
      className="fixed inset-0 z-[100] flex flex-col justify-between items-center py-16 px-6 text-white select-none animate-in fade-in duration-300 bg-slate-950"
    >
      {/* Top Header */}
      <div className="flex items-center gap-2 text-xs text-white/60 tracking-widest uppercase">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>NEW OS Secure Kiosk</span>
      </div>

      {/* Center Clock and User Avatar */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="space-y-1">
          <div className="text-7xl sm:text-8xl font-extralight tracking-tight font-mono text-white/95">
            {time}
          </div>
          <div className="text-lg text-slate-300 font-medium tracking-wide">
            {date}
          </div>
        </div>

        {/* User Card */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-2xl shadow-cyan-500/30">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-2xl text-cyan-400">
                NO
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>

          <div className="text-center">
            <h2 className="text-base font-semibold text-white">System Architect</h2>
            <p className="text-xs text-cyan-300/80 font-mono">browser-native session</p>
          </div>

          <button
            onClick={handleUnlock}
            className="group flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
          >
            <span>Enter NEW OS</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-white/40 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Press Enter or click above to unlock desktop environment</span>
      </div>
    </div>
  );
};
