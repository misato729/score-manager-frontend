import axios from 'axios'
import Cookies from 'js-cookie'

// ✅ Axiosインスタンス作成
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
})

// ✅ インターセプターで XSRF-TOKEN を明示的に送信
api.interceptors.request.use((config) => {
  const token = Cookies.get('XSRF-TOKEN')
  if (token && config.headers) {
    config.headers['X-XSRF-TOKEN'] = token
  } else {
    console.warn('⚠️ XSRF-TOKEN not found in cookies')
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default api
