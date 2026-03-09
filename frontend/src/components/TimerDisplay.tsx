import { TimerState } from '../types/timer';

interface Props {
  state: TimerState;
  totalRounds: number;
}

const PHASE_LABELS: Record<string, string> = {
  idle: 'Ready',
  preparing: 'Get Ready!',
  work: 'Workout',
  break: 'Break',
  completed: 'Completed!',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function TimerDisplay({ state, totalRounds }: Props) {
  const { phase, currentRound, timeRemaining } = state;

  return (
    <div className={`timer-display phase-${phase}`}>
      <div className="phase-label">{PHASE_LABELS[phase] ?? phase}</div>
      {phase !== 'idle' && phase !== 'completed' && (
        <div className="round-indicator">
          Round {currentRound} / {totalRounds}
        </div>
      )}
      {phase !== 'idle' && phase !== 'completed' && (
        <div className="time-remaining">{formatTime(timeRemaining)}</div>
      )}
      {phase === 'completed' && (
        <div className="completion-message">Great work! All rounds done.</div>
      )}
    </div>
  );
}
