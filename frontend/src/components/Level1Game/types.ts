
export enum GameState {
  Intro,
  Playing,
  Success,
  Fail,
}

export interface CodeLine {
  id: number;
  content: string;
  isBroken: boolean;
  correctContent: string;
  userAttempt: string;
  status: 'pending' | 'correct' | 'incorrect';
  instruction: string;
}
