import api from "@/lib/api";

const endpoint = "/admin/media";

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
    api.get(`${endpoint}/`).then((r) => r.data),

  upload: async (file: File, _type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return api
      .post<MediaUploadResponse>(`${endpoint}/upload`, formData, {
        params: { folder: "exercises" },
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  remove: (folder: string, filename: string) =>
    api.delete(`${endpoint}/${folder}/${filename}`).then(() => undefined),
};
