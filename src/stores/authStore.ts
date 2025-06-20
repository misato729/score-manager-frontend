// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  loginApi,
  registerApi,
  logoutApi,
  fetchUserApi,
  getCsrfToken,
} from '@/api/authApi'
import type { User } from '@/types'



export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const login = async (form: { email: string; password: string; remember?: boolean }) => {
    try {
      const userData = await loginApi(form)
      user.value = userData
      return userData
    } catch (err) {
      console.error('❌ ログイン失敗:', err)
      user.value = null
      throw err
    }
  }

  const isLoggedIn = computed(() => user.value !== null)


  const register = async (form: { name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      const userData = await registerApi(form)
      user.value = userData
    } catch (err) {
      console.error('登録失敗:', err)
      user.value = null
      throw err
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
      user.value = null
    } catch (err) {
      console.error('ログアウト失敗:', err)
      throw err
    }
  }

  const fetchUser = async () => {
    try {
      user.value = await fetchUserApi()
    } catch {
      user.value = null
    }
  }

  const clear = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return { user, login, isLoggedIn, register, logout, fetchUser, getCsrfToken, clear }
})
