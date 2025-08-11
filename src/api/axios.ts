// src/api/axios.ts
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://localhost:8000" : "https://api.rbplus-rank-manager.site");

const api = axios.create({
  baseURL,                  // 例: https://api.rbplus-rank-manager.site
  withCredentials: true,    // Cookie送受信に必須
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

export default api;
