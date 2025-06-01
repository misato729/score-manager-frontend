// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import Cookies from 'js-cookie' // ✅ 追加！

interface User {
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const login = async (form: { email: string; password: string; remember?: boolean }) => {
    try {
      // ✅ まずCSRFトークンを取得
      await api.get('/sanctum/csrf-cookie')

      // ✅ Cookie確認ログ（開発用）
      console.log('📦 Cookie:', document.cookie)
      console.log('🍪 XSRF-TOKEN via js-cookie:', Cookies.get('XSRF-TOKEN'))

      // ✅ ログイン処理
      await api.post('/login', form)

      // ✅ ログイン後のユーザー情報取得（Breeze対応）
      const res = await api.get('/user')
      user.value = res.data
    } catch (err: any) {
      console.error('ログイン失敗:', err.response?.data || err.message)
      user.value = null
      throw err
    }
  }

  const register = async (form: { name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      await api.get('/sanctum/csrf-cookie')
      await api.post('/api/register-user', form)
      await login({ email: form.email, password: form.password }) // ← loginに任せる
    } catch (err: any) {
      console.error('登録失敗:', err.response?.data || err.message)
      user.value = null
      throw err
    }
  }

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
      const res = await api.get('/user')
      user.value = res.data
    } catch {
      user.value = null
    }
  }

  return { user, login, register, logout, fetchUser }
})
