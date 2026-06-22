import { createService } from "./base";
import type {
  Exercise,
  ExerciseCreate,
  ExerciseUpdate,
  ExerciseEquipment,
} from "@/types";
import api from "@/lib/api";

const endpoint = "/admin/catalog/exercises";

export const exerciseService = {
  ...createService<Exercise, ExerciseCreate, ExerciseUpdate>(endpoint),

  getAlternatives: (id: string) =>
    api.get(`${endpoint}/${id}/alternatives`).then((r) => r.data),

  addEquipment: (exerciseId: string, data: ExerciseEquipment) =>
    api.post(`${endpoint}/${exerciseId}/equipment`, data).then((r) => r.data),

  removeEquipment: (exerciseId: string, equipmentId: string) =>
    api.delete(`${endpoint}/${exerciseId}/equipment/${equipmentId}`).then(() => undefined),
};
