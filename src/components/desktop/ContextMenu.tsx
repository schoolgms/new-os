import React from 'react';
import { FolderPlus, FilePlus, Terminal, Activity, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../services/audio';
import { AppId } from '../../types/os';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onOpenApp: (appId: AppId) => void;
  onResetVFS: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onNewFile,
  onNewFolder,
  onOpenApp,
  onResetVFS,
}) => {
  // Constrain coordinates within viewport
  const safeX = Math.min(x, window.innerWidth - 210);
  const safeY = Math.min(y, window.innerHeight - 230);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-transparent"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ left: safeX, top: safeY }}
        className="fixed w-52 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl py-1.5 z-50 text-slate-200 text-xs animate-in fade-in zoom-in-95 duration-100 select-none"
      >
        <button
          onClick={() => {
            soundEngine.playClick();
            onNewFolder();
            onClose();
          }}
          className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
        >
          <FolderPlus className="w-4 h-4 text-cyan-400" />
          <span>New Folder</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onNewFile();
            onClose();
          }}
          className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
        >
          <FilePlus className="w-4 h-4 text-indigo-400" />
          <span>New Document</span>
        </button>

        <div className="my-1 border-t border-white/10" />

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenApp('terminal');
            onClose();
          }}
          className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Open Terminal</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenApp('monitor');
            onClose();
          }}
          className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
        >
          <Activity className="w-4 h-4 text-amber-400" />
          <span>System Activity</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenApp('settings');
            onClose();
          }}
          className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
        >
          <ImageIcon className="w-4 h-4 text-purple-400" />
          <span>Change Wallpaper</span>
        </button>

        <div className="my-1 border-t border-white/10" />

        <button
          onClick={() => {
            soundEngine.playClick();
            onResetVFS();
            onClose();
          }}
          className="w-full px-3 py-2 text-left hover:bg-white/10 text-rose-300 flex items-center gap-2.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>Factory Reset VFS</span>
        </button>
      </div>
    </div>
  );
};
