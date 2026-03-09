import { v4 as uuidv4 } from 'uuid';
import { Preset, CreatePresetDto } from '../types/preset';
import { presetStore } from '../models/presetStore';

export const presetService = {
  getAllPresets(): Preset[] {
    return presetStore.getAll();
  },

  getPresetById(id: string): Preset | undefined {
    return presetStore.getById(id);
  },

  createPreset(dto: CreatePresetDto): Preset {
    const preset: Preset = {
      id: uuidv4(),
      name: dto.name.trim(),
      workoutDuration: dto.workoutDuration,
      breakDuration: dto.breakDuration,
      rounds: dto.rounds,
      createdAt: new Date().toISOString(),
    };
    return presetStore.create(preset);
  },

  deletePreset(id: string): boolean {
    return presetStore.delete(id);
  },
};
