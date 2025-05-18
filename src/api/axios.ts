// src/api/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000', // Laravel側ができたらここに接続
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export default api
