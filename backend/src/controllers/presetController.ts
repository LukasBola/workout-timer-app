import { Request, Response } from 'express';
import { presetService } from '../services/presetService';
import { CreatePresetDto } from '../schemas/preset';

export const presetController = {
  getAll(req: Request, res: Response): void {
    const presets = presetService.getAllPresets();
    res.json(presets);
  },

  getById(req: Request, res: Response): void {
    const preset = presetService.getPresetById(req.params.id);
    if (!preset) {
      res.status(404).json({ error: 'Preset not found' });
      return;
    }
    res.json(preset);
  },

  create(req: Request, res: Response): void {
    const dto: CreatePresetDto = req.body;
    const preset = presetService.createPreset(dto);
    res.status(201).json(preset);
  },

  delete(req: Request, res: Response): void {
    const deleted = presetService.deletePreset(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Preset not found' });
      return;
    }
    res.status(204).send();
  },
};
