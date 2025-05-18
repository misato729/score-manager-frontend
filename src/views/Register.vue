<template>
    <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 class="text-xl font-bold mb-4">新規登録</h2>
      <form @submit.prevent="onRegister" class="space-y-4">
        <input v-model="form.name" type="text" placeholder="ユーザー名" class="w-full border p-2 rounded" />
        <input v-model="form.email" type="email" placeholder="メールアドレス" class="w-full border p-2 rounded" />
        <input v-model="form.password" type="password" placeholder="パスワード" class="w-full border p-2 rounded" />
        <input v-model="form.password_confirmation" type="password" placeholder="パスワード再入力" class="w-full border p-2 rounded" />
        <button type="submit" class="w-full bg-green-600 text-white p-2 rounded">登録</button>
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
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  
  const onRegister = async () => {
    await auth.register(form)
    router.push('/dashboard')
  }
  </script>
  