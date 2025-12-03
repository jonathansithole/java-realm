export enum LevelStatus {
  LOCKED = 'LOCKED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface LevelData {
  id: number;
  title: string;
  scenario: string;
  brokenCode: string;
  correctCode: string; // Simplified for string comparison
  validationKeywords: string[]; // Words that must exist
  machineName: string;
  hint: string; // Static hint fallback
}

export interface ChatMessage {
  id: string;
  sender: 'SYSTEM' | 'EXPLORER' | 'DEBUG-BOT';
  text: string;
  isTyping?: boolean;
}

export type VisualState = 'UNSTABLE' | 'STABILIZING' | 'STABLE';
