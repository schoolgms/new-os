import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, Folder, FileText, ArrowRight, CornerDownLeft, Sparkles, X } from 'lucide-react';
import { AppId } from '../../types/os';
import { APPS_REGISTRY } from '../../services/appsRegistry';
import { vfs } from '../../services/vfs';
import { soundEngine } from '../../services/audio';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: AppId, initialData?: Record<string, any>) => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose, onOpenApp }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keyboard shortcut: Alt + Space or Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.code === 'Space') || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          soundEngine.playClick();
          // Open triggered from parent state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter apps
  const matchedApps = APPS_REGISTRY.filter(
    (app) =>
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.description.toLowerCase().includes(query.toLowerCase())
  );

  // Filter files
  const allNodes = vfs.getAllNodes();
  const matchedFiles = query.trim()
    ? allNodes.filter(
        (node) =>
          !node.isDirectory &&
          node.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  const totalItems = matchedApps.length + matchedFiles.length;

  const handleSelect = (index: number) => {
    soundEngine.playClick();
    if (index < matchedApps.length) {
      onOpenApp(matchedApps[index].id);
    } else {
      const file = matchedFiles[index - matchedApps.length];
      if (file) {
        onOpenApp('editor', { filePath: file.path });
      }
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % Math.max(1, totalItems));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-start justify-center pt-24 z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search applications, files, or system tools..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results listing */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {matchedApps.length > 0 && (
            <div className="px-2 pt-1 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Applications
            </div>
          )}

          {matchedApps.map((app, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <div
                key={app.id}
                onClick={() => handleSelect(idx)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                  isSelected ? 'bg-cyan-500/20 text-white border border-cyan-500/40' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="truncate">
                    <div className="font-medium text-slate-100">{app.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{app.description}</div>
                  </div>
                </div>
                {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />}
              </div>
            );
          })}

          {matchedFiles.length > 0 && (
            <>
              <div className="px-2 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Virtual Files
              </div>
              {matchedFiles.map((file, idx) => {
                const globalIdx = matchedApps.length + idx;
                const isSelected = selectedIndex === globalIdx;
                return (
                  <div
                    key={file.id}
                    onClick={() => handleSelect(globalIdx)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                      isSelected ? 'bg-cyan-500/20 text-white border border-cyan-500/40' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="truncate">
                        <div className="font-medium text-slate-100">{file.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{file.path}</div>
                      </div>
                    </div>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />}
                  </div>
                );
              })}
            </>
          )}

          {totalItems === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching applications or files found for &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>esc Dismiss</span>
          </div>
          <span className="font-mono text-cyan-400">Spotlight</span>
        </div>
      </div>
    </div>
  );
};
