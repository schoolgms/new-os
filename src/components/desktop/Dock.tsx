import React, { useState } from 'react';
import {
  Terminal,
  Folder,
  FileText,
  Sparkles,
  Activity,
  Globe,
  Palette,
  Calculator,
  Music,
  Settings,
  ShoppingBag,
  LucideIcon,
} from 'lucide-react';
import { AppId, WindowItem, DockPosition, AccentColor } from '../../types/os';
import { APPS_REGISTRY } from '../../services/appsRegistry';
import { soundEngine } from '../../services/audio';
import { ACCENT_COLORS } from '../../services/themes';

const ICONS_MAP: Record<string, LucideIcon> = {
  Terminal,
  Folder,
  FileText,
  Sparkles,
  Activity,
  Globe,
  Palette,
  Calculator,
  Music,
  Settings,
  ShoppingBag,
};

interface DockProps {
  windows: WindowItem[];
  activeWindowId: string | null;
  dockPosition: DockPosition;
  accentColor: AccentColor;
  onOpenApp: (appId: AppId) => void;
  onToggleWindow: (windowId: string) => void;
}

export const Dock: React.FC<DockProps> = ({
  windows,
  activeWindowId,
  dockPosition,
  accentColor,
  onOpenApp,
  onToggleWindow,
}) => {
  const [hoveredAppId, setHoveredAppId] = useState<AppId | null>(null);
  const accent = ACCENT_COLORS[accentColor] || ACCENT_COLORS.cyan;

  const isRunning = (appId: AppId) => windows.some((w) => w.appId === appId);
  const getWindow = (appId: AppId) => windows.find((w) => w.appId === appId);

  const handleClick = (appId: AppId) => {
    soundEngine.playClick();
    const win = getWindow(appId);
    if (win) {
      if (win.id === activeWindowId && !win.isMinimized) {
        onToggleWindow(win.id); // Minimize
      } else {
        onOpenApp(appId); // Focus or restore
      }
    } else {
      onOpenApp(appId);
    }
  };

  const positionClasses = {
    bottom: 'bottom-3 left-1/2 -translate-x-1/2 flex-row px-3 py-2',
    left: 'left-3 top-1/2 -translate-y-1/2 flex-col px-2 py-3',
    right: 'right-3 top-1/2 -translate-y-1/2 flex-col px-2 py-3',
  }[dockPosition];

  return (
    <div
      className={`fixed ${positionClasses} z-40 bg-slate-950/65 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center gap-2 select-none transition-all duration-300`}
    >
      {APPS_REGISTRY.map((app) => {
        const IconComponent = ICONS_MAP[app.iconName] || Terminal;
        const running = isRunning(app.id);
        const win = getWindow(app.id);
        const isCurrentActive = win && win.id === activeWindowId && !win.isMinimized;
        const isHovered = hoveredAppId === app.id;

        return (
          <div
            key={app.id}
            className="relative flex flex-col items-center group"
            onMouseEnter={() => setHoveredAppId(app.id)}
            onMouseLeave={() => setHoveredAppId(null)}
          >
            {/* Tooltip */}
            {isHovered && (
              <div
                className={`absolute ${
                  dockPosition === 'bottom'
                    ? '-top-9'
                    : dockPosition === 'left'
                    ? 'left-14 top-1/2 -translate-y-1/2'
                    : 'right-14 top-1/2 -translate-y-1/2'
                } bg-slate-900/95 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-md text-[11px] font-medium text-white whitespace-nowrap shadow-xl pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-100`}
              >
                {app.name}
              </div>
            )}

            {/* App Dock Button */}
            <button
              onClick={() => handleClick(app.id)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none ${
                isCurrentActive
                  ? 'bg-white/15 shadow-inner ring-1 ring-white/30 scale-105'
                  : 'bg-white/5 hover:bg-white/15 hover:scale-110 active:scale-95'
              } border border-white/5`}
              aria-label={app.name}
            >
              <IconComponent
                className={`w-5 h-5 transition-transform ${
                  app.id === 'nova-ai'
                    ? 'text-cyan-400'
                    : app.id === 'terminal'
                    ? 'text-emerald-400'
                    : app.id === 'editor'
                    ? 'text-indigo-400'
                    : app.id === 'monitor'
                    ? 'text-amber-400'
                    : app.id === 'synth'
                    ? 'text-rose-400'
                    : 'text-slate-200'
                }`}
              />
            </button>

            {/* Running Indicator Dot */}
            <div className="h-1 flex items-center justify-center mt-1">
              {running && (
                <div
                  className={`w-1.5 h-1.5 rounded-full ${accent.bgClass} shadow-sm shadow-current`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
