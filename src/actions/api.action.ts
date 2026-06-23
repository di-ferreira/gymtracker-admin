"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:8001/api/v1";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gymtracker_token")?.value;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = "Erro na requisição";
    try {
      const body = await res.json();
      detail = body.detail ?? body.message ?? JSON.stringify(body);
    } catch {
      detail = res.statusText || detail;
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v));
      }
    });
  }
  const res = await fetch(url.toString(), {
    headers: await getAuthHeaders(),
  });
  return handleResponse<T>(res);
}

export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
  return handleResponse<T>(res);
}

export async function apiPatch<T>(
  endpoint: string,
  data?: unknown,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
  return handleResponse<T>(res);
}

export async function apiDelete(endpoint: string): Promise<void> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });
  if (!res.ok) {
    let detail = "Erro ao excluir";
    try {
      const body = await res.json();
      detail = body.detail ?? body.message ?? JSON.stringify(body);
    } catch {
      detail = res.statusText || detail;
    }
    throw new Error(detail);
  }
}

import type { ApiResponse, PaginatedResponse } from "@/types";

export async function apiList<T>(
  endpoint: string,
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<T>> {
  const data = await apiGet<T[]>(endpoint, params);
  return {
    data: data ?? [],
    total: Array.isArray(data) ? (data as T[]).length : 0,
    page: (params?.page as number) ?? 1,
    per_page: (params?.per_page as number) ?? 100,
    total_pages: 1,
  };
}

export async function apiGetOne<T>(endpoint: string): Promise<ApiResponse<T>> {
  const data = await apiGet<T>(endpoint);
  return { data };
}

export async function apiCreateOne<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  const data = await apiPost<T>(endpoint, body);
  return { data };
}

export async function apiUpdateOne<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  const data = await apiPatch<T>(endpoint, body);
  return { data };
}

export async function apiRemoveOne(endpoint: string): Promise<void> {
  await apiDelete(endpoint);
}
