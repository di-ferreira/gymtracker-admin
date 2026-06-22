import api from "@/lib/api";
import type { AdminUpdateUserRequest, PaginatedResponse, User } from "@/types";
import type { QueryParams } from "./base";

export const userService = {
  list: async (params?: QueryParams) => {
    const res = await api.get<User[]>("/admin/users/", { params });
    return {
      data: res.data ?? [],
      total: Array.isArray(res.data) ? res.data.length : 0,
      page: params?.page ?? 1,
      per_page: params?.per_page ?? 100,
      total_pages: 1,
    } satisfies PaginatedResponse<User>;
  },

  update: (id: string, data: AdminUpdateUserRequest) =>
    api.patch<User>(`/admin/users/${id}`, data).then((r) => r.data),
};
