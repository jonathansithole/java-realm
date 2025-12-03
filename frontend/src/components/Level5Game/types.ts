export enum ChallengeStatus {
  LOCKED,
  ACTIVE,
  COMPLETED
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  instructions: string;
  initialCode: string;
  hint: string;
  successMessage: string;
}

export interface VerificationResult {
  passed: boolean;
  feedback: string;
  consoleOutput: string;
}

export interface GameState {
  currentLevel: number;
  completedLevels: number[];
  isVerifying: boolean;
  code: string;
  logs: string[];
  feedback: string | null;
  showSuccessModal: boolean;
  timeLeft: number; // Time remaining in seconds
  isPaused: boolean;
  isGameOver: boolean;
  isGameClosed: boolean;
}