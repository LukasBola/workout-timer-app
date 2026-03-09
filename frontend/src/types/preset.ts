export interface Preset {
  id: string;
  name: string;
  workoutDuration: number;
  breakDuration: number;
  rounds: number;
  createdAt: string;
}

export interface CreatePresetDto {
  name: string;
  workoutDuration: number;
  breakDuration: number;
  rounds: number;
}
