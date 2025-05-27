// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

interface User {
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  // ✅ ログイン処理
  const login = async (form: { email: string; password: string; remember?: boolean }) => {
    try {
      await api.get('/sanctum/csrf-cookie') // CSRFトークンを取得
  
      const res = await api.post('/login', {
        email: form.email,
        password: form.password,
        remember: form.remember ?? false,
      })
  
      // ✅ Laravelが返したuser情報を直接使う（ControllerでJSON返している前提）
      user.value = res.data.user
    } catch (err: any) {
      console.error('ログイン失敗:', err.response?.data || err.message)
      user.value = null
      throw err
    }
  }
  

  // ✅ 新規登録処理
const register = async (form: { name: string; email: string; password: string; password_confirmation: string }) => {
  try {
    await api.get('/sanctum/csrf-cookie')
    await api.post('/api/register-user', form)
    await login({ email: form.email, password: form.password })
    const res = await api.get('/user')
    console.log('ログアウト直前のユーザー:', res.data)
    user.value = res.data
  } catch (err: any) {
    console.error('登録失敗:', err.response?.data || err.message)
    console.warn('すでに未認証状態です')
    user.value = null
    throw err
  }
}

  // ✅ ログアウト処理
  const logout = async () => {
    try {
      await api.get('/sanctum/csrf-cookie')
      await api.post('/logout')
      user.value = null
    } catch (err: any) {
      console.error('ログアウト失敗:', err.response?.data || err.message)
      throw err
    }
  }





  const fetchUser = async () => {
    try {
      const res = await api.get('/user') // Laravel Breezeのルート
      user.value = res.data
    } catch (err: any) {
      user.value = null // 未認証時はnullに
    }
  }
  

  return { user, login, register, logout, fetchUser }
})
