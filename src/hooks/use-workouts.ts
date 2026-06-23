import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutService } from "@/services/workout.service";
import type {
  WorkoutCreate,
  WorkoutUpdate,
  WorkoutExerciseCreate,
  WorkoutExerciseUpdate,
} from "@/types";
import type { QueryParams } from "@/services/base";

export function useWorkoutList(params?: QueryParams) {
  return useQuery({
    queryKey: ["workouts", params],
    queryFn: () => workoutService.list(params),
  });
}

export function useWorkout(id: string) {
  return useQuery({
    queryKey: ["workouts", id],
    queryFn: () => workoutService.get(id),
    enabled: !!id,
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkoutCreate) => workoutService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WorkoutUpdate }) =>
      workoutService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workoutService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useWorkoutExercises(workoutId: string | undefined) {
  return useQuery({
    queryKey: ["workout-exercises", workoutId],
    queryFn: () => workoutService.getExercises(workoutId!),
    enabled: !!workoutId,
  });
}

export function useAddWorkoutExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, data }: { workoutId: string; data: WorkoutExerciseCreate }) =>
      workoutService.addExercise(workoutId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
    },
  });
}

export function useUpdateWorkoutExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId, data }: { workoutId: string; exerciseId: string; data: WorkoutExerciseUpdate }) =>
      workoutService.updateExercise(workoutId, exerciseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
    },
  });
}

export function useRemoveWorkoutExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId }: { workoutId: string; exerciseId: string }) =>
      workoutService.removeExercise(workoutId, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
    },
  });
}
