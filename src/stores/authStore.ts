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

  const login = async (form: { email: string; password: string; remember?: boolean }) => {
    try {
      await api.get('https://score-manager-backend.onrender.com/sanctum/csrf-cookie', { withCredentials: true })
      console.log('cookie after fetch:', document.cookie)      
      await api.post('/login', form)
      const res = await api.get('/user') // ← Breeze対応
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
