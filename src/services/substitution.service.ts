import api from "@/lib/api";
import type { ApiResponse } from "@/types";

const endpoint = "/admin/catalog/exercises";

export interface AlternativeResponse {
  id: string;
  exercise_id: string;
  alternative_exercise_id: string;
  reason: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlternativeCreate {
  alternative_exercise_id: string;
  reason?: string | null;
  note?: string | null;
}

export const substitutionService = {
  list: (exerciseId: string) =>
    api.get<AlternativeResponse[]>(`${endpoint}/${exerciseId}/alternatives/`).then((r) => r.data),

  create: (exerciseId: string, data: AlternativeCreate) =>
    api.post<AlternativeResponse>(`${endpoint}/${exerciseId}/alternatives/`, data).then((r) => r.data),

  remove: (exerciseId: string, alternativeId: string) =>
    api.delete(`${endpoint}/${exerciseId}/alternatives/${alternativeId}`).then(() => undefined),
};
