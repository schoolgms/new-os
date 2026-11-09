import React from 'react';
import {
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Sun,
  Palette,
  Image as ImageIcon,
  Check,
  Disc,
} from 'lucide-react';
import { AccentColor } from '../../types/os';
import { soundEngine } from '../../services/audio';
import { ACCENT_COLORS, WALLPAPERS } from '../../services/themes';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: AccentColor;
  onSetAccentColor: (accent: AccentColor) => void;
  currentWallpaper: string;
  onSetWallpaper: (wallId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  soundVolume: number;
  onSetVolume: (vol: number) => void;
  isOnline: boolean;
  brightness: number;
  onSetBrightness: (b: number) => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  accentColor,
  onSetAccentColor,
  currentWallpaper,
  onSetWallpaper,
  soundEnabled,
  onToggleSound,
  soundVolume,
  onSetVolume,
  isOnline,
  brightness,
  onSetBrightness,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end p-3 pt-11"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-4 text-slate-100 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-150 select-none"
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="font-semibold text-xs tracking-wider uppercase text-slate-400">
            Control Center
          </span>
          <span className="text-[10px] font-mono text-cyan-400">NEW OS v2.4</span>
        </div>

        {/* Quick Toggles Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Network tile */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between h-20">
            <div className="flex items-center justify-between">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-cyan-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-amber-400" />
              )}
              <span className="text-[10px] font-medium text-slate-400">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="text-xs font-medium text-slate-200">Network Host</div>
          </div>

          {/* Sound Mute tile */}
          <button
            onClick={() => {
              onToggleSound();
              soundEngine.playClick();
            }}
            className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl p-3 flex flex-col justify-between h-20 text-left transition-colors"
          >
            <div className="flex items-center justify-between">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-rose-400" />
              )}
              <span className="text-[10px] font-medium text-slate-400">
                {soundEnabled ? 'Enabled' : 'Muted'}
              </span>
            </div>
            <div className="text-xs font-medium text-slate-200">Web Audio API</div>
          </button>
        </div>

        {/* Display Brightness Slider */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Display Brightness</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{brightness}%</span>
          </div>
          <input
            type="range"
            min={40}
            max={100}
            value={brightness}
            onChange={(e) => onSetBrightness(parseInt(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
          />
        </div>

        {/* Sound Volume Slider */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Synthesizer Volume</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {Math.round(soundVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(soundVolume * 100)}
            onChange={(e) => {
              const v = parseInt(e.target.value) / 100;
              onSetVolume(v);
              soundEngine.volume = v;
            }}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
          />
        </div>

        {/* Accent Color Chooser */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Palette className="w-4 h-4 text-violet-400" />
            <span>Accent Theme</span>
          </div>
          <div className="flex items-center justify-between gap-1.5">
            {(Object.keys(ACCENT_COLORS) as AccentColor[]).map((key) => {
              const info = ACCENT_COLORS[key];
              const isSelected = accentColor === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    onSetAccentColor(key);
                    soundEngine.playClick();
                  }}
                  title={info.name}
                  className={`w-7 h-7 rounded-full ${info.bgClass} flex items-center justify-center transition-transform ${
                    isSelected ? 'ring-2 ring-white scale-110 shadow-lg' : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wallpaper Fast Switcher */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>Wallpapers</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {WALLPAPERS.map((wall) => {
              const isSelected = currentWallpaper === wall.id;
              return (
                <button
                  key={wall.id}
                  onClick={() => {
                    onSetWallpaper(wall.id);
                    soundEngine.playClick();
                  }}
                  title={wall.name}
                  className={`h-9 rounded-lg ${wall.thumbnailClass} border transition-all ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
