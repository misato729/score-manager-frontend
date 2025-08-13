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
import type { User } from '@/api/authApi'

// 非中断のシンプルなタイムアウト（15秒）
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race<T>([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ])
}
const DEFAULT_TIMEOUT = 15000

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => user.value !== null)

  const login = async (form: { email: string; password: string; remember?: boolean }) => {
    try {
      const userData = await withTimeout(loginApi(form), DEFAULT_TIMEOUT)
      // 念のため payload 確認（環境によっては空レス→直後に取得）
      if (!userData?.id) {
        const me = await withTimeout(fetchUserApi(), DEFAULT_TIMEOUT)
        if (!me?.id) throw new Error('no_user_payload')
        user.value = me
        return me
      }
      user.value = userData
      return userData
    } catch (err: any) {
      console.error('❌ ログイン失敗:', err?.name || err?.message || err)
      user.value = null
      throw err
    }
  }

  const register = async (form: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    try {
      const userData = await withTimeout(registerApi(form), DEFAULT_TIMEOUT)
      user.value = userData
    } catch (err) {
      console.error('登録失敗:', err)
      user.value = null
      throw err
    }
  }

  const logout = async () => {
    try {
      await withTimeout(logoutApi(), DEFAULT_TIMEOUT)
      user.value = null
    } catch (err) {
      console.error('ログアウト失敗:', err)
      throw err
    }
  }

  const fetchUser = async () => {
    try {
      const me = await withTimeout(fetchUserApi(), DEFAULT_TIMEOUT)
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

  // アプリ起動時の復元用（任意）
  const init = async () => {
    await fetchUser()
  }

  return { user, isLoggedIn, login, register, logout, fetchUser, getCsrfToken, clear, init }
})
