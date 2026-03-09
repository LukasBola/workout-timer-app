import { useRef, useCallback } from 'react';

// Uses Web Audio API to generate sounds without external libraries.
// AudioContext must be created/resumed after user interaction per browser policy.
export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    // Resume if suspended (browser may suspend until user gesture)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Short beep for countdown warnings
  const playBeep = useCallback((frequency = 880, duration = 0.1) => {
    try {
      const ctx = getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Silently fail if audio is unavailable
    }
  }, [getContext]);

  // Completion fanfare: three ascending tones
  const playCompletion = useCallback(() => {
    try {
      const ctx = getContext();
      const frequencies = [523, 659, 784]; // C5, E5, G5
      frequencies.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2);

        gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.2 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.4);

        oscillator.start(ctx.currentTime + i * 0.2);
        oscillator.stop(ctx.currentTime + i * 0.2 + 0.4);
      });
    } catch {
      // Silently fail
    }
  }, [getContext]);

  return { playBeep, playCompletion };
}
