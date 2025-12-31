export type TabId = 'problem' | 'cluster' | 'modulo' | 'consistent' | 'virtual' | 'quiz';

export interface Node {
  id: string;
  name: string;
  color: string;
  capacity?: number; // In GB
  angle?: number; // 0-360 for ring
  isVirtual?: boolean;
  parentColor?: string; // For virtual nodes tracking back to parent
}

export interface KeyItem {
  id: string;
  val: string;
  hash: number;
  angle?: number; // 0-360 for ring
  assignedNodeId?: string;
}

export const NODE_COLORS = [
  'bg-cyan-500 border-cyan-400',
  'bg-purple-500 border-purple-400',
  'bg-emerald-500 border-emerald-400',
  'bg-amber-500 border-amber-400',
  'bg-rose-500 border-rose-400',
];

export const RING_COLORS = [
  '#06b6d4', // cyan-500
  '#a855f7', // purple-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#f43f5e', // rose-500
];