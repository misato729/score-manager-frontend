// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://api.rbplus-rank-manager.site"
    : "http://localhost:8000",
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

// ★ ここで必ず X-XSRF-TOKEN を付与
api.interceptors.request.use((config) => {
  const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  if (m && config.headers) {
    // Laravel側はURLデコード済み値を期待する
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(m[1]);
  }
  return config;
});

export default api;
