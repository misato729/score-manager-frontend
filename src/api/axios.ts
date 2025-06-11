// src/api/axios.ts
import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: 'https://api.rbplus-rank-manager.site',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
})

// ✅ インターセプターで XSRF-TOKEN を常に送信（開発環境のみログ出力）
api.interceptors.request.use((config) => {
  const token = Cookies.get('XSRF-TOKEN')

  if (token && config.headers) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
    
    if (import.meta.env.DEV) {
      console.log('✅ X-XSRF-TOKEN sent:', config.headers['X-XSRF-TOKEN'])
    }
  } else {
    if (import.meta.env.DEV) {
      console.warn('⚠️ XSRF-TOKEN not found or unreadable')
    }
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

export default api
