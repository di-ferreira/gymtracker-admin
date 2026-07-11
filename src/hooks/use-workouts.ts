import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  apiList,
  apiGetOne,
  apiCreateOne,
  apiUpdateOne,
  apiRemoveOne,
  apiPost,
  apiPatch,
  apiDelete,
} from "@/actions/api.action";
import type { Workout, WorkoutCreate, WorkoutUpdate, WorkoutExercise, WorkoutExerciseCreate, WorkoutExerciseUpdate } from "@/types";

export function useWorkoutList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["workouts", params],
    queryFn: () => apiList<Workout>("/workouts", params),
  });
}

export function useWorkout(id: string) {
  return useQuery({
    queryKey: ["workouts", id],
    queryFn: () => apiGetOne<Workout>(`/workouts/${id}`),
    enabled: !!id,
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkoutCreate) =>
      apiCreateOne<Workout>("/workouts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WorkoutUpdate }) =>
      apiUpdateOne<Workout>(`/workouts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRemoveOne(`/workouts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useAddWorkoutExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, data }: { workoutId: string; data: WorkoutExerciseCreate }) =>
      apiPost<WorkoutExercise>(`/workouts/${workoutId}/exercises/`, data),
    onSuccess: (_data, { workoutId }) => {
      queryClient.invalidateQueries({ queryKey: ["workouts", workoutId] });
    },
  });
}

export function useUpdateWorkoutExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId, data }: { workoutId: string; exerciseId: string; data: WorkoutExerciseUpdate }) =>
      apiPatch<WorkoutExercise>(`/workouts/${workoutId}/exercises/${exerciseId}`, data),
    onSuccess: (_data, { workoutId }) => {
      queryClient.invalidateQueries({ queryKey: ["workouts", workoutId] });
    },
  });
}

export function useRemoveWorkoutExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId }: { workoutId: string; exerciseId: string }) =>
      apiDelete(`/workouts/${workoutId}/exercises/${exerciseId}`),
    onSuccess: (_data, { workoutId }) => {
      queryClient.invalidateQueries({ queryKey: ["workouts", workoutId] });
    },
  });
}
