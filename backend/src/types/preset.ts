export interface Preset {
  id: string;
  name: string;
  workoutDuration: number; // seconds
  breakDuration: number;   // seconds
  rounds: number;
  createdAt: string;
}

export interface CreatePresetDto {
  name: string;
  workoutDuration: number;
  breakDuration: number;
  rounds: number;
}

export interface ValidationError {
  field: string;
  message: string;
}
