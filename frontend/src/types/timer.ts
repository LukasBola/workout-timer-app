export type TimerPhase = 'idle' | 'preparing' | 'work' | 'break' | 'completed';

export interface TimerSettings {
  workoutDuration: number;  // seconds
  breakDuration: number;    // seconds
  rounds: number;
  withPreparation: boolean;
}

export interface TimerState {
  phase: TimerPhase;
  currentRound: number;
  timeRemaining: number;
  isRunning: boolean;
}
