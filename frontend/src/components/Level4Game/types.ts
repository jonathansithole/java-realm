export enum MachineState {
  BROKEN = 'BROKEN',
  FIXING = 'FIXING',
  FIXED = 'FIXED',
  ERROR = 'ERROR',
}

export interface Challenge {
  id: number;
  title: string;
  machineName: string;
  description: string;
  instructions: string[];
  initialCode: string;
  hint: string;
  solutionCriteria: string; // For Gemini context
  timeLimit?: number; // Duration in seconds
}

export interface ValidationResult {
  success: boolean;
  message: string;
  consoleOutput?: string;
}