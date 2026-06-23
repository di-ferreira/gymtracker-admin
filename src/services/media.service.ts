import api from "@/lib/api";

const endpoint = "/admin/media";

export interface MediaUploadResponse {
  url: string;
  filename: string;
  type: string;
}

export const mediaService = {
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
