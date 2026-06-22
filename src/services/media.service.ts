import api from "@/lib/api";

const endpoint = "/admin/catalog/media";

export interface MediaItem {
  id: string;
  url: string;
  type: "THUMBNAIL" | "IMAGE" | "GIF" | "VIDEO";
  filename: string;
  created_at: string;
}

export interface MediaUploadResponse {
  url: string;
  filename: string;
  type: string;
}

export const mediaService = {
  list: (params?: { type?: string; page?: number; per_page?: number }) =>
    api.get(`${endpoint}/`, { params }).then((r) => r.data),

  upload: async (file: File, type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    return api
      .post<MediaUploadResponse>(`${endpoint}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  remove: (id: string) =>
    api.delete(`${endpoint}/${id}`).then(() => undefined),
};
