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

function toApiParams(params?: QueryParams): Record<string, unknown> {
  if (!params) return {};
  const apiParams: Record<string, unknown> = {};
  if (params.page && params.per_page) {
    apiParams.skip = (params.page - 1) * params.per_page;
    apiParams.limit = params.per_page;
  }
  if (params.search) apiParams.search = params.search;
  if (params.sort_by) apiParams.order_by = params.sort_by;
  if (params.sort_order) apiParams.order_dir = params.sort_order;
  Object.entries(params).forEach(([k, v]) => {
    if (!["page", "per_page", "search", "sort_by", "sort_order"].includes(k)) {
      apiParams[k] = v;
    }
  });
  return apiParams;
}

export function createService<T, TCreate, TUpdate>(endpoint: string) {
  return {
    list: async (params?: QueryParams) => {
      const res = await api.get<T[]>(`${endpoint}/`, { params: toApiParams(params) });
      return {
        data: res.data ?? [],
        total: Array.isArray(res.data) ? res.data.length : 0,
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 100,
        total_pages: 1,
      } satisfies PaginatedResponse<T>;
    },

    get: (id: string) =>
      api.get<T>(`${endpoint}/${id}`).then((r) => ({ data: r.data }) satisfies ApiResponse<T>),

    create: (data: TCreate) =>
      api.post<T>(`${endpoint}/`, data).then((r) => ({ data: r.data }) satisfies ApiResponse<T>),

    update: (id: string, data: TUpdate) =>
      api.patch<T>(`${endpoint}/${id}`, data).then((r) => ({ data: r.data }) satisfies ApiResponse<T>),

    remove: (id: string) =>
      api.delete(`${endpoint}/${id}`).then(() => undefined),
  };
}
