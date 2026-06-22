import type { LoginRequest, TokenResponse, User } from "@/types";
import api from "@/lib/api";

export const authService = {
  login: (data: LoginRequest) =>
    api.post<TokenResponse>("/auth/login", data).then((r) => r.data),

  me: () => api.get<User>("/auth/me").then((r) => r.data),
};
