import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const status = error.response?.status;
    const messages: Record<number, string> = {
      400: "Dados inválidos. Verifique os campos e tente novamente.",
      401: "Sessão expirada. Faça login novamente.",
      403: "Acesso negado.",
      404: "Recurso não encontrado.",
      409: "Conflito. O recurso já existe.",
      422: "Dados inválidos. Verifique os campos.",
      429: "Muitas requisições. Aguarde e tente novamente.",
      500: "Erro interno do servidor. Tente novamente mais tarde.",
    };

    if (status === 401) {
      localStorage.removeItem("access_token");
    }

    if (status && status !== 401) {
      const message = error.response?.data?.detail ?? messages[status] ?? "Erro inesperado.";
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
