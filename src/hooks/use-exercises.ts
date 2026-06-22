import { createCrudHooks } from "@/hooks/use-crud";
import { exerciseService } from "@/services/exercise.service";
import type { Exercise, ExerciseCreate, ExerciseUpdate } from "@/types";

export const {
  useList: useExerciseList,
  useGet: useExercise,
  useCreate: useCreateExercise,
  useUpdate: useUpdateExercise,
  useRemove: useDeleteExercise,
} = createCrudHooks<Exercise, ExerciseCreate, ExerciseUpdate>(
  exerciseService,
  "exercises",
);
