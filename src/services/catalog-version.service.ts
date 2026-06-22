import api from "@/lib/api";
import type { CatalogVersion, ApiResponse } from "@/types";

export interface PublishPayload {
  version_major?: number;
  version_minor?: number;
  description?: string;
}

export const catalogVersionService = {
  getCurrent: () =>
    api.get<ApiResponse<CatalogVersion>>("/admin/catalog/version/current").then((r) => r.data),

  list: (params?: { page?: number; per_page?: number }) =>
    api.get("/admin/catalog/version/history", { params }).then((r) => r.data),

  publish: (data: PublishPayload) =>
    api.post<ApiResponse<CatalogVersion>>("/admin/catalog/version/publish", data).then((r) => r.data),
};
