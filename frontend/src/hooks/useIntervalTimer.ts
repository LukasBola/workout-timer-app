import { useState, useRef, useCallback, useEffect } from 'react';
import { TimerPhase, TimerSettings, TimerState } from '../types/timer';
import { useSound } from './useSound';

const PREP_DURATION = 5;
const WORKOUT_WARN_THRESHOLD = 5; // beep in last N seconds
const BREAK_WARN_THRESHOLD = 3;

const DEFAULT_SETTINGS: TimerSettings = {
  workoutDuration: 30,
  breakDuration: 10,
  rounds: 3,
  withPreparation: true,
};

function getInitialState(): TimerState {
  return {
    phase: 'idle',
    currentRound: 1,
    timeRemaining: 0,
    isRunning: false,
  };
}

export function useIntervalTimer() {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [timerState, setTimerState] = useState<TimerState>(getInitialState());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Use a ref to hold the "live" state so the interval callback always sees current values
  const stateRef = useRef<TimerState>(getInitialState());
  const settingsRef = useRef<TimerSettings>(DEFAULT_SETTINGS);
  const { playBeep, playCompletion } = useSound();

  // Keep refs in sync with state/settings
  useEffect(() => {
    stateRef.current = timerState;
  }, [timerState]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const setState = useCallback((next: TimerState) => {
    stateRef.current = next;
    setTimerState(next);
  }, []);

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Determines the next phase and time after the current phase ends
  function advancePhase(current: TimerState, cfg: TimerSettings): TimerState {
    if (current.phase === 'preparing') {
      return { ...current, phase: 'work', timeRemaining: cfg.workoutDuration };
    }

    if (current.phase === 'work') {
      if (current.currentRound < cfg.rounds) {
        return { ...current, phase: 'break', timeRemaining: cfg.breakDuration };
      }
      // Last round finished
      return { ...current, phase: 'completed', timeRemaining: 0, isRunning: false };
    }

    if (current.phase === 'break') {
      return {
        ...current,
        phase: 'work',
        currentRound: current.currentRound + 1,
        timeRemaining: cfg.workoutDuration,
      };
    }

    return current;
  }

  const tick = useCallback(() => {
    const current = stateRef.current;
    const cfg = settingsRef.current;

    if (!current.isRunning) return;

    const next = current.timeRemaining - 1;

    // Play beep warnings
    if (current.phase === 'work' && next > 0 && next <= WORKOUT_WARN_THRESHOLD) {
      playBeep(880, 0.08);
    }
    if (current.phase === 'break' && next > 0 && next <= BREAK_WARN_THRESHOLD) {
      playBeep(660, 0.08);
    }
    if (current.phase === 'preparing' && next > 0 && next <= 3) {
      playBeep(440, 0.08);
    }

    if (next <= 0) {
      const advanced = advancePhase(current, cfg);
      if (advanced.phase === 'completed') {
        stopInterval();
        playCompletion();
        setState({ ...advanced, isRunning: false });
      } else {
        setState({ ...advanced, isRunning: true });
      }
    } else {
      setState({ ...current, timeRemaining: next });
    }
  }, [playBeep, playCompletion, stopInterval, setState]);

  const startInterval = useCallback(() => {
    stopInterval();
    intervalRef.current = setInterval(tick, 1000);
  }, [tick, stopInterval]);

  const start = useCallback(() => {
    const cfg = settingsRef.current;
    const initialPhase: TimerPhase = cfg.withPreparation ? 'preparing' : 'work';
    const initialTime = cfg.withPreparation ? PREP_DURATION : cfg.workoutDuration;

    const initial: TimerState = {
      phase: initialPhase,
      currentRound: 1,
      timeRemaining: initialTime,
      isRunning: true,
    };

    setState(initial);
    startInterval();
  }, [setState, startInterval]);

  const pause = useCallback(() => {
    stopInterval();
    setState({ ...stateRef.current, isRunning: false });
  }, [stopInterval, setState]);

  const resume = useCallback(() => {
    setState({ ...stateRef.current, isRunning: true });
    startInterval();
  }, [setState, startInterval]);

  const reset = useCallback(() => {
    stopInterval();
    setState(getInitialState());
  }, [stopInterval, setState]);

  // Cleanup on unmount
  useEffect(() => () => stopInterval(), [stopInterval]);

  return {
    timerState,
    settings,
    setSettings,
    start,
    pause,
    resume,
    reset,
  };
}
