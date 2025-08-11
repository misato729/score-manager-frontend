// src/api/csrf.ts
import api from "./axios";

let csrfPromise: Promise<void> | null = null;

export async function ensureCsrfCookie(): Promise<void> {
  if (!csrfPromise) {
    csrfPromise = api.get("/sanctum/csrf-cookie").then(() => {});
    try {
      await csrfPromise;
    } finally {
      csrfPromise = null;
    }
  } else {
    await csrfPromise;
  }
}
