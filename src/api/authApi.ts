// src/api/authApi.ts
import api from '@/api/axios'

/** CSRFを一度だけ取る（多重発火防止は簡易運用。必要なら専用ensure関数に） */
export const getCsrfToken = async () => {
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
export const loginApi = async (form: { email: string; password: string; remember?: boolean }) => {
  await getCsrfToken()
  await api.post('/login', form)                  // ← Web側 /login
  const res = await api.get<User>('/api/user')    // ← ここは /api/user が正解
  return res.data
}

/** 登録 → そのままログインしてユーザー返す（必要に応じて仕様調整） */
export const registerApi = async (form: {
  name: string
  email: string
  password: string
  password_confirmation: string
}) => {
  await getCsrfToken()
  await api.post('/api/register-user', form)      // あなたの既存API
  // すぐにログインさせる運用なら続けてログイン
  return await loginApi({ email: form.email, password: form.password })
}

/** ログアウト（API側の /api/logout を叩く） */
export const logoutApi = async () => {
  await getCsrfToken()
  await api.post('/api/logout')                   // ← /logout ではなく /api/logout
}

/** 既存セッション確認用 */
export const fetchUserApi = async () => {
  const res = await api.get<User>('/api/user')    // ← /api/user
  return res.data
}
