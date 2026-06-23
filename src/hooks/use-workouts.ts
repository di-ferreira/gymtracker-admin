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
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "@/actions/api.action";
import type { Workout, WorkoutCreate, WorkoutUpdate, WorkoutExercise, WorkoutExerciseCreate, WorkoutExerciseUpdate } from "@/types";

export function useWorkoutList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["workouts", params],
    queryFn: () => apiList<Workout>("/admin/workouts", params),
  });
}

export function useWorkout(id: string) {
  return useQuery({
    queryKey: ["workouts", id],
    queryFn: () => apiGetOne<Workout>(`/admin/workouts/${id}`),
    enabled: !!id,
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkoutCreate) =>
      apiCreateOne<Workout>("/admin/workouts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WorkoutUpdate }) =>
      apiUpdateOne<Workout>(`/admin/workouts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRemoveOne(`/admin/workouts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useWorkoutExercises(workoutId: string | undefined) {
  return useQuery({
    queryKey: ["workout-exercises", workoutId],
    queryFn: () => apiGet<WorkoutExercise[]>(`/admin/workouts/${workoutId}/exercises/`),
    enabled: !!workoutId,
  });
}

export function useAddWorkoutExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, data }: { workoutId: string; data: WorkoutExerciseCreate }) =>
      apiPost<WorkoutExercise>(`/admin/workouts/${workoutId}/exercises/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
    },
  });
}

export function useUpdateWorkoutExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId, data }: { workoutId: string; exerciseId: string; data: WorkoutExerciseUpdate }) =>
      apiPatch<WorkoutExercise>(`/admin/workouts/${workoutId}/exercises/${exerciseId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
    },
  });
}

export function useRemoveWorkoutExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId }: { workoutId: string; exerciseId: string }) =>
      apiDelete(`/admin/workouts/${workoutId}/exercises/${exerciseId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
    },
  });
}
