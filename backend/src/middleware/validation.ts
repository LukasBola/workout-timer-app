import { Request, Response, NextFunction } from 'express';
import { CreatePresetSchema } from '../schemas/preset';

export function validateCreatePreset(req: Request, res: Response, next: NextFunction): void {
  const result = CreatePresetSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }
  req.body = result.data;
  next();
}
