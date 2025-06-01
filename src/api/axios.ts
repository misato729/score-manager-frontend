import axios from 'axios'
import Cookies from 'js-cookie' // ← 追加

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// ✅ インターセプターでXSRFトークンを明示的に付与
api.interceptors.request.use((config) => {
  const xsrfToken = Cookies.get('XSRF-TOKEN') // ← 自動でdecodeしてくれる
  if (xsrfToken && config.headers) {
    config.headers['X-XSRF-TOKEN'] = xsrfToken
  } else {
    console.warn('⚠️ XSRF-TOKEN not found in cookies')
  }
  return config
})

export default api
