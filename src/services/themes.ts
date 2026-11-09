import { AccentColor } from '../types/os';

export interface WallpaperPreset {
  id: string;
  name: string;
  thumbnailClass: string;
  backgroundClass: string;
  style?: React.CSSProperties;
}

export const WALLPAPERS: WallpaperPreset[] = [
  {
    id: 'cosmic-nebula',
    name: 'Cosmic Nebula',
    thumbnailClass: 'bg-gradient-to-tr from-slate-950 via-indigo-950 to-purple-900',
    backgroundClass:
      'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] bg-slate-950',
    style: {
      backgroundImage:
        'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.2) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, transparent 60%), linear-gradient(180deg, #030712 0%, #090d16 100%)',
    },
  },
  {
    id: 'cyber-dark',
    name: 'Obsidian Grid',
    thumbnailClass: 'bg-gradient-to-br from-neutral-950 via-zinc-900 to-black',
    backgroundClass: 'bg-neutral-950',
    style: {
      backgroundImage:
        'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px), radial-gradient(circle at 50% 30%, rgba(20, 184, 166, 0.15) 0%, transparent 60%), #08080a',
      backgroundSize: '40px 40px, 40px 40px, 100% 100%, 100% 100%',
    },
  },
  {
    id: 'aurora-borealis',
    name: 'Emerald Aurora',
    thumbnailClass: 'bg-gradient-to-tr from-slate-950 via-emerald-950 to-teal-900',
    backgroundClass: 'bg-slate-950',
    style: {
      backgroundImage:
        'radial-gradient(ellipse at top left, rgba(16, 185, 129, 0.25), transparent 50%), radial-gradient(ellipse at bottom right, rgba(20, 184, 166, 0.2), transparent 50%), radial-gradient(circle at center, rgba(6, 78, 59, 0.3), transparent 70%), linear-gradient(180deg, #022c22 0%, #020617 100%)',
    },
  },
  {
    id: 'solar-flare',
    name: 'Solar Horizon',
    thumbnailClass: 'bg-gradient-to-tr from-slate-950 via-amber-950 to-rose-900',
    backgroundClass: 'bg-slate-950',
    style: {
      backgroundImage:
        'radial-gradient(circle at 70% 20%, rgba(244, 63, 94, 0.25) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.2) 0%, transparent 50%), linear-gradient(180deg, #0c0a09 0%, #1c1917 50%, #030712 100%)',
    },
  },
  {
    id: 'deep-ocean',
    name: 'Abyssal Blue',
    thumbnailClass: 'bg-gradient-to-tr from-blue-950 via-cyan-950 to-slate-950',
    backgroundClass: 'bg-slate-950',
    style: {
      backgroundImage:
        'radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.25) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), linear-gradient(180deg, #030712 0%, #082f49 100%)',
    },
  },
];

export const ACCENT_COLORS: Record<
  AccentColor,
  {
    name: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    ringClass: string;
    hex: string;
  }
> = {
  cyan: {
    name: 'Cyan',
    bgClass: 'bg-cyan-500',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/50',
    ringClass: 'ring-cyan-500',
    hex: '#06b6d4',
  },
  emerald: {
    name: 'Emerald',
    bgClass: 'bg-emerald-500',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/50',
    ringClass: 'ring-emerald-500',
    hex: '#10b981',
  },
  violet: {
    name: 'Violet',
    bgClass: 'bg-violet-500',
    textClass: 'text-violet-400',
    borderClass: 'border-violet-500/50',
    ringClass: 'ring-violet-500',
    hex: '#8b5cf6',
  },
  rose: {
    name: 'Rose',
    bgClass: 'bg-rose-500',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/50',
    ringClass: 'ring-rose-500',
    hex: '#f43f5e',
  },
  amber: {
    name: 'Amber',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/50',
    ringClass: 'ring-amber-500',
    hex: '#f59e0b',
  },
  blue: {
    name: 'Blue',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/50',
    ringClass: 'ring-blue-500',
    hex: '#3b82f6',
  },
};
