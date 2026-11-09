import { useState, useCallback } from 'react';
import { AppId, WindowItem } from '../types/os';
import { APPS_REGISTRY } from '../services/appsRegistry';
import { soundEngine } from '../services/audio';

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowItem[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZ, setHighestZ] = useState<number>(10);

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setHighestZ((prev) => {
      const nextZ = prev + 1;
      setWindows((wins) =>
        wins.map((w) => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w))
      );
      return nextZ;
    });
  }, []);

  const openApp = useCallback(
    (appId: AppId, initialData?: Record<string, any>) => {
      const existing = windows.find((w) => w.appId === appId);
      if (existing) {
        if (existing.isMinimized) {
          setWindows((wins) =>
            wins.map((w) => (w.id === existing.id ? { ...w, isMinimized: false } : w))
          );
        }
        if (initialData) {
          setWindows((wins) =>
            wins.map((w) =>
              w.id === existing.id
                ? { ...w, stateData: { ...w.stateData, ...initialData } }
                : w
            )
          );
        }
        focusWindow(existing.id);
        soundEngine.playWindowOpen();
        return existing.id;
      }

      const meta = APPS_REGISTRY.find((a) => a.id === appId);
      const width = meta ? meta.defaultWidth : 700;
      const height = meta ? meta.defaultHeight : 480;

      // Center with slight cascade offset based on window count
      const offset = (windows.length % 6) * 28;
      const x = Math.max(20, Math.floor((window.innerWidth - width) / 2) + offset);
      const y = Math.max(40, Math.floor((window.innerHeight - height) / 2) - 20 + offset);

      const nextZ = highestZ + 1;
      setHighestZ(nextZ);

      const newWindow: WindowItem = {
        id: `win_${appId}_${Date.now()}`,
        appId,
        title: meta ? meta.name : appId,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        position: { x, y },
        size: { width, height },
        stateData: initialData,
      };

      setWindows((prev) => [...prev, newWindow]);
      setActiveWindowId(newWindow.id);
      soundEngine.playWindowOpen();
      return newWindow.id;
    },
    [windows, highestZ, focusWindow]
  );

  const closeWindow = useCallback(
    (id: string) => {
      soundEngine.playWindowClose();
      setWindows((prev) => {
        const remaining = prev.filter((w) => w.id !== id);
        if (activeWindowId === id) {
          const visible = remaining.filter((w) => !w.isMinimized);
          if (visible.length > 0) {
            const nextActive = visible.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), visible[0]);
            setActiveWindowId(nextActive.id);
          } else {
            setActiveWindowId(null);
          }
        }
        return remaining;
      });
    },
    [activeWindowId]
  );

  const minimizeWindow = useCallback(
    (id: string) => {
      soundEngine.playClick();
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
      );
      if (activeWindowId === id) {
        setActiveWindowId(null);
      }
    },
    [activeWindowId]
  );

  const toggleMaximize = useCallback((id: string) => {
    soundEngine.playClick();
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          // Restore
          return {
            ...w,
            isMaximized: false,
            position: w.prevPosition || { x: 100, y: 60 },
            size: w.prevSize || { width: 700, height: 480 },
          };
        } else {
          // Maximize
          return {
            ...w,
            isMaximized: true,
            prevPosition: { ...w.position },
            prevSize: { ...w.size },
            position: { x: 0, y: 32 }, // Account for top bar height
            size: { width: window.innerWidth, height: window.innerHeight - 32 - 76 }, // Account for top bar and dock
          };
        }
      })
    );
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position: { x, y } } : w))
    );
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size: { width, height } } : w))
    );
  }, []);

  return {
    windows,
    activeWindowId,
    openApp,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    setWindows,
  };
}
