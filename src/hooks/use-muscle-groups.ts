import { createCrudHooks } from "@/hooks/use-crud";
import { muscleGroupService } from "@/services/muscle-group.service";
import type { MuscleGroup, MuscleGroupCreate, MuscleGroupUpdate } from "@/types";

export const {
  useList: useMuscleGroupList,
  useGet: useMuscleGroup,
  useCreate: useCreateMuscleGroup,
  useUpdate: useUpdateMuscleGroup,
  useRemove: useDeleteMuscleGroup,
} = createCrudHooks<MuscleGroup, MuscleGroupCreate, MuscleGroupUpdate>(
  muscleGroupService,
  "muscle-groups",
);
