import { TimerPhase } from '../types/timer';

interface Props {
  phase: TimerPhase;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function TimerControls({ phase, isRunning, onStart, onPause, onResume, onReset }: Props) {
  return (
    <div className="timer-controls">
      {phase === 'idle' && (
        <button className="btn btn-start" onClick={onStart}>Start</button>
      )}
      {phase !== 'idle' && phase !== 'completed' && isRunning && (
        <button className="btn btn-pause" onClick={onPause}>Pause</button>
      )}
      {phase !== 'idle' && phase !== 'completed' && !isRunning && (
        <button className="btn btn-resume" onClick={onResume}>Resume</button>
      )}
      {(phase !== 'idle') && (
        <button className="btn btn-reset" onClick={onReset}>Reset</button>
      )}
    </div>
  );
}
