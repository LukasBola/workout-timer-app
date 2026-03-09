import { Preset } from '../types/preset';

// In-memory storage. To swap to a database, implement the same interface in a new module.
class PresetStore {
  private presets: Map<string, Preset> = new Map();

  getAll(): Preset[] {
    return Array.from(this.presets.values());
  }

  getById(id: string): Preset | undefined {
    return this.presets.get(id);
  }

  create(preset: Preset): Preset {
    this.presets.set(preset.id, preset);
    return preset;
  }

  delete(id: string): boolean {
    return this.presets.delete(id);
  }
}

// Export singleton instance
export const presetStore = new PresetStore();
