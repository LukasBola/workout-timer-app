import { presetService } from "../src/services/presetService";

// Reset in-memory store between tests by creating presets and cleaning up
describe("presetService", () => {
  const createdIds: string[] = [];

  afterEach(() => {
    // Clean up created presets
    createdIds.forEach((id) => presetService.deletePreset(id));
    createdIds.length = 0;
  });

  describe("createPreset", () => {
    it("creates a preset with correct fields", () => {
      const dto = {
        name: "HIIT",
        workoutDuration: 30,
        breakDuration: 10,
        rounds: 8,
      };
      const preset = presetService.createPreset(dto);
      createdIds.push(preset.id);

      expect(preset.id).toBeDefined();
      expect(preset.name).toBe("HIIT");
      expect(preset.workoutDuration).toBe(30);
      expect(preset.breakDuration).toBe(10);
      expect(preset.rounds).toBe(8);
      expect(preset.createdAt).toBeDefined();
    });

    it("trims whitespace from name", () => {
      const preset = presetService.createPreset({
        name: "  Tabata  ",
        workoutDuration: 20,
        breakDuration: 10,
        rounds: 8,
      });
      createdIds.push(preset.id);
      expect(preset.name).toBe("Tabata");
    });
  });

  describe("getAllPresets", () => {
    it("returns all created presets", () => {
      const before = presetService.getAllPresets().length;
      const p1 = presetService.createPreset({
        name: "A",
        workoutDuration: 10,
        breakDuration: 5,
        rounds: 3,
      });
      const p2 = presetService.createPreset({
        name: "B",
        workoutDuration: 20,
        breakDuration: 10,
        rounds: 5,
      });
      createdIds.push(p1.id, p2.id);
      expect(presetService.getAllPresets().length).toBe(before + 2);
    });
  });

  describe("getPresetById", () => {
    it("returns the correct preset", () => {
      const p = presetService.createPreset({
        name: "Test",
        workoutDuration: 15,
        breakDuration: 5,
        rounds: 4,
      });
      createdIds.push(p.id);
      expect(presetService.getPresetById(p.id)).toEqual(p);
    });

    it("returns undefined for unknown id", () => {
      expect(presetService.getPresetById("nonexistent")).toBeUndefined();
    });
  });

  describe("deletePreset", () => {
    it("deletes an existing preset", () => {
      const p = presetService.createPreset({
        name: "Delete me",
        workoutDuration: 10,
        breakDuration: 5,
        rounds: 2,
      });
      expect(presetService.deletePreset(p.id)).toBe(true);
      expect(presetService.getPresetById(p.id)).toBeUndefined();
    });

    it("returns false for unknown id", () => {
      expect(presetService.deletePreset("nonexistent")).toBe(false);
    });
  });
});
