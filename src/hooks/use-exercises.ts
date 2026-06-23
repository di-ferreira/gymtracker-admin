import { createCrudHooks } from "@/hooks/use-crud";
import type { Exercise, ExerciseCreate, ExerciseUpdate } from "@/types";

export const {
  useList: useExerciseList,
  useGet: useExercise,
  useCreate: useCreateExercise,
  useUpdate: useUpdateExercise,
  useRemove: useDeleteExercise,
} = createCrudHooks<Exercise, ExerciseCreate, ExerciseUpdate>(
  "/admin/catalog/exercises",
  "exercises",
);
