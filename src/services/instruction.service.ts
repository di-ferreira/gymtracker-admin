import api from "@/lib/api";
import type { ExerciseInstruction, InstructionCreate, InstructionUpdate } from "@/types";

const endpoint = "/admin/catalog/exercises";

export const instructionService = {
  list: (exerciseId: string) =>
    api.get<ExerciseInstruction[]>(`${endpoint}/${exerciseId}/instructions/`).then((r) => r.data),

  create: (exerciseId: string, data: InstructionCreate) =>
    api.post<ExerciseInstruction>(`${endpoint}/${exerciseId}/instructions/`, data).then((r) => r.data),

  update: (exerciseId: string, instructionId: string, data: InstructionUpdate) =>
    api.patch<ExerciseInstruction>(`${endpoint}/${exerciseId}/instructions/${instructionId}`, data).then((r) => r.data),

  remove: (exerciseId: string, instructionId: string) =>
    api.delete(`${endpoint}/${exerciseId}/instructions/${instructionId}`).then(() => undefined),
};
