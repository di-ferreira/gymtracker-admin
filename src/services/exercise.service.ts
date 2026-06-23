import { createService } from "./base";
import type {
  Exercise,
  ExerciseCreate,
  ExerciseUpdate,
} from "@/types";

const endpoint = "/admin/catalog/exercises";

export const exerciseService = {
  ...createService<Exercise, ExerciseCreate, ExerciseUpdate>(endpoint),
};
