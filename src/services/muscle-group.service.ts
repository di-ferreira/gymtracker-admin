import { createService } from "./base";
import type {
  MuscleGroup,
  MuscleGroupCreate,
  MuscleGroupUpdate,
} from "@/types";

const endpoint = "/admin/catalog/muscle-groups";

export const muscleGroupService = createService<MuscleGroup, MuscleGroupCreate, MuscleGroupUpdate>(endpoint);
