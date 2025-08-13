// src/api/authApi.ts
import api from '@/api/axios'

const USER_ME_ENDPOINT = '/api/user' // ← /api に統一

export const getCsrfToken = async (): Promise<void> => {
  await api.get('/sanctum/csrf-cookie')
  if (import.meta.env.DEV) {
    // 確認用ログ（本番では消してOK）
    console.log('✅ CSRF cookie fetched')
  }
}

export type User = {
  id: number
  name: string
  email: string
}

/** ログイン → /api/user でユーザー取得（Cookie方式） */
export const loginApi = async (
  form: { email: string; password: string }
): Promise<User> => {
  await getCsrfToken()
  await api.post('/api/login', form)               // /api/login に統一
  const res = await api.get<User>(USER_ME_ENDPOINT) // /api/user に統一
  return res.data
}

/** 登録 → そのままログインしてユーザー返す */
export const registerApi = async (form: {
  name: string
  email: string
  password: string
  password_confirmation: string
}): Promise<User> => {
  await getCsrfToken()
  await api.post('/api/register-user', form)       // 既存のAPIを継続使用
  return await loginApi({ email: form.email, password: form.password })
}

/** ログアウト（API側の /api/logout を叩く） */
export const logoutApi = async (): Promise<void> => {
  await getCsrfToken()
  await api.post('/api/logout')                    // /api/logout に統一
}

/** 既存セッション確認用 */
export const fetchUserApi = async (): Promise<User> => {
  const res = await api.get<User>(USER_ME_ENDPOINT) // /api/user に統一
  return res.data
}
