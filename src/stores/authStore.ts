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
      // ✅ CSRFトークン取得
      const csrf = await api.get('/sanctum/csrf-cookie')
      console.log('✅ CSRF取得:', csrf.status)
  
      // ✅ Cookie確認ログ
      console.log('📦 document.cookie:', document.cookie)
      console.log('🍪 js-cookie:', Cookies.get('XSRF-TOKEN'))
  
      // ✅ ログインリクエスト送信
      const res = await api.post('/login', form)
      console.log('✅ ログイン成功', res)
  
      // ✅ ログイン後のユーザー取得
      const userRes = await api.get('/user')
      user.value = userRes.data
      console.log('👤 ユーザー情報取得', user.value)
  
    } catch (err: any) {
      console.error('❌ ログイン失敗:', err.response?.data || err.message || err)
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
