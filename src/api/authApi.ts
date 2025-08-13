import api from '@/api/axios'
import Cookies from 'js-cookie'

const USER_ME_ENDPOINT = '/api/user' // ← 統一

export const getCsrfToken = async () => {
  await api.get('/sanctum/csrf-cookie')
  if (import.meta.env.DEV) {
    console.log('✅ CSRF取得:', document.cookie)
    console.log('🍪 js-cookie:', Cookies.get('XSRF-TOKEN'))
  }
}

export const loginApi = async (form: { email: string; password: string }) => {
  await getCsrfToken()
  await api.post('/api/login', form)              // ← /api/login に統一
  const res = await api.get(USER_ME_ENDPOINT)     // ← /api/user に統一
  return res.data
}

export const registerApi = async (form: { name: string; email: string; password: string; password_confirmation: string }) => {
  await getCsrfToken()
  await api.post('/api/register-user', form)      // 既存のAPIを継続使用
  return await loginApi({ email: form.email, password: form.password })
}

export const logoutApi = async () => {
  await getCsrfToken()
  await api.post('/api/logout')                   // ← /api/logout に統一
}

export const fetchUserApi = async () => {
  const res = await api.get(USER_ME_ENDPOINT)     // ← /api/user に統一
  return res.data
}
