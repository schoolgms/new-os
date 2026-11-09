import React, { useRef, useState, useEffect } from 'react';
import { Download, RotateCcw, Palette, Circle, Check } from 'lucide-react';
import { soundEngine } from '../../services/audio';
import { vfs } from '../../services/vfs';

const COLORS = [
  '#ffffff',
  '#06b6d4',
  '#10b981',
  '#8b5cf6',
  '#f43f5e',
  '#f59e0b',
  '#3b82f6',
  '#000000',
];

const BRUSH_SIZES = [2, 5, 10, 20];

export const PaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentColor, setCurrentColor] = useState('#06b6d4');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Initial dark slate canvas background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.closePath();
  };

  const handleClear = () => {
    soundEngine.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const handleDownload = () => {
    soundEngine.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `new_os_art_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleSaveToVFS = () => {
    soundEngine.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    try {
      vfs.createFile('/home/user/Documents', `painting_${Date.now()}.txt`, dataUrl);
      setSaveStatus('Saved to /home/user/Documents');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/80 text-slate-100 select-none overflow-hidden font-sans">
      {/* Paint Toolbar */}
      <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between gap-4 bg-white/[0.02]">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((col) => {
            const isSelected = currentColor === col;
            return (
              <button
                key={col}
                onClick={() => {
                  setCurrentColor(col);
                  soundEngine.playClick();
                }}
                style={{ backgroundColor: col }}
                className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-transform ${
                  isSelected ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                }`}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 ${col === '#ffffff' ? 'text-black' : 'text-white'}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Brush Sizes */}
        <div className="flex items-center gap-2">
          {BRUSH_SIZES.map((sz) => (
            <button
              key={sz}
              onClick={() => setBrushSize(sz)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                brushSize === sz ? 'bg-white/20 text-white' : 'text-slate-400 hover:bg-white/5'
              }`}
              title={`Brush ${sz}px`}
            >
              <div
                className="rounded-full bg-current"
                style={{ width: `${Math.min(16, sz * 1.5)}px`, height: `${Math.min(16, sz * 1.5)}px` }}
              />
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors flex items-center gap-1"
            title="Clear Canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
            title="Download PNG to PC"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="px-4 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] text-center border-b border-emerald-500/30">
          {saveStatus}
        </div>
      )}

      {/* Drawing Viewport */}
      <div className="flex-1 relative cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full block"
        />
      </div>

      {/* Paint Footer */}
      <div className="h-6 border-t border-white/10 px-4 flex items-center justify-between text-[10px] text-slate-400 bg-black/40 font-mono">
        <span>Studio Paint Canvas</span>
        <span>
          Color: <span style={{ color: currentColor }}>{currentColor}</span> · Brush: {brushSize}px
        </span>
      </div>
    </div>
  );
};
