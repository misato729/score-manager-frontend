// src/api/interceptors.ts
import api from "./axios";
import { ensureCsrfCookie } from "./csrf";

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error || {};
    if (!response) throw error;

    // CSRF切れ（419）は一度だけ再送
    if (response.status === 419 && config && !(config as any)._retry) {
      (config as any)._retry = true;
      await ensureCsrfCookie();
      return api(config);
    }
    return Promise.reject(error);
  }
);

// エントリで1回だけ import "@/api/interceptors";
export {};
