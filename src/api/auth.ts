// src/api/auth.ts
import api from "./axios";
import { ensureCsrfCookie } from "./csrf";

export type User = {
  id: number;
  name: string;
  email: string;
  // 必要に応じて追記
};

export async function login(email: string, password: string): Promise<User> {
  await ensureCsrfCookie();                 // 1) CSRF
  await api.post("/login", { email, password }); // 2) Webの /login（APIトークンじゃない）
  const { data } = await api.get<User>("/api/user"); // 3) ログイン確認
  return data;
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await api.get<User>("/api/user");
    return data;
  } catch (e: any) {
    if (e?.response?.status === 401) return null; // 未ログイン
    throw e;
  }
}

export async function logout(): Promise<void> {
  await api.post("/api/logout");
}
