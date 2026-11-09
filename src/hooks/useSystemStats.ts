import { useState, useEffect } from 'react';
import { ProcessItem } from '../types/os';

export function useSystemStats() {
  const [cpuUsage, setCpuUsage] = useState<number>(14);
  const [ramUsage, setRamUsage] = useState<number>(38); // percentage
  const [cpuHistory, setCpuHistory] = useState<number[]>([12, 15, 18, 14, 22, 19, 14, 16, 25, 14]);
  const [ramHistory, setRamHistory] = useState<number[]>([35, 36, 36, 37, 38, 38, 37, 38, 39, 38]);
  const [networkHistory, setNetworkHistory] = useState<number[]>([40, 25, 80, 110, 45, 60, 95, 30, 20, 55]);
  const [uptime, setUptime] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [batteryLevel, setBatteryLevel] = useState<number>(94);
  const [isCharging, setIsCharging] = useState<boolean>(true);

  const [processes, setProcesses] = useState<ProcessItem[]>([
    { pid: 101, name: 'kernel.wasm', cpu: 1.2, memory: 42.5, status: 'Running', user: 'root' },
    { pid: 102, name: 'window-compositor', cpu: 3.4, memory: 68.2, status: 'Running', user: 'system' },
    { pid: 103, name: 'vfs-indexer', cpu: 0.8, memory: 28.1, status: 'Sleeping', user: 'system' },
    { pid: 104, name: 'webaudio-engine', cpu: 1.5, memory: 34.0, status: 'Running', user: 'user' },
    { pid: 105, name: 'zenith-terminal', cpu: 0.4, memory: 22.4, status: 'Idle', user: 'user' },
    { pid: 106, name: 'nova-copilot-service', cpu: 2.1, memory: 85.6, status: 'Running', user: 'user' },
    { pid: 107, name: 'spotlight-daemon', cpu: 0.2, memory: 14.8, status: 'Sleeping', user: 'system' },
  ]);

  // Online status listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Battery API if supported
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Live telemetry pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);

      // Organic realistic fluctuations
      const nextCpu = Math.max(8, Math.min(85, Math.round(18 + Math.sin(Date.now() / 3000) * 10 + (Math.random() * 12 - 6))));
      const nextRam = Math.max(30, Math.min(70, Math.round(38 + Math.cos(Date.now() / 6000) * 4 + (Math.random() * 2 - 1))));
      const nextNet = Math.max(10, Math.min(250, Math.round(45 + Math.random() * 60)));

      setCpuUsage(nextCpu);
      setRamUsage(nextRam);

      setCpuHistory((prev) => [...prev.slice(1), nextCpu]);
      setRamHistory((prev) => [...prev.slice(1), nextRam]);
      setNetworkHistory((prev) => [...prev.slice(1), nextNet]);

      // Gently perturb process stats
      setProcesses((prev) =>
        prev.map((p) => {
          if (p.status === 'Running') {
            const jitter = (Math.random() - 0.5) * 0.4;
            return { ...p, cpu: Math.max(0.1, Number((p.cpu + jitter).toFixed(1))) };
          }
          return p;
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const killProcess = (pid: number) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
  };

  return {
    cpuUsage,
    ramUsage,
    cpuHistory,
    ramHistory,
    networkHistory,
    uptime,
    isOnline,
    batteryLevel,
    isCharging,
    processes,
    killProcess,
    cores: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8,
  };
}
