import React, { useState } from 'react';
import {
  Palette,
  Image as ImageIcon,
  Volume2,
  HardDrive,
  Layout,
  RotateCcw,
  Download,
  Check,
} from 'lucide-react';
import { AccentColor, DockPosition, SystemSettings } from '../../types/os';
import { WALLPAPERS, ACCENT_COLORS } from '../../services/themes';
import { soundEngine } from '../../services/audio';
import { vfs } from '../../services/vfs';

interface SettingsAppProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onResetVFS: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  settings,
  onUpdateSettings,
  onResetVFS,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'dock' | 'sound' | 'storage'>('appearance');

  const handleExportBackup = () => {
    soundEngine.playClick();
    const allNodes = vfs.getAllNodes();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allNodes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `new_os_vfs_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const vfsNodes = vfs.getAllNodes();
  const totalBytes = vfsNodes.reduce((acc, n) => acc + (n.size || 0), 0);

  return (
    <div className="flex-1 flex bg-slate-950/80 text-slate-100 select-none overflow-hidden font-sans">
      {/* Settings Navigation Sidebar */}
      <div className="w-48 border-r border-white/10 p-3 space-y-1 bg-white/[0.01] shrink-0 text-xs">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
          Preferences
        </div>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
            activeTab === 'appearance' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>Appearance</span>
        </button>
        <button
          onClick={() => setActiveTab('dock')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
            activeTab === 'dock' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Layout className="w-4 h-4 text-indigo-400" />
          <span>Desktop & Dock</span>
        </button>
        <button
          onClick={() => setActiveTab('sound')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
            activeTab === 'sound' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span>Sound Effects</span>
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
            activeTab === 'storage' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <HardDrive className="w-4 h-4 text-rose-400" />
          <span>Virtual Storage</span>
        </button>
      </div>

      {/* Main Settings Panel */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            {/* Wallpapers section */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>Desktop Wallpaper</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WALLPAPERS.map((wall) => {
                  const isSelected = settings.wallpaper === wall.id;
                  return (
                    <button
                      key={wall.id}
                      onClick={() => {
                        soundEngine.playClick();
                        onUpdateSettings({ wallpaper: wall.id });
                      }}
                      className={`group relative h-24 rounded-2xl ${wall.thumbnailClass} border p-3 flex flex-col justify-end text-left transition-all ${
                        isSelected
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-[1.02]'
                          : 'border-white/10 opacity-80 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      <span className="text-xs font-semibold text-white drop-shadow">
                        {wall.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-slate-950 font-bold" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Theme section */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Palette className="w-4 h-4 text-violet-400" />
                <span>Accent Color</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {(Object.keys(ACCENT_COLORS) as AccentColor[]).map((key) => {
                  const info = ACCENT_COLORS[key];
                  const isSelected = settings.accentColor === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        soundEngine.playClick();
                        onUpdateSettings({ accentColor: key });
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border transition-all ${
                        isSelected
                          ? 'border-white/40 ring-2 ring-white/20'
                          : 'border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${info.bgClass}`} />
                      <span className="text-xs font-medium text-slate-200">{info.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dock' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Layout className="w-4 h-4 text-indigo-400" />
              <span>Dock Position</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['bottom', 'left', 'right'] as DockPosition[]).map((pos) => {
                const isSelected = settings.dockPosition === pos;
                return (
                  <button
                    key={pos}
                    onClick={() => {
                      soundEngine.playClick();
                      onUpdateSettings({ dockPosition: pos });
                    }}
                    className={`p-4 rounded-2xl border text-center capitalize transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white font-medium'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-sm font-semibold">{pos}</div>
                    <div className="text-[11px] text-slate-400 mt-1">Screen {pos}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'sound' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Web Audio API Sound Engine</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-200">System Sound Effects</div>
                  <div className="text-[11px] text-slate-400">
                    Enable synthesized window and interaction sounds
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    onUpdateSettings({ soundEnabled: checked });
                    soundEngine.enabled = checked;
                    if (checked) soundEngine.playClick();
                  }}
                  className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Synthesizer Volume</span>
                  <span className="font-mono">{Math.round(settings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(settings.soundVolume * 100)}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) / 100;
                    onUpdateSettings({ soundVolume: v });
                    soundEngine.volume = v;
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => soundEngine.playBootChime()}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                >
                  Test Boot Chime
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-rose-400" />
              <span>Virtual Filesystem Backup & Storage</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-xs py-1 border-b border-white/5">
                <span className="text-slate-400">Total VFS Nodes</span>
                <span className="font-mono text-cyan-300">{vfsNodes.length} items</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-white/5">
                <span className="text-slate-400">Total Disk Size Used</span>
                <span className="font-mono text-cyan-300">{totalBytes} Bytes</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-400">Storage Backend</span>
                <span className="font-mono text-emerald-400">Browser LocalStorage</span>
              </div>

              <div className="pt-4 flex flex-wrap gap-2 border-t border-white/10">
                <button
                  onClick={handleExportBackup}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export VFS JSON Backup</span>
                </button>
                <button
                  onClick={onResetVFS}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Factory Reset Virtual Disk</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
