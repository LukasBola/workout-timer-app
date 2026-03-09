import { Request, Response, NextFunction } from 'express';
import { CreatePresetDto, ValidationError } from '../types/preset';

export function validateCreatePreset(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { name, workoutDuration, breakDuration, rounds } = req.body as Partial<CreatePresetDto>;
  const errors: ValidationError[] = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required and must be a non-empty string' });
  } else if (name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name must be 100 characters or fewer' });
  }

  if (workoutDuration === undefined || !Number.isInteger(workoutDuration) || workoutDuration < 1) {
    errors.push({ field: 'workoutDuration', message: 'workoutDuration must be a positive integer (seconds)' });
  } else if (workoutDuration > 3600) {
    errors.push({ field: 'workoutDuration', message: 'workoutDuration must be 3600 seconds or less' });
  }

  if (breakDuration === undefined || !Number.isInteger(breakDuration) || breakDuration < 1) {
    errors.push({ field: 'breakDuration', message: 'breakDuration must be a positive integer (seconds)' });
  } else if (breakDuration > 3600) {
    errors.push({ field: 'breakDuration', message: 'breakDuration must be 3600 seconds or less' });
  }

  if (rounds === undefined || !Number.isInteger(rounds) || rounds < 1) {
    errors.push({ field: 'rounds', message: 'rounds must be a positive integer' });
  } else if (rounds > 100) {
    errors.push({ field: 'rounds', message: 'rounds must be 100 or fewer' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
