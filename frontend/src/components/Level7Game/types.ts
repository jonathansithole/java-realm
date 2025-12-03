export enum ChallengeType {
  ARITHMETIC = 'ARITHMETIC',
  NULL_POINTER = 'NULL_POINTER',
  ARRAY_INDEX = 'ARRAY_INDEX',
  MULTIPLE = 'MULTIPLE',
  POLYMORPHIC = 'POLYMORPHIC'
}

export interface Level {
  id: number;
  title: string;
  description: string;
  story: string;
  initialCode: string;
  brokenLine: string;
  expectedException: string[];
  hint: string; // Static fallback hint
  type: ChallengeType;
  validationRegex: RegExp[]; // Simple regex to check for structure
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success';
  timestamp: Date;
}

export enum GameStatus {
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED'
}

export enum MachineStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  ERROR = 'ERROR',
  STABILIZED = 'STABILIZED'
}
