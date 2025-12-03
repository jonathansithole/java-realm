export enum GameState {
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum LoopType {
  FOR = 'For Loop',
  WHILE = 'While Loop',
  NESTED = 'Nested Loop',
  CONDITION = 'Loop Condition'
}

export interface Puzzle {
  id: number;
  title: string;
  description: string;
  brokenCode: string;
  hint: string;
  solutionRegex: RegExp; // Simplified validation for the game loop
  loopType: LoopType;
  visualType: 'conveyor' | 'door' | 'laser' | 'bridge' | 'reactor';
}

export interface Message {
  sender: 'system' | 'user' | 'ai';
  text: string;
}

export interface ReactorStats {
  stability: number;
  efficiency: number;
  synchronization: number;
}