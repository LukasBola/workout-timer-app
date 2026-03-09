import { useState } from 'react';
import { TimerSettings } from '../types/timer';

interface Props {
  settings: TimerSettings;
  onChange: (settings: TimerSettings) => void;
  disabled: boolean;
}

interface FieldErrors {
  workoutDuration?: string;
  breakDuration?: string;
  rounds?: string;
}

function validatePositiveInt(value: string, min = 1, max = 3600): string | undefined {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min) return `Must be a whole number of at least ${min}`;
  if (n > max) return `Must be ${max} or less`;
  return undefined;
}

export function TimerSettingsForm({ settings, onChange, disabled }: Props) {
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleChange(field: keyof TimerSettings, raw: string) {
    if (field === 'withPreparation') return;

    const err = validatePositiveInt(raw, 1, field === 'rounds' ? 100 : 3600);
    setErrors(prev => ({ ...prev, [field]: err }));

    if (!err) {
      onChange({ ...settings, [field]: Number(raw) });
    }
  }

  return (
    <form className="settings-form" onSubmit={e => e.preventDefault()}>
      <h2>Settings</h2>

      <label>
        Workout duration (s)
        <input
          type="number"
          min={1}
          max={3600}
          defaultValue={settings.workoutDuration}
          disabled={disabled}
          onChange={e => handleChange('workoutDuration', e.target.value)}
        />
        {errors.workoutDuration && <span className="error">{errors.workoutDuration}</span>}
      </label>

      <label>
        Break duration (s)
        <input
          type="number"
          min={1}
          max={3600}
          defaultValue={settings.breakDuration}
          disabled={disabled}
          onChange={e => handleChange('breakDuration', e.target.value)}
        />
        {errors.breakDuration && <span className="error">{errors.breakDuration}</span>}
      </label>

      <label>
        Rounds
        <input
          type="number"
          min={1}
          max={100}
          defaultValue={settings.rounds}
          disabled={disabled}
          onChange={e => handleChange('rounds', e.target.value)}
        />
        {errors.rounds && <span className="error">{errors.rounds}</span>}
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={settings.withPreparation}
          disabled={disabled}
          onChange={e => onChange({ ...settings, withPreparation: e.target.checked })}
        />
        5-second preparation countdown
      </label>
    </form>
  );
}
