import api from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/types";

export interface QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  [key: string]: unknown;
}

export function createService<T, TCreate, TUpdate>(endpoint: string) {
  return {
    list: (params?: QueryParams) =>
      api.get<PaginatedResponse<T>>(`${endpoint}/`, { params }).then((r) => r.data),

    get: (id: string) =>
      api.get<ApiResponse<T>>(`${endpoint}/${id}`).then((r) => r.data),

    create: (data: TCreate) =>
      api.post<ApiResponse<T>>(`${endpoint}/`, data).then((r) => r.data),

    update: (id: string, data: TUpdate) =>
      api.patch<ApiResponse<T>>(`${endpoint}/${id}`, data).then((r) => r.data),

    remove: (id: string) =>
      api.delete(`${endpoint}/${id}`).then(() => undefined),
  };
}
