import { z } from 'zod';

export const CreatePresetSchema = z.object({
  name: z.string().min(1, 'Name is required and must be a non-empty string').max(100, 'Name must be 100 characters or fewer'),
  workoutDuration: z.number().int().min(1, 'workoutDuration must be a positive integer (seconds)').max(3600, 'workoutDuration must be 3600 seconds or less'),
  breakDuration: z.number().int().min(1, 'breakDuration must be a positive integer (seconds)').max(3600, 'breakDuration must be 3600 seconds or less'),
  rounds: z.number().int().min(1, 'rounds must be a positive integer').max(100, 'rounds must be 100 or fewer'),
});

export type CreatePresetDto = z.infer<typeof CreatePresetSchema>;
