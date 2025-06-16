// src/api/authApi.ts
import api from '@/api/axios'
import Cookies from 'js-cookie'

export const getCsrfToken = async () => {
  await api.get('/sanctum/csrf-cookie')
  if (import.meta.env.DEV) {
    console.log('✅ CSRF取得:', document.cookie)
    console.log('🍪 js-cookie:', Cookies.get('XSRF-TOKEN'))
  }
}

export const loginApi = async (form: { email: string; password: string }) => {
    await getCsrfToken()
    await api.post('/login', form)
    const res = await api.get('/user')
    return res.data // ✅ ← 必ず「res.data」を返すようにする
  }

export const registerApi = async (form: { name: string; email: string; password: string; password_confirmation: string }) => {
  await getCsrfToken()
  await api.post('/api/register-user', form)
  return await loginApi({ email: form.email, password: form.password }) // ログインしてuser情報返す
}

export const logoutApi = async () => {
  await getCsrfToken()
  await api.post('/logout')
}

export const fetchUserApi = async () => {
  const res = await api.get('/user')
  return res.data
}
