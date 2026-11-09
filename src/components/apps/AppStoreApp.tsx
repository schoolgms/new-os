import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Terminal,
  Folder,
  FileText,
  Activity,
  Globe,
  Palette,
  Calculator,
  Music,
  Settings,
  LucideIcon,
  Check,
} from 'lucide-react';
import { AppId } from '../../types/os';
import { APPS_REGISTRY } from '../../services/appsRegistry';
import { soundEngine } from '../../services/audio';

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

interface AppStoreAppProps {
  onOpenApp: (appId: AppId) => void;
}

export const AppStoreApp: React.FC<AppStoreAppProps> = ({ onOpenApp }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'System', 'Productivity', 'Utilities', 'Media', 'AI'];

  const filteredApps = APPS_REGISTRY.filter((app) => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-950/80 text-slate-100 select-none overflow-hidden font-sans">
      {/* Header & Filter */}
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-xs font-bold text-white">NEW OS App Catalog</h3>
            <p className="text-[11px] text-slate-400">Browser-native desktop software suite</p>
          </div>
        </div>

        {/* Category Pills & Search */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search software..."
            className="px-2.5 py-1 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-36"
          />

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] transition-colors ${
                  selectedCategory === cat ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredApps.map((app) => {
            const Icon = ICONS_MAP[app.iconName] || Terminal;
            return (
              <div
                key={app.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/10 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      {app.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white">{app.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {app.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-3">
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Native Core</span>
                  </span>

                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenApp(app.id);
                    }}
                    className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-colors"
                  >
                    Launch
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
