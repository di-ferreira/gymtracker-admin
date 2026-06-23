"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:8001/api/v1";

export interface MediaUploadResponse {
  url: string;
  filename: string;
  type: string;
}

export async function uploadMediaAction(
  formData: FormData,
): Promise<MediaUploadResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("gymtracker_token")?.value;

  const res = await fetch(`${API_URL}/admin/media/upload?folder=exercises`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Erro ao enviar mídia");
  }

  return res.json();
}
