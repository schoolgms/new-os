import React, { useRef, useState, useEffect } from 'react';
import { WindowItem, AccentColor } from '../../types/os';
import { Minus, Square, X, Copy } from 'lucide-react';
import { soundEngine } from '../../services/audio';
import { ACCENT_COLORS } from '../../services/themes';

interface WindowFrameProps {
  windowItem: WindowItem;
  isActive: boolean;
  accentColor: AccentColor;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  onUpdateSize: (w: number, h: number) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  windowItem,
  isActive,
  accentColor,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onUpdatePosition,
  onUpdateSize,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });
  const resizeRef = useRef<{ startX: number; startY: number; initW: number; initH: number }>({
    startX: 0,
    startY: 0,
    initW: 0,
    initH: 0,
  });

  const accent = ACCENT_COLORS[accentColor] || ACCENT_COLORS.cyan;

  // Dragging logic
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (windowItem.isMaximized) return;
    onFocus();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: windowItem.position.x,
      initY: windowItem.position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        const newX = Math.max(-windowItem.size.width + 100, Math.min(window.innerWidth - 100, dragRef.current.initX + dx));
        const newY = Math.max(32, Math.min(window.innerHeight - 80, dragRef.current.initY + dy));
        onUpdatePosition(newX, newY);
      }
      if (isResizing) {
        const dw = e.clientX - resizeRef.current.startX;
        const dh = e.clientY - resizeRef.current.startY;
        const newW = Math.max(340, Math.min(window.innerWidth - windowItem.position.x, resizeRef.current.initW + dw));
        const newH = Math.max(260, Math.min(window.innerHeight - windowItem.position.y - 70, resizeRef.current.initH + dh));
        onUpdateSize(newW, newH);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, onUpdatePosition, onUpdateSize, windowItem.size.width, windowItem.position.x, windowItem.position.y]);

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initW: windowItem.size.width,
      initH: windowItem.size.height,
    };
  };

  if (windowItem.isMinimized) {
    return null;
  }

  return (
    <div
      onClick={onFocus}
      style={{
        transform: `translate3d(${windowItem.position.x}px, ${windowItem.position.y}px, 0)`,
        width: `${windowItem.size.width}px`,
        height: `${windowItem.size.height}px`,
        zIndex: windowItem.zIndex,
      }}
      className={`fixed top-0 left-0 flex flex-col rounded-xl overflow-hidden shadow-2xl transition-shadow duration-200 ${
        isActive
          ? `ring-1 ${accent.ringClass} shadow-[0_20px_50px_rgba(0,0,0,0.7)]`
          : 'ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] opacity-95'
      } bg-slate-950/85 backdrop-blur-2xl border border-white/10`}
    >
      {/* Titlebar */}
      <div
        onMouseDown={handleMouseDownHeader}
        onDoubleClick={onToggleMaximize}
        className={`h-10 px-3.5 flex items-center justify-between select-none cursor-default border-b border-white/10 ${
          isActive ? 'bg-white/[0.04]' : 'bg-black/20'
        }`}
      >
        {/* Window controls (Traffic Lights) */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Close"
            className="w-3 h-3 rounded-full bg-rose-500/90 hover:bg-rose-600 transition-colors flex items-center justify-center group focus:outline-none"
          >
            <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            title="Minimize"
            className="w-3 h-3 rounded-full bg-amber-500/90 hover:bg-amber-600 transition-colors flex items-center justify-center group focus:outline-none"
          >
            <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize();
            }}
            title={windowItem.isMaximized ? 'Restore' : 'Maximize'}
            className="w-3 h-3 rounded-full bg-emerald-500/90 hover:bg-emerald-600 transition-colors flex items-center justify-center group focus:outline-none"
          >
            {windowItem.isMaximized ? (
              <Copy className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100" />
            ) : (
              <Square className="w-1.5 h-1.5 text-emerald-950 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        </div>

        {/* Window Title */}
        <div className="text-xs font-medium tracking-wide text-slate-200/90 truncate max-w-[55%]">
          {windowItem.title}
        </div>

        {/* Subtle right balance indicator */}
        <div className="w-14 flex justify-end">
          <span className="text-[10px] text-slate-500 tracking-wider uppercase font-mono">
            NEW OS
          </span>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 relative overflow-hidden bg-slate-950/40 text-slate-100 flex flex-col">
        {children}
      </div>

      {/* Corner Resize Handle */}
      {!windowItem.isMaximized && (
        <div
          onMouseDown={handleMouseDownResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 group z-50"
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-white/30 group-hover:border-white/70 transition-colors" />
        </div>
      )}
    </div>
  );
};
