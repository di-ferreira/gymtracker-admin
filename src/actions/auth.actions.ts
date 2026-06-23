"use server";

import { cookies } from "next/headers";
import { decryptPassword } from "@/lib/crypto";

const API_URL = process.env.API_URL ?? "http://localhost:8001/api/v1";

export async function loginAction(
  email: string,
  encryptedPassword: string,
): Promise<{ token: string }> {
  const privateKeyPem = process.env.ENCRYPTION_PRIVATE_KEY;
  if (!privateKeyPem) {
    throw new Error("ENCRYPTION_PRIVATE_KEY não configurada");
  }

  const password = await decryptPassword(encryptedPassword, privateKeyPem);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let detail = "Credenciais inválidas";
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }

  const data = await res.json();
  const token: string = data.access_token;

  const cookieStore = await cookies();
  cookieStore.set("gymtracker_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return { token };
}

export async function meAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gymtracker_token")?.value;
  if (!token) {
    return null;
  }

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    cookieStore.delete("gymtracker_token");
    return null;
  }

  return res.json();
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("gymtracker_token");
}
