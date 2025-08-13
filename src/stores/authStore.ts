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

// 中断できるタイムアウトヘルパー（AbortController使用）
async function withAbortableTimeout<T>(
  runner: (signal: AbortSignal) => Promise<T>,
  ms: number
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    return await runner(controller.signal)
  } finally {
    clearTimeout(timer)
  }
}

const DEFAULT_TIMEOUT = 15000 // 15秒

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const login = async (form: { email: string; password: string; remember?: boolean }) => {
    try {
      const userData = await withAbortableTimeout(
        (signal) => loginApi(form, { signal }),
        DEFAULT_TIMEOUT
      )
      // 念のため payload 確認（204対策の二重安全策）
      if (!userData?.id) {
        // 空レス対策：ログイン自体は成功している可能性があるので fetch で再確認
        const me = await withAbortableTimeout((signal) => fetchUserApi({ signal }), DEFAULT_TIMEOUT)
        if (!me?.id) throw new Error('no_user_payload')
        user.value = me
        return me
      }
      user.value = userData
      return userData
    } catch (err: any) {
      console.error('❌ ログイン失敗:', err?.name || err?.message || err)
      user.value = null
      // UI側でタイムアウト文言を出し分けできるよう、エラーはそのまま投げる
      throw err
    }
  }

  const isLoggedIn = computed(() => user.value !== null)

  const register = async (form: { name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      const userData = await withAbortableTimeout(
        (signal) => registerApi(form, { signal }),
        DEFAULT_TIMEOUT
      )
      user.value = userData
    } catch (err) {
      console.error('登録失敗:', err)
      user.value = null
      throw err
    }
  }

  const logout = async () => {
    try {
      await withAbortableTimeout((signal) => logoutApi({ signal }), DEFAULT_TIMEOUT)
      user.value = null
    } catch (err) {
      console.error('ログアウト失敗:', err)
      throw err
    }
  }

  const fetchUser = async () => {
    try {
      const me = await withAbortableTimeout(
        (signal) => fetchUserApi({ signal }),
        DEFAULT_TIMEOUT
      )
      user.value = me
    } catch {
      user.value = null
    }
  }

  const clear = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  // getCsrfToken も外側から呼ぶ想定があるならそのまま公開
  return { user, login, isLoggedIn, register, logout, fetchUser, getCsrfToken, clear }
})
