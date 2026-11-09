import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Globe, Search, ExternalLink, Bookmark } from 'lucide-react';
import { soundEngine } from '../../services/audio';

const BOOKMARKS = [
  { name: 'Wikipedia', url: 'https://en.wikipedia.org' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com' },
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
  { name: 'GitHub', url: 'https://github.com' },
];

export const BrowserApp: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://en.wikipedia.org/wiki/Operating_system');
  const [currentUrl, setCurrentUrl] = useState('https://en.wikipedia.org/wiki/Operating_system');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (targetUrl?: string) => {
    soundEngine.playClick();
    let url = (targetUrl || urlInput).trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        // Search query
        url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
      }
    }
    setUrlInput(url);
    setCurrentUrl(url);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/80 text-slate-100 select-none overflow-hidden font-sans">
      {/* Browser Navigation Bar */}
      <div className="h-11 border-b border-white/10 px-3 flex items-center gap-2 bg-white/[0.02]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleNavigate(currentUrl)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Reload"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        {/* URL Input Bar */}
        <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 focus-within:border-cyan-400 transition-colors">
          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNavigate();
            }}
            placeholder="Search the web or enter URL..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => handleNavigate()}
            className="text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        <a
          href={currentUrl}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Open in new browser tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Bookmarks Strip */}
      <div className="h-7 border-b border-white/5 px-3 flex items-center gap-3 bg-black/20 text-[11px] text-slate-400 overflow-x-auto">
        <Bookmark className="w-3 h-3 text-cyan-400 shrink-0" />
        {BOOKMARKS.map((bm) => (
          <button
            key={bm.name}
            onClick={() => handleNavigate(bm.url)}
            className="hover:text-slate-200 transition-colors whitespace-nowrap"
          >
            {bm.name}
          </button>
        ))}
      </div>

      {/* Sandbox IFrame Viewport */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Connecting to sandbox iframe...</span>
            </div>
          </div>
        )}
        <iframe
          src={currentUrl}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          className="w-full h-full border-0"
          title="NetSurfer Sandbox"
        />
      </div>

      {/* Browser Footer */}
      <div className="h-6 border-t border-white/10 px-3 flex items-center justify-between text-[10px] text-slate-400 bg-slate-950/90 font-mono">
        <span className="truncate max-w-sm">{currentUrl}</span>
        <span>NetSurfer Secure Sandbox</span>
      </div>
    </div>
  );
};
