"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { loginAction, meAction, logoutAction } from "@/actions/auth.actions";
import { encryptPassword } from "@/lib/crypto";
import { setToken } from "@/lib/token-store";
import type { User } from "@/types";

interface LoginParams {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginParams) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await logoutAction();
    } catch {
      // best effort
    }
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    meAction()
      .then((u) => {
        if (!u) {
          setIsLoading(false);
          return;
        }
        if (u.role !== "admin") {
          logoutAction().catch(() => {});
          setIsLoading(false);
          return;
        }
        setUser(u);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (data: LoginParams) => {
    const encryptedPassword = await encryptPassword(data.password);
    const { token } = await loginAction(data.email, encryptedPassword);
    setToken(token);

    const u = await meAction();
    if (!u || u.role !== "admin") {
      setToken(null);
      await logoutAction().catch(() => {});
      throw new Error("Acesso restrito a administradores.");
    }

    setUser(u);
  }, []);

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
