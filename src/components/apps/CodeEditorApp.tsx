import React, { useState, useEffect } from 'react';
import { Save, Download, Eye, FileCode, Check, RefreshCw } from 'lucide-react';
import { vfs } from '../../services/vfs';
import { soundEngine } from '../../services/audio';

interface CodeEditorAppProps {
  initialFilePath?: string;
}

export const CodeEditorApp: React.FC<CodeEditorAppProps> = ({ initialFilePath }) => {
  const [filePath, setFilePath] = useState<string>(
    initialFilePath || '/home/user/Welcome.txt'
  );
  const [content, setContent] = useState<string>('');
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    if (initialFilePath) {
      setFilePath(initialFilePath);
    }
  }, [initialFilePath]);

  useEffect(() => {
    const node = vfs.getNode(filePath);
    if (node && !node.isDirectory) {
      setContent(node.content || '');
    } else {
      setContent('// New File in NEW OS\n');
    }
  }, [filePath]);

  const handleSave = () => {
    soundEngine.playClick();
    try {
      const node = vfs.getNode(filePath);
      if (node && !node.isDirectory) {
        vfs.updateFile(filePath, content);
      } else {
        const lastSlash = filePath.lastIndexOf('/');
        const dir = filePath.substring(0, lastSlash) || '/home/user';
        const name = filePath.substring(lastSlash + 1) || 'untitled.txt';
        vfs.createFile(dir, name, content);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e: any) {
      alert(`Save error: ${e.message}`);
    }
  };

  const handleDownload = () => {
    soundEngine.playClick();
    const fileName = filePath.split('/').pop() || 'document.txt';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  const lines = content.split('\n');
  const wordsCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isMarkdown = filePath.endsWith('.md');

  return (
    <div
      onKeyDown={handleKeyDown}
      className="flex-1 flex flex-col bg-slate-950/80 text-slate-100 select-none overflow-hidden font-sans"
    >
      {/* Top Toolbar */}
      <div className="h-11 border-b border-white/10 px-4 flex items-center justify-between gap-4 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400 w-64 truncate"
            title="File path in VFS"
          />
        </div>

        <div className="flex items-center gap-2">
          {isMarkdown && (
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                isPreview ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreview ? 'Code View' : 'Live Preview'}</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            {saveStatus === 'saved' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors"
            title="Download file to computer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor & Preview Split/View */}
      <div className="flex-1 flex overflow-hidden">
        {isPreview ? (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/60 text-slate-200 prose prose-invert max-w-none text-xs leading-relaxed">
            <div className="font-mono text-cyan-400 text-[10px] uppercase mb-4 tracking-wider">
              --- Markdown Rendered Output ---
            </div>
            <div className="whitespace-pre-wrap">{content}</div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden bg-slate-950/60 font-mono text-xs">
            {/* Line Numbers Gutter */}
            <div className="w-12 py-3 bg-black/30 border-r border-white/5 select-none text-right pr-3 text-slate-600 font-mono">
              {lines.map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code / Text Input Area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-3 bg-transparent text-slate-100 resize-none focus:outline-none font-mono text-xs leading-6 selection:bg-cyan-500/30 overflow-auto"
              spellCheck={false}
              placeholder="Start writing text or code..."
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 border-t border-white/10 px-4 flex items-center justify-between text-[10px] text-slate-400 bg-black/40 font-mono">
        <div className="flex items-center gap-4">
          <span>Lines: {lines.length}</span>
          <span>Words: {wordsCount}</span>
          <span>Characters: {content.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span className="text-cyan-400">{isMarkdown ? 'Markdown' : 'Plain Text'}</span>
          <span>NEW OS CodeStudio</span>
        </div>
      </div>
    </div>
  );
};
