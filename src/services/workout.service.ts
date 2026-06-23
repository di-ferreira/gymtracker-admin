import { createService } from "./base";
import api from "@/lib/api";
import type { Workout, WorkoutCreate, WorkoutUpdate, WorkoutExercise, WorkoutExerciseCreate, WorkoutExerciseUpdate } from "@/types";

const endpoint = "/admin/workouts";

export const workoutService = {
  ...createService<Workout, WorkoutCreate, WorkoutUpdate>(endpoint),

  getExercises: (workoutId: string) =>
    api.get<WorkoutExercise[]>(`${endpoint}/${workoutId}/exercises/`).then((r) => r.data),

  addExercise: (workoutId: string, data: WorkoutExerciseCreate) =>
    api.post<WorkoutExercise>(`${endpoint}/${workoutId}/exercises/`, data).then((r) => r.data),

  updateExercise: (workoutId: string, exerciseId: string, data: WorkoutExerciseUpdate) =>
    api.patch<WorkoutExercise>(`${endpoint}/${workoutId}/exercises/${exerciseId}`, data).then((r) => r.data),

  removeExercise: (workoutId: string, exerciseId: string) =>
    api.delete(`${endpoint}/${workoutId}/exercises/${exerciseId}`).then(() => undefined),
};
