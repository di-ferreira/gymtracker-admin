"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authService } from "@/services/auth.service";
import type { User, LoginRequest } from "@/types";

const TOKEN_KEY = "gymtracker_token";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    Cookies.remove(TOKEN_KEY);
    setUser(null);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    authService
      .me()
      .then((u) => {
        if (u.role !== "admin") {
          logout();
          return;
        }
        setUser(u);
      })
      .catch(() => {
        Cookies.remove(TOKEN_KEY);
      })
      .finally(() => setIsLoading(false));
  }, [logout]);

  const login = useCallback(
    async (data: LoginRequest) => {
      const { access_token } = await authService.login(data);
      Cookies.set(TOKEN_KEY, access_token, { path: "/", sameSite: "lax" });

      const u = await authService.me();
      if (u.role !== "admin") {
        Cookies.remove(TOKEN_KEY);
        throw new Error("Acesso restrito a administradores.");
      }

      setUser(u);
    },
    [],
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
