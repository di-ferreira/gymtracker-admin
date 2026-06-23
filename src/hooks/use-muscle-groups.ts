import { createCrudHooks } from "@/hooks/use-crud";
import type { MuscleGroup, MuscleGroupCreate, MuscleGroupUpdate } from "@/types";

export const {
  useList: useMuscleGroupList,
  useGet: useMuscleGroup,
  useCreate: useCreateMuscleGroup,
  useUpdate: useUpdateMuscleGroup,
  useRemove: useDeleteMuscleGroup,
} = createCrudHooks<MuscleGroup, MuscleGroupCreate, MuscleGroupUpdate>(
  "/admin/catalog/muscle-groups",
  "muscle-groups",
);
