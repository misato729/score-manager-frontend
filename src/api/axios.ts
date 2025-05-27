import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

api.interceptors.request.use((config) => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  if (match && config.headers) {
    const token = decodeURIComponent(match[1])
    config.headers['X-XSRF-TOKEN'] = token
  }
  return config
})

export default api
