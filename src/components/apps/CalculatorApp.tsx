import React, { useState, useEffect } from 'react';
import { Delete, History, Trash2 } from 'lucide-react';
import { soundEngine } from '../../services/audio';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const inputDigit = (digit: string) => {
    soundEngine.playClick();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    soundEngine.playClick();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    soundEngine.playClick();
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    soundEngine.playClick();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperator: string) => {
    soundEngine.playClick();
    const inputValue = parseFloat(display);

    if (prevValue == null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      let calculated = 0;

      switch (operator) {
        case '+':
          calculated = currentValue + inputValue;
          break;
        case '-':
          calculated = currentValue - inputValue;
          break;
        case '×':
          calculated = currentValue * inputValue;
          break;
        case '÷':
          calculated = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        case '^':
          calculated = Math.pow(currentValue, inputValue);
          break;
      }

      setHistory((prev) => [`${currentValue} ${operator} ${inputValue} = ${calculated}`, ...prev]);
      setDisplay(String(calculated));
      setPrevValue(calculated);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    soundEngine.playClick();
    if (operator && prevValue != null) {
      performOperation(operator);
      setOperator(null);
      setPrevValue(null);
    }
  };

  const handleSpecial = (op: string) => {
    soundEngine.playClick();
    const val = parseFloat(display);
    let result = val;
    switch (op) {
      case 'sqrt':
        result = Math.sqrt(val);
        break;
      case 'sqr':
        result = val * val;
        break;
      case 'sin':
        result = Math.sin(val);
        break;
      case 'cos':
        result = Math.cos(val);
        break;
      case 'pct':
        result = val / 100;
        break;
      case 'neg':
        result = -val;
        break;
    }
    setDisplay(String(Number(result.toFixed(6))));
    setWaitingForOperand(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/85 text-slate-100 select-none overflow-hidden font-sans p-4">
      {/* Top Bar with History Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
        <span className="text-slate-400 font-medium">Calculator Pro</span>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`p-1.5 rounded-lg transition-colors ${
            showHistory ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
          title="History tape"
        >
          <History className="w-3.5 h-3.5" />
        </button>
      </div>

      {showHistory ? (
        <div className="flex-1 overflow-y-auto py-2 space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center text-slate-500 text-[10px]">
            <span>Calculation Tape</span>
            <button
              onClick={() => setHistory([])}
              className="hover:text-rose-400 transition-colors"
            >
              Clear
            </button>
          </div>
          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-600">No previous calculations</div>
          ) : (
            history.map((h, i) => (
              <div key={i} className="p-2 bg-white/5 rounded-lg border border-white/5">
                {h}
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Display screen */}
          <div className="my-3 p-4 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col items-end justify-center min-h-[72px]">
            {operator && (
              <span className="text-xs text-cyan-400 font-mono mb-1">
                {prevValue} {operator}
              </span>
            )}
            <span className="text-3xl font-mono font-bold tracking-tight text-white truncate max-w-full">
              {display}
            </span>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-2 flex-1">
            <button
              onClick={clearAll}
              className="rounded-xl bg-white/10 hover:bg-white/15 text-rose-300 font-semibold text-xs transition-colors"
            >
              AC
            </button>
            <button
              onClick={backspace}
              className="rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs flex items-center justify-center transition-colors"
            >
              <Delete className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSpecial('pct')}
              className="rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-colors"
            >
              %
            </button>
            <button
              onClick={() => performOperation('÷')}
              className="rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-sm transition-colors"
            >
              ÷
            </button>

            <button
              onClick={() => handleSpecial('sqrt')}
              className="rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-mono transition-colors"
            >
              √x
            </button>
            <button
              onClick={() => handleSpecial('sqr')}
              className="rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-mono transition-colors"
            >
              x²
            </button>
            <button
              onClick={() => handleSpecial('sin')}
              className="rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-mono transition-colors"
            >
              sin
            </button>
            <button
              onClick={() => performOperation('×')}
              className="rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-sm transition-colors"
            >
              ×
            </button>

            {['7', '8', '9'].map((d) => (
              <button
                key={d}
                onClick={() => inputDigit(d)}
                className="rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => performOperation('-')}
              className="rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-sm transition-colors"
            >
              -
            </button>

            {['4', '5', '6'].map((d) => (
              <button
                key={d}
                onClick={() => inputDigit(d)}
                className="rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => performOperation('+')}
              className="rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-sm transition-colors"
            >
              +
            </button>

            {['1', '2', '3'].map((d) => (
              <button
                key={d}
                onClick={() => inputDigit(d)}
                className="rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors"
              >
                {d}
              </button>
            ))}
            <button
              onClick={handleEquals}
              className="row-span-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-lg shadow-lg shadow-cyan-500/30 transition-colors flex items-center justify-center"
            >
              =
            </button>

            <button
              onClick={() => handleSpecial('neg')}
              className="rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
            >
              ±
            </button>
            <button
              onClick={() => inputDigit('0')}
              className="rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors"
            >
              0
            </button>
            <button
              onClick={inputDot}
              className="rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors"
            >
              .
            </button>
          </div>
        </>
      )}
    </div>
  );
};
