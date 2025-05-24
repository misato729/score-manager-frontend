// src/stores/authStore.ts（仮）
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<{ name: string } | null>(null)
    // 仮ログイン
    user.value = { name: 'テスト太郎' };
    

  const login = async (form: { email: string; password: string }) => {
    // Laravel完成後にaxios.post('/login') に差し替え
    user.value = { name: 'Test User', email: form.email }
  }

  const register = async (form: any) => {
    // Laravel完成後にaxios.post('/register') に差し替え
    user.value = { name: form.name, email: form.email }
  }
  const logout = async () => {
    user.value = null
  }
  

  return { user, login, register, logout }
})

