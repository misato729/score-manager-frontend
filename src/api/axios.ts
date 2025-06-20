// src/api/axios.ts
import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL:'https://api.rbplus-rank-manager.site', // import.meta.env.VITE_API_URL,127.0.0.1:8000 だと動かない
  // 開発用：http://localhost:8000
  // 本番用：https://api.rbplus-rank-manager.site
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
})

// ✅ インターセプターで XSRF-TOKEN を常に送信（開発環境のみログ出力）
api.interceptors.request.use((config) => {
  // fallback: document.cookie から取得
  const cookieMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  const token = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null

  if (token && config.headers) {
    config.headers['X-XSRF-TOKEN'] = token
    if (import.meta.env.DEV) {
      console.log('✅ X-XSRF-TOKEN sent:', token)
    }
  } else {
    if (import.meta.env.DEV) {
      console.warn('⚠️ XSRF-TOKEN not found or unreadable')
    }
  }

  return config
})


export default api
