export type AppId =
  | 'terminal'
  | 'files'
  | 'editor'
  | 'nova-ai'
  | 'monitor'
  | 'browser'
  | 'paint'
  | 'calc'
  | 'synth'
  | 'settings'
  | 'appstore';

export interface AppMetadata {
  id: AppId;
  name: string;
  iconName: string;
  category: 'System' | 'Productivity' | 'Utilities' | 'Media' | 'AI';
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
}

export interface WindowItem {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  prevPosition?: { x: number; y: number };
  prevSize?: { width: number; height: number };
  stateData?: Record<string, any>;
}

export interface FileSystemNode {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  parentId: string | null;
  content?: string;
  size: number; // in bytes
  createdAt: number;
  modifiedAt: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

export type AccentColor = 'cyan' | 'emerald' | 'violet' | 'rose' | 'amber' | 'blue';

export type DockPosition = 'bottom' | 'left' | 'right';

export interface SystemSettings {
  wallpaper: string;
  accentColor: AccentColor;
  dockPosition: DockPosition;
  blurIntensity: 'none' | 'subtle' | 'medium' | 'high';
  soundEnabled: boolean;
  soundVolume: number;
  isLocked: boolean;
  darkTheme: boolean;
}

export interface ProcessItem {
  pid: number;
  name: string;
  cpu: number;
  memory: number; // MB
  status: 'Running' | 'Sleeping' | 'Idle';
  user: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: GroundingSource[];
  isError?: boolean;
}
