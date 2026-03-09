import { Preset, CreatePresetDto } from '../types/preset';

const BASE = '/api/presets';

export async function fetchPresets(): Promise<Preset[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch presets');
  return res.json();
}

export async function createPreset(dto: CreatePresetDto): Promise<Preset> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.errors?.[0]?.message ?? 'Failed to create preset');
  }
  return res.json();
}

export async function deletePreset(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete preset');
}
