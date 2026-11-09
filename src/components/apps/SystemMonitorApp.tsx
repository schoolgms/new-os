import React, { useState } from 'react';
import { Cpu, HardDrive, Wifi, Shield, XCircle, RefreshCw } from 'lucide-react';
import { useSystemStats } from '../../hooks/useSystemStats';
import { soundEngine } from '../../services/audio';

export const SystemMonitorApp: React.FC = () => {
  const {
    cpuUsage,
    ramUsage,
    cpuHistory,
    ramHistory,
    networkHistory,
    uptime,
    isOnline,
    processes,
    killProcess,
    cores,
  } = useSystemStats();

  const [activeTab, setActiveTab] = useState<'performance' | 'processes' | 'specs'>('performance');

  // Convert number history array to SVG polyline coordinates
  const renderSvgGraph = (data: number[], maxVal: number, strokeColor: string, fillColor: string) => {
    const width = 280;
    const height = 70;
    const step = width / (data.length - 1);
    const points = data
      .map((val, idx) => {
        const x = idx * step;
        const y = height - (val / maxVal) * (height - 8) - 4;
        return `${x},${y}`;
      })
      .join(' ');

    const fillPoints = `0,${height} ${points} ${width},${height}`;

    return (
      <svg className="w-full h-16 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polygon points={fillPoints} fill={fillColor} />
        <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/80 text-slate-100 select-none overflow-hidden font-sans">
      {/* Tab Navigation */}
      <div className="h-11 border-b border-white/10 px-4 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'performance' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('processes')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'processes' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Processes ({processes.length})
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'specs' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Host Specs
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Uptime: <span className="text-cyan-400 font-semibold">{uptime}s</span>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'performance' && (
          <div className="space-y-4">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* CPU Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>CPU Load</span>
                  </div>
                  <span className="text-xl font-bold font-mono text-cyan-400">{cpuUsage}%</span>
                </div>
                <div className="mt-3">
                  {renderSvgGraph(cpuHistory, 100, '#06b6d4', 'rgba(6, 182, 212, 0.15)')}
                </div>
                <div className="mt-2 text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>{cores} Logical Cores</span>
                  <span>JIT Exec Active</span>
                </div>
              </div>

              {/* Memory Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <HardDrive className="w-4 h-4 text-indigo-400" />
                    <span>Memory</span>
                  </div>
                  <span className="text-xl font-bold font-mono text-indigo-400">{ramUsage}%</span>
                </div>
                <div className="mt-3">
                  {renderSvgGraph(ramHistory, 100, '#818cf8', 'rgba(129, 140, 248, 0.15)')}
                </div>
                <div className="mt-2 text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>Heap Alloc: ~180MB</span>
                  <span>GC Nominal</span>
                </div>
              </div>

              {/* Network Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Wifi className="w-4 h-4 text-emerald-400" />
                    <span>Network I/O</span>
                  </div>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {networkHistory[networkHistory.length - 1]} KB/s
                  </span>
                </div>
                <div className="mt-3">
                  {renderSvgGraph(networkHistory, 250, '#10b981', 'rgba(16, 185, 129, 0.15)')}
                </div>
                <div className="mt-2 text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>Socket Polling</span>
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>

            {/* Subsystem Telemetry Block */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-semibold text-slate-300">Subsystem Diagnostics</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-black/30 rounded-xl">
                  <div className="text-slate-400 text-[11px]">Audio Latency</div>
                  <div className="font-mono text-cyan-400 font-bold mt-1">~5.2 ms</div>
                </div>
                <div className="p-3 bg-black/30 rounded-xl">
                  <div className="text-slate-400 text-[11px]">Display Refresh</div>
                  <div className="font-mono text-emerald-400 font-bold mt-1">60.0 FPS</div>
                </div>
                <div className="p-3 bg-black/30 rounded-xl">
                  <div className="text-slate-400 text-[11px]">VFS Storage</div>
                  <div className="font-mono text-indigo-400 font-bold mt-1">LocalStorage</div>
                </div>
                <div className="p-3 bg-black/30 rounded-xl">
                  <div className="text-slate-400 text-[11px]">Sandbox Isolates</div>
                  <div className="font-mono text-amber-400 font-bold mt-1">7 Active</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'processes' && (
          <div className="space-y-2">
            <div className="grid grid-cols-12 px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-white/10 uppercase tracking-wider font-mono">
              <span className="col-span-2">PID</span>
              <span className="col-span-4">Process Name</span>
              <span className="col-span-2">CPU%</span>
              <span className="col-span-2">Memory</span>
              <span className="col-span-2 text-right">Action</span>
            </div>
            {processes.map((proc) => (
              <div
                key={proc.pid}
                className="grid grid-cols-12 items-center px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs transition-colors font-mono"
              >
                <span className="col-span-2 text-cyan-400">{proc.pid}</span>
                <span className="col-span-4 font-medium text-slate-200 truncate">{proc.name}</span>
                <span className="col-span-2 text-amber-300">{proc.cpu}%</span>
                <span className="col-span-2 text-indigo-300">{proc.memory} MB</span>
                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      killProcess(proc.pid);
                    }}
                    className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-semibold transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3 h-3" />
                    <span>Kill</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-3 text-xs">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5">
              <div className="text-xs font-semibold text-slate-200 pb-1 border-b border-white/10">
                Hardware & Host Environment
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Logical CPU Cores</span>
                <span className="font-mono text-cyan-300">{cores} Cores</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Screen Resolution</span>
                <span className="font-mono text-cyan-300">
                  {window.innerWidth} x {window.innerHeight} (DPR: {window.devicePixelRatio})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Browser Platform</span>
                <span className="font-mono text-cyan-300">{navigator.platform}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Connection Speed / Online</span>
                <span className="font-mono text-emerald-400">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">User Agent</span>
                <span className="font-mono text-slate-400 text-[10px] truncate max-w-[280px]">
                  {navigator.userAgent}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
