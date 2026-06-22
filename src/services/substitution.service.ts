import api from "@/lib/api";

const endpoint = "/admin/catalog/exercise-alternatives";

export interface Substitution {
  id: string;
  exercise_id: string;
  alternative_exercise_id: string;
  reason: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubstitutionCreate {
  exercise_id: string;
  alternative_exercise_id: string;
  reason?: string | null;
  note?: string | null;
}

export const substitutionService = {
  list: (params?: { exercise_id?: string }) =>
    api.get(`${endpoint}/`, { params }).then((r) => r.data),

  create: (data: SubstitutionCreate) =>
    api.post(`${endpoint}/`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`${endpoint}/${id}`).then(() => undefined),
};
