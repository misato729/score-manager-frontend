import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// CSRFクッキー取得（初回のみ必要）
api.get('/sanctum/csrf-cookie')

api.interceptors.request.use((config) => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  if (match && config.headers) {
    const token = decodeURIComponent(match[1])
    config.headers['X-XSRF-TOKEN'] = token
  }
  return config
})

export default api
