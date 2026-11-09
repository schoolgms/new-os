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
  Settings as SettingsIcon,
  ShoppingBag,
  LucideIcon,
} from 'lucide-react';
import { AppId, SystemSettings, AccentColor } from '../../types/os';
import { APPS_REGISTRY } from '../../services/appsRegistry';
import { WALLPAPERS, ACCENT_COLORS } from '../../services/themes';
import { soundEngine } from '../../services/audio';
import { vfs } from '../../services/vfs';
import { useWindowManager } from '../../hooks/useWindowManager';
import { useSystemStats } from '../../hooks/useSystemStats';

// Desktop Shell Components
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { WindowFrame } from './WindowFrame';
import { Spotlight } from './Spotlight';
import { ControlCenter } from './ControlCenter';
import { ContextMenu } from './ContextMenu';
import { LockScreen } from './LockScreen';

// Native Applications
import { TerminalApp } from '../apps/TerminalApp';
import { FileManagerApp } from '../apps/FileManagerApp';
import { CodeEditorApp } from '../apps/CodeEditorApp';
import { NovaAIApp } from '../apps/NovaAIApp';
import { SystemMonitorApp } from '../apps/SystemMonitorApp';
import { BrowserApp } from '../apps/BrowserApp';
import { PaintApp } from '../apps/PaintApp';
import { CalculatorApp } from '../apps/CalculatorApp';
import { SynthApp } from '../apps/SynthApp';
import { SettingsApp } from '../apps/SettingsApp';
import { AppStoreApp } from '../apps/AppStoreApp';

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
  Settings: SettingsIcon,
  ShoppingBag,
};

export const Desktop: React.FC = () => {
  // OS Settings state
  const [settings, setSettings] = useState<SystemSettings>({
    wallpaper: 'cosmic-nebula',
    accentColor: 'cyan',
    dockPosition: 'bottom',
    blurIntensity: 'high',
    soundEnabled: true,
    soundVolume: 0.5,
    isLocked: false,
    darkTheme: true,
  });

  const [brightness, setBrightness] = useState<number>(100);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Window manager & telemetry hooks
  const {
    windows,
    activeWindowId,
    openApp,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowManager();

  const { isOnline, batteryLevel, isCharging } = useSystemStats();

  const currentWallpaperObj =
    WALLPAPERS.find((w) => w.id === settings.wallpaper) || WALLPAPERS[0];

  const handleUpdateSettings = (partial: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const handleResetVFS = () => {
    if (confirm('Are you sure you want to reset the Virtual File System to default seed state?')) {
      vfs.resetToDefaults();
      soundEngine.playNotification();
      alert('Virtual File System has been reset to defaults.');
    }
  };

  const handleRestartDesktop = () => {
    soundEngine.playBootChime();
    setSettings((prev) => ({ ...prev, isLocked: true }));
    setTimeout(() => {
      setSettings((prev) => ({ ...prev, isLocked: false }));
    }, 1200);
  };

  // Context menu on desktop wallpaper
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Active App Name for TopBar
  const activeWindow = windows.find((w) => w.id === activeWindowId);
  const activeAppName = activeWindow?.title;

  // Render content of window by AppId
  const renderAppContent = (win: any) => {
    switch (win.appId) {
      case 'terminal':
        return (
          <TerminalApp
            onSetAccentColor={(col) => handleUpdateSettings({ accentColor: col })}
            onRestartDesktop={handleRestartDesktop}
          />
        );
      case 'files':
        return (
          <FileManagerApp
            onOpenFileInEditor={(path) => openApp('editor', { filePath: path })}
            onOpenApp={openApp}
          />
        );
      case 'editor':
        return <CodeEditorApp initialFilePath={win.stateData?.filePath} />;
      case 'nova-ai':
        return <NovaAIApp />;
      case 'monitor':
        return <SystemMonitorApp />;
      case 'browser':
        return <BrowserApp />;
      case 'paint':
        return <PaintApp />;
      case 'calc':
        return <CalculatorApp />;
      case 'synth':
        return <SynthApp />;
      case 'settings':
        return (
          <SettingsApp
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetVFS={handleResetVFS}
          />
        );
      case 'appstore':
        return <AppStoreApp onOpenApp={openApp} />;
      default:
        return <div className="p-4 text-xs">Application not loaded</div>;
    }
  };

  return (
    <div
      style={{
        ...currentWallpaperObj.style,
        filter: brightness < 100 ? `brightness(${brightness}%)` : undefined,
      }}
      onContextMenu={handleContextMenu}
      className={`fixed inset-0 w-screen h-screen overflow-hidden select-none flex flex-col font-sans transition-all duration-300 ${currentWallpaperObj.backgroundClass}`}
    >
      {/* Top Bar Navigation */}
      <TopBar
        activeAppName={activeAppName}
        accentColor={settings.accentColor}
        isOnline={isOnline}
        batteryLevel={batteryLevel}
        isCharging={isCharging}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const next = !settings.soundEnabled;
          soundEngine.enabled = next;
          handleUpdateSettings({ soundEnabled: next });
        }}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        onToggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)}
        onLockScreen={() => handleUpdateSettings({ isLocked: true })}
        onRestartDesktop={handleRestartDesktop}
        onResetVFS={handleResetVFS}
        onOpenApp={openApp}
      />

      {/* Main Desktop Surface with Grid Icons */}
      <main
        onClick={() => {
          if (contextMenu) setContextMenu(null);
        }}
        className="flex-1 relative overflow-hidden p-4"
      >
        {/* Desktop Icons Grid */}
        <div className="grid grid-flow-col grid-rows-6 auto-cols-max gap-4 z-0 w-fit">
          {APPS_REGISTRY.map((app) => {
            const Icon = ICONS_MAP[app.iconName] || Terminal;
            return (
              <div
                key={app.id}
                onDoubleClick={() => {
                  soundEngine.playClick();
                  openApp(app.id);
                }}
                className="w-20 flex flex-col items-center p-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all cursor-pointer group select-none text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-cyan-400/50 transition-all">
                  <Icon
                    className={`w-6 h-6 transition-transform ${
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
                        : 'text-slate-100'
                    }`}
                  />
                </div>
                <span className="text-[11px] font-medium text-white drop-shadow mt-1.5 truncate max-w-full">
                  {app.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Windows Composite Viewport */}
        {windows.map((win) => (
          <WindowFrame
            key={win.id}
            windowItem={win}
            isActive={win.id === activeWindowId}
            accentColor={settings.accentColor}
            onFocus={() => focusWindow(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onToggleMaximize={() => toggleMaximize(win.id)}
            onUpdatePosition={(x, y) => updateWindowPosition(win.id, x, y)}
            onUpdateSize={(w, h) => updateWindowSize(win.id, w, h)}
          >
            {renderAppContent(win)}
          </WindowFrame>
        ))}
      </main>

      {/* Floating Glassmorphic Dock */}
      <Dock
        windows={windows}
        activeWindowId={activeWindowId}
        dockPosition={settings.dockPosition}
        accentColor={settings.accentColor}
        onOpenApp={openApp}
        onToggleWindow={(id) => minimizeWindow(id)}
      />

      {/* Spotlight Command Palette (Alt + Space) */}
      <Spotlight
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onOpenApp={openApp}
      />

      {/* Control Center Popover */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        accentColor={settings.accentColor}
        onSetAccentColor={(accent) => handleUpdateSettings({ accentColor: accent })}
        currentWallpaper={settings.wallpaper}
        onSetWallpaper={(wall) => handleUpdateSettings({ wallpaper: wall })}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const next = !settings.soundEnabled;
          soundEngine.enabled = next;
          handleUpdateSettings({ soundEnabled: next });
        }}
        soundVolume={settings.soundVolume}
        onSetVolume={(vol) => handleUpdateSettings({ soundVolume: vol })}
        isOnline={isOnline}
        brightness={brightness}
        onSetBrightness={setBrightness}
      />

      {/* Desktop Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onNewFolder={() => {
            try {
              vfs.createDirectory('/home/user', `Folder_${Date.now().toString().slice(-4)}`);
              openApp('files');
            } catch (e: any) {
              alert(e.message);
            }
          }}
          onNewFile={() => {
            try {
              const file = vfs.createFile('/home/user', `document_${Date.now().toString().slice(-4)}.txt`, 'Hello from NEW OS!\n');
              openApp('editor', { filePath: file.path });
            } catch (e: any) {
              alert(e.message);
            }
          }}
          onOpenApp={openApp}
          onResetVFS={handleResetVFS}
        />
      )}

      {/* Lock / Boot Screen */}
      {settings.isLocked && (
        <LockScreen
          onUnlock={() => handleUpdateSettings({ isLocked: false })}
          wallpaperStyle={currentWallpaperObj.style}
        />
      )}
    </div>
  );
};
