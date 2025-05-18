<template>
    <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 class="text-xl font-bold mb-4">ログイン</h2>
      <form @submit.prevent="onLogin" class="space-y-4">
        <input v-model="form.email" type="email" placeholder="メールアドレス" class="w-full border p-2 rounded" />
        <input v-model="form.password" type="password" placeholder="パスワード" class="w-full border p-2 rounded" />
        <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded">ログイン</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { reactive } from 'vue'
  import { useAuthStore } from '@/stores/authStore'
  
  const auth = useAuthStore()
  const router = useRouter()
  
  const form = reactive({
    email: '',
    password: '',
  })
  
  const onLogin = async () => {
    await auth.login(form)
    router.push('/dashboard')
  }
  </script>
  