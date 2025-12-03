export enum ChallengeStatus {
  LOCKED = 'LOCKED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  starterCode: string;
  scenario: string;
  task: string;
  expectedBehavior: string;
  hint: string;
}

export interface VisualState {
  doorOpen: boolean;
  platformActive: boolean;
  elevatorLevel: number; // 0, 1, 2
  sparkles: boolean;
  devicesActive: boolean[]; // For array challenge
}

export interface ValidationResponse {
  success: boolean;
  feedback: string;
  visualAction?: 'OPEN_DOOR' | 'ACTIVATE_PLATFORM' | 'POLYMORPHISM_DEMO' | 'ELEVATOR_RIDE' | 'ARRAY_LOOP';
}
