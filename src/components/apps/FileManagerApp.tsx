import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  Upload,
  Download,
  Trash2,
  FolderPlus,
  FilePlus,
  ChevronRight,
  LayoutGrid,
  List,
  Edit,
  Code,
  ArrowUp,
} from 'lucide-react';
import { FileSystemNode, AppId } from '../../types/os';
import { vfs } from '../../services/vfs';
import { soundEngine } from '../../services/audio';

interface FileManagerAppProps {
  onOpenFileInEditor?: (path: string) => void;
  onOpenApp?: (appId: AppId, initialData?: Record<string, any>) => void;
}

export const FileManagerApp: React.FC<FileManagerAppProps> = ({
  onOpenFileInEditor,
  onOpenApp,
}) => {
  const [currentPath, setCurrentPath] = useState<string>('/home/user');
  const [items, setItems] = useState<FileSystemNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileSystemNode | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  const refreshItems = () => {
    const list = vfs.listDirectory(currentPath);
    setItems(list);
    setSelectedItem(null);
  };

  useEffect(() => {
    refreshItems();
  }, [currentPath]);

  const handleNavigate = (path: string) => {
    soundEngine.playClick();
    setCurrentPath(vfs.normalizePath(path));
  };

  const handleGoUp = () => {
    if (currentPath === '/' || currentPath === '') return;
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
    handleNavigate(parentPath);
  };

  const handleDoubleClick = (item: FileSystemNode) => {
    if (item.isDirectory) {
      handleNavigate(item.path);
    } else {
      soundEngine.playClick();
      if (onOpenFileInEditor) {
        onOpenFileInEditor(item.path);
      } else if (onOpenApp) {
        onOpenApp('editor', { filePath: item.path });
      }
    }
  };

  const handleCreateFolder = () => {
    if (!newItemName.trim()) return;
    try {
      vfs.createDirectory(currentPath, newItemName.trim());
      soundEngine.playClick();
      setIsCreatingFolder(false);
      setNewItemName('');
      refreshItems();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleCreateFile = () => {
    if (!newItemName.trim()) return;
    try {
      vfs.createFile(currentPath, newItemName.trim(), '// New document created in NEW OS\n');
      soundEngine.playClick();
      setIsCreatingFile(false);
      setNewItemName('');
      refreshItems();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    if (confirm(`Are you sure you want to delete '${selectedItem.name}'?`)) {
      vfs.deleteNode(selectedItem.path);
      soundEngine.playClick();
      refreshItems();
    }
  };

  const handleDownloadFile = () => {
    if (!selectedItem || selectedItem.isDirectory) return;
    const blob = new Blob([selectedItem.content || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedItem.name;
    link.click();
    URL.revokeObjectURL(url);
    soundEngine.playClick();
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        vfs.createFile(currentPath, file.name, content);
        soundEngine.playClick();
        refreshItems();
      } catch (err: any) {
        alert(err.message);
      }
    };
    reader.readAsText(file);
  };

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  return (
    <div className="flex-1 flex flex-col bg-slate-950/70 text-slate-100 select-none overflow-hidden">
      {/* Top Action Toolbar */}
      <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between gap-4 bg-white/[0.02]">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs truncate">
          <button
            onClick={handleGoUp}
            disabled={currentPath === '/'}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-300"
            title="Go up one folder"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 font-mono text-[11px] text-slate-300 truncate">
            <button
              onClick={() => handleNavigate('/')}
              className="hover:text-cyan-400 transition-colors"
            >
              root
            </button>
            {breadcrumbs.map((crumb, idx) => {
              const crumbPath = '/' + breadcrumbs.slice(0, idx + 1).join('/');
              return (
                <React.Fragment key={crumbPath}>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                  <button
                    onClick={() => handleNavigate(crumbPath)}
                    className="hover:text-cyan-400 transition-colors truncate max-w-[120px]"
                  >
                    {crumb}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setIsCreatingFolder(true);
              setIsCreatingFile(false);
              setNewItemName('');
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs flex items-center gap-1.5 transition-colors"
            title="New Folder"
          >
            <FolderPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">New Folder</span>
          </button>

          <button
            onClick={() => {
              setIsCreatingFile(true);
              setIsCreatingFolder(false);
              setNewItemName('');
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs flex items-center gap-1.5 transition-colors"
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">New File</span>
          </button>

          <label className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Upload</span>
            <input type="file" onChange={handleUploadFile} className="hidden" />
          </label>

          {selectedItem && !selectedItem.isDirectory && (
            <>
              <button
                onClick={handleDownloadFile}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors"
                title="Download to PC"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => handleDoubleClick(selectedItem)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors"
                title="Open in Code Studio"
              >
                <Code className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </>
          )}

          {selectedItem && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="border-l border-white/10 h-5 my-auto" />

          {/* View mode toggle */}
          <div className="flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Creation Modal / Inline Bar */}
      {(isCreatingFolder || isCreatingFile) && (
        <div className="px-4 py-2 bg-slate-900 border-b border-white/10 flex items-center gap-3 animate-in fade-in duration-100">
          <span className="text-xs text-slate-300 font-medium">
            {isCreatingFolder ? 'Folder Name:' : 'File Name:'}
          </span>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                isCreatingFolder ? handleCreateFolder() : handleCreateFile();
              } else if (e.key === 'Escape') {
                setIsCreatingFolder(false);
                setIsCreatingFile(false);
              }
            }}
            placeholder={isCreatingFolder ? 'New_Folder' : 'note.txt'}
            className="px-2.5 py-1 text-xs bg-slate-950 border border-white/20 rounded-md text-white focus:outline-none focus:border-cyan-400"
            autoFocus
          />
          <button
            onClick={isCreatingFolder ? handleCreateFolder : handleCreateFile}
            className="px-3 py-1 bg-cyan-500 text-slate-950 font-semibold rounded-md text-xs hover:bg-cyan-400 transition-colors"
          >
            Create
          </button>
          <button
            onClick={() => {
              setIsCreatingFolder(false);
              setIsCreatingFile(false);
            }}
            className="px-3 py-1 text-slate-400 hover:text-white text-xs transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main Workspace: Sidebar & File Explorer Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Quick Places Sidebar */}
        <div className="w-44 border-r border-white/10 p-3 space-y-1 bg-white/[0.01] shrink-0 hidden sm:block text-xs">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
            Locations
          </div>
          <button
            onClick={() => handleNavigate('/home/user')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
              currentPath === '/home/user' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Folder className="w-4 h-4 text-cyan-400" />
            <span>Home</span>
          </button>
          <button
            onClick={() => handleNavigate('/home/user/Documents')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
              currentPath === '/home/user/Documents' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Folder className="w-4 h-4 text-indigo-400" />
            <span>Documents</span>
          </button>
          <button
            onClick={() => handleNavigate('/home/user/Projects')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
              currentPath === '/home/user/Projects' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Folder className="w-4 h-4 text-emerald-400" />
            <span>Projects</span>
          </button>
          <button
            onClick={() => handleNavigate('/home/user/Notes')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
              currentPath === '/home/user/Notes' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Folder className="w-4 h-4 text-amber-400" />
            <span>Notes</span>
          </button>
          <button
            onClick={() => handleNavigate('/system')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
              currentPath === '/system' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Folder className="w-4 h-4 text-purple-400" />
            <span>System</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-4 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <Folder className="w-12 h-12 text-slate-700 mb-2 stroke-1" />
              <span>This folder is empty.</span>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {items.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedItem(item);
                    }}
                    onDoubleClick={() => handleDoubleClick(item)}
                    className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border border-cyan-500/40 shadow-lg'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {item.isDirectory ? (
                      <Folder className="w-12 h-12 text-cyan-400 drop-shadow mb-2" />
                    ) : (
                      <FileText className="w-12 h-12 text-indigo-400 drop-shadow mb-2" />
                    )}
                    <span className="text-xs text-center font-medium text-slate-200 truncate w-full">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {item.isDirectory ? 'dir' : `${item.size} B`}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-12 px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-white/10 uppercase tracking-wider">
                <span className="col-span-6">Name</span>
                <span className="col-span-3">Modified</span>
                <span className="col-span-3 text-right">Size</span>
              </div>
              {items.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedItem(item);
                    }}
                    onDoubleClick={() => handleDoubleClick(item)}
                    className={`grid grid-cols-12 items-center px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors ${
                      isSelected ? 'bg-cyan-500/20 text-white' : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="col-span-6 flex items-center gap-2 truncate">
                      {item.isDirectory ? (
                        <Folder className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      )}
                      <span className="truncate font-medium">{item.name}</span>
                    </div>
                    <div className="col-span-3 text-slate-400 font-mono text-[11px]">
                      {new Date(item.modifiedAt).toLocaleDateString()}
                    </div>
                    <div className="col-span-3 text-right text-slate-400 font-mono text-[11px]">
                      {item.isDirectory ? '--' : `${item.size} B`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="h-7 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-slate-400 bg-black/30 font-mono">
        <div>
          <span>{items.length} items</span>
          {selectedItem && <span> · Selected: {selectedItem.name}</span>}
        </div>
        <div>NEW OS Virtual File System</div>
      </div>
    </div>
  );
};
