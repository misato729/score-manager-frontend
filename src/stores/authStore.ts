// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  loginApi,
  registerApi,
  logoutApi,
  fetchUserApi,
  getCsrfToken, // 必要なら残す
} from '@/api/authApi'
import type { User } from '@/api/authApi' // ← typesのUserと重複するなら統一

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => user.value !== null)

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

  const register = async (form: { name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      const userData = await registerApi(form) // ここは構成次第で null の可能性あり
      user.value = userData ?? null
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
      const me = await fetchUserApi() // 未ログインなら 401
      user.value = me
    } catch (e: any) {
      if (e?.response?.status === 401) {
        user.value = null
      } else {
        throw e
      }
    }
  }

  const clear = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  // 初期化用（アプリ起動時などに呼ぶ）
  const init = async () => {
    await fetchUser() // 既存セッションがあれば user を復元
  }

  return { user, isLoggedIn, login, register, logout, fetchUser, getCsrfToken, clear, init }
})
