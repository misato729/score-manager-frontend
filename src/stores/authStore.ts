// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import Cookies from 'js-cookie'

interface User {
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const login = async (form: { email: string; password: string; remember?: boolean }) => {
    try {
      // ✅ CSRFトークン取得
      const csrf = await api.get('/sanctum/csrf-cookie')
      if (import.meta.env.DEV) {
        console.log('✅ CSRF取得:', csrf.status)
        console.log('📦 document.cookie:', document.cookie)
        console.log('🍪 js-cookie:', Cookies.get('XSRF-TOKEN'))
      }

      // ✅ ログインリクエスト送信
      const res = await api.post('/login', form)
      if (import.meta.env.DEV) {
        console.log('✅ ログイン成功', res)
      }

      // ✅ ログイン後のユーザー取得
      const userRes = await api.get('/user')
      user.value = userRes.data
      if (import.meta.env.DEV) {
        console.log('👤 ユーザー情報取得', user.value)
      }

    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('❌ ログイン失敗:', err.response?.data || err.message || err)
      }
      user.value = null
      throw err
    }
  }

  const register = async (form: { name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      await api.get('/sanctum/csrf-cookie')
      await api.post('/api/register-user', form)
      await login({ email: form.email, password: form.password })
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('登録失敗:', err.response?.data || err.message)
      }
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
      if (import.meta.env.DEV) {
        console.error('ログアウト失敗:', err.response?.data || err.message)
      }
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

  const getCsrfToken = async () => {
    await api.get('/sanctum/csrf-cookie')
  }

  const clear = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return { user, login, register, logout, fetchUser, getCsrfToken, clear }
})
