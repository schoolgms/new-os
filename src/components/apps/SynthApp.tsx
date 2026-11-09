import React, { useState, useEffect } from 'react';
import { Music, Volume2, Sparkles, Play } from 'lucide-react';
import { soundEngine } from '../../services/audio';

const NOTES = [
  { note: 'C', freq: 261.63, isBlack: false, key: 'A' },
  { note: 'C#', freq: 277.18, isBlack: true, key: 'W' },
  { note: 'D', freq: 293.66, isBlack: false, key: 'S' },
  { note: 'D#', freq: 311.13, isBlack: true, key: 'E' },
  { note: 'E', freq: 329.63, isBlack: false, key: 'D' },
  { note: 'F', freq: 349.23, isBlack: false, key: 'F' },
  { note: 'F#', freq: 369.99, isBlack: true, key: 'T' },
  { note: 'G', freq: 392.0, isBlack: false, key: 'G' },
  { note: 'G#', freq: 415.3, isBlack: true, key: 'Y' },
  { note: 'A', freq: 440.0, isBlack: false, key: 'H' },
  { note: 'A#', freq: 466.16, isBlack: true, key: 'U' },
  { note: 'B', freq: 493.88, isBlack: false, key: 'J' },
  { note: 'C2', freq: 523.25, isBlack: false, key: 'K' },
];

export const SynthApp: React.FC = () => {
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [octaveMultiplier, setOctaveMultiplier] = useState<number>(1);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const playTone = (freq: number, noteName: string) => {
    setActiveNote(noteName);
    soundEngine.playNote(freq * octaveMultiplier, 0.4, waveform);
    setTimeout(() => setActiveNote(null), 250);
  };

  const playArpeggio = () => {
    const chord = [261.63, 329.63, 392.0, 523.25, 659.25];
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        soundEngine.playNote(freq * octaveMultiplier, 0.35, waveform);
      }, idx * 120);
    });
  };

  // Computer keyboard bindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const match = NOTES.find((n) => n.key.toLowerCase() === e.key.toLowerCase());
      if (match) {
        playTone(match.freq, match.note);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [octaveMultiplier, waveform]);

  return (
    <div className="flex-1 flex flex-col bg-slate-950/85 text-slate-100 select-none overflow-hidden font-sans p-4">
      {/* Top Synth Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold text-white">Waveform Synthesizer</span>
        </div>

        {/* Waveform Selector */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          {(['sine', 'square', 'sawtooth', 'triangle'] as OscillatorType[]).map((w) => (
            <button
              key={w}
              onClick={() => {
                soundEngine.playClick();
                setWaveform(w);
              }}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                waveform === w ? 'bg-rose-500 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Octave & Demo Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-xs">
            <span className="text-slate-400 text-[10px]">Octave:</span>
            <button
              onClick={() => setOctaveMultiplier(0.5)}
              className={`px-1.5 py-0.5 rounded text-[11px] ${octaveMultiplier === 0.5 ? 'bg-white/20 text-white' : 'text-slate-400'}`}
            >
              -1
            </button>
            <button
              onClick={() => setOctaveMultiplier(1)}
              className={`px-1.5 py-0.5 rounded text-[11px] ${octaveMultiplier === 1 ? 'bg-white/20 text-white' : 'text-slate-400'}`}
            >
              0
            </button>
            <button
              onClick={() => setOctaveMultiplier(2)}
              className={`px-1.5 py-0.5 rounded text-[11px] ${octaveMultiplier === 2 ? 'bg-white/20 text-white' : 'text-slate-400'}`}
            >
              +1
            </button>
          </div>

          <button
            onClick={playArpeggio}
            className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Arpeggio</span>
          </button>
        </div>
      </div>

      {/* Visual Piano Keyboard */}
      <div className="flex-1 flex items-center justify-center my-4 overflow-x-auto">
        <div className="relative flex h-48 bg-slate-900 p-2 rounded-2xl border border-white/15 shadow-2xl">
          {NOTES.filter((n) => !n.isBlack).map((whiteKey) => {
            const isPlaying = activeNote === whiteKey.note;
            return (
              <div
                key={whiteKey.note}
                onClick={() => playTone(whiteKey.freq, whiteKey.note)}
                className={`w-12 h-44 rounded-b-xl border border-slate-300/20 cursor-pointer flex flex-col justify-end items-center pb-3 text-slate-800 transition-all select-none ${
                  isPlaying ? 'bg-rose-300 translate-y-1 shadow-inner' : 'bg-slate-100 hover:bg-white'
                }`}
              >
                <span className="text-xs font-bold">{whiteKey.note}</span>
                <span className="text-[10px] text-slate-400 font-mono">[{whiteKey.key}]</span>
              </div>
            );
          })}

          {/* Black Keys Overlay */}
          <div className="absolute top-2 left-2 flex pointer-events-none">
            <div className="w-8" />
            <div
              onClick={() => playTone(NOTES[1].freq, NOTES[1].note)}
              className={`pointer-events-auto w-8 h-28 -ml-4 bg-slate-950 text-white rounded-b-lg border border-white/20 cursor-pointer flex flex-col justify-end items-center pb-2 z-10 transition-all ${
                activeNote === 'C#' ? 'bg-rose-600' : 'hover:bg-slate-900'
              }`}
            >
              <span className="text-[10px] font-mono">[W]</span>
            </div>
            <div className="w-4" />
            <div
              onClick={() => playTone(NOTES[3].freq, NOTES[3].note)}
              className={`pointer-events-auto w-8 h-28 -ml-4 bg-slate-950 text-white rounded-b-lg border border-white/20 cursor-pointer flex flex-col justify-end items-center pb-2 z-10 transition-all ${
                activeNote === 'D#' ? 'bg-rose-600' : 'hover:bg-slate-900'
              }`}
            >
              <span className="text-[10px] font-mono">[E]</span>
            </div>
            <div className="w-16" />
            <div
              onClick={() => playTone(NOTES[6].freq, NOTES[6].note)}
              className={`pointer-events-auto w-8 h-28 -ml-4 bg-slate-950 text-white rounded-b-lg border border-white/20 cursor-pointer flex flex-col justify-end items-center pb-2 z-10 transition-all ${
                activeNote === 'F#' ? 'bg-rose-600' : 'hover:bg-slate-900'
              }`}
            >
              <span className="text-[10px] font-mono">[T]</span>
            </div>
            <div className="w-4" />
            <div
              onClick={() => playTone(NOTES[8].freq, NOTES[8].note)}
              className={`pointer-events-auto w-8 h-28 -ml-4 bg-slate-950 text-white rounded-b-lg border border-white/20 cursor-pointer flex flex-col justify-end items-center pb-2 z-10 transition-all ${
                activeNote === 'G#' ? 'bg-rose-600' : 'hover:bg-slate-900'
              }`}
            >
              <span className="text-[10px] font-mono">[Y]</span>
            </div>
            <div className="w-4" />
            <div
              onClick={() => playTone(NOTES[10].freq, NOTES[10].note)}
              className={`pointer-events-auto w-8 h-28 -ml-4 bg-slate-950 text-white rounded-b-lg border border-white/20 cursor-pointer flex flex-col justify-end items-center pb-2 z-10 transition-all ${
                activeNote === 'A#' ? 'bg-rose-600' : 'hover:bg-slate-900'
              }`}
            >
              <span className="text-[10px] font-mono">[U]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="h-6 border-t border-white/10 px-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Play with keyboard keys [A, W, S, E, D, F, T, G, Y, H, U, J, K]</span>
        <span className="text-rose-400">Pure Web Audio Waveforms</span>
      </div>
    </div>
  );
};
