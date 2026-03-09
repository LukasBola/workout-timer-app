import { useEffect, useState, useCallback } from 'react';
import { Preset, CreatePresetDto } from '../types/preset';
import { TimerSettings } from '../types/timer';
import { fetchPresets, createPreset, deletePreset } from '../api/presets';

interface Props {
  currentSettings: TimerSettings;
  onLoad: (settings: TimerSettings) => void;
  disabled: boolean;
}

export function PresetList({ currentSettings, onLoad, disabled }: Props) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [presetName, setPresetName] = useState('');
  const [loading, setLoading] = useState(false);

  const loadPresets = useCallback(async () => {
    try {
      const data = await fetchPresets();
      setPresets(data);
    } catch {
      // Backend may not be running; show empty list silently
    }
  }, []);

  useEffect(() => { loadPresets(); }, [loadPresets]);

  async function handleSave() {
    if (!presetName.trim()) {
      setSaveError('Name is required');
      return;
    }
    setSaveError(null);
    setLoading(true);
    try {
      const dto: CreatePresetDto = {
        name: presetName.trim(),
        workoutDuration: currentSettings.workoutDuration,
        breakDuration: currentSettings.breakDuration,
        rounds: currentSettings.rounds,
      };
      const created = await createPreset(dto);
      setPresets(prev => [...prev, created]);
      setPresetName('');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePreset(id);
      setPresets(prev => prev.filter(p => p.id !== id));
    } catch {
      // Ignore
    }
  }

  function handleLoad(preset: Preset) {
    onLoad({
      workoutDuration: preset.workoutDuration,
      breakDuration: preset.breakDuration,
      rounds: preset.rounds,
      withPreparation: currentSettings.withPreparation,
    });
  }

  return (
    <div className="preset-list">
      <h2>Presets</h2>

      <div className="preset-save-row">
        <input
          type="text"
          placeholder="Preset name"
          value={presetName}
          onChange={e => setPresetName(e.target.value)}
          disabled={disabled || loading}
          maxLength={100}
        />
        <button
          className="btn btn-save"
          onClick={handleSave}
          disabled={disabled || loading}
        >
          Save current
        </button>
      </div>
      {saveError && <span className="error">{saveError}</span>}

      {presets.length === 0 && <p className="no-presets">No presets saved yet.</p>}
      <ul>
        {presets.map(p => (
          <li key={p.id} className="preset-item">
            <span className="preset-name">{p.name}</span>
            <span className="preset-meta">{p.workoutDuration}s / {p.breakDuration}s / {p.rounds}r</span>
            <div className="preset-actions">
              <button
                className="btn btn-small"
                onClick={() => handleLoad(p)}
                disabled={disabled}
              >
                Load
              </button>
              <button
                className="btn btn-small btn-danger"
                onClick={() => handleDelete(p.id)}
                disabled={disabled}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
