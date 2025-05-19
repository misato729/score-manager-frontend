<template>
  <div class="register-wrapper">
    <h1 class="page-title">新規登録</h1>

    <!-- 登録フォーム -->
    <section class="card register-card">
      <h2 class="title green">アカウントを作成する</h2>
      <p class="desc">メールアドレスとパスワードを入力してください</p>
      <form @submit.prevent="onRegister" class="form">
        <label for="name">ユーザー名</label>
        <input v-model="form.name" id="name" type="text" required />

        <label for="email">メールアドレス</label>
        <input v-model="form.email" id="email" type="email" required />

        <label for="password">パスワード</label>
        <input v-model="form.password" id="password" type="password" required />

        <label for="confirm">パスワード（再入力）</label>
        <input v-model="form.password_confirmation" id="confirm" type="password" required />

        <button type="submit" class="btn register-button">新規登録</button>
      </form>
    </section>

    <!-- ログインへの案内 -->
    <section class="card login-guide">
      <h2 class="title purple">アカウントを既にお持ちの場合</h2>
      <p>以下のリンクからログインしてください</p>
      <RouterLink to="/login" class="btn login-button">ログイン</RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const onRegister = async () => {
  try {
    await auth.register(form)
    router.push('/dashboard')
  } catch (e) {
    alert('登録に失敗しました')
  }
}
</script>

<style>
.register-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff, #ffece6, #e8fff2);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  padding: 24px;
}

.title {
  font-size: 1.3rem;
  font-weight: bold;
  border-left: 8px solid #a48be0;
  padding-left: 12px;
  margin-bottom: 12px;
}

.title.green {
  border-left-color: #58d879;
}

.desc {
  margin-bottom: 16px;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 12px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  box-sizing: border-box; 
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}


.btn {
  display: inline-block;
  padding: 16px 24px;  
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.1rem;   
}


.register-button {
  background: #58d879;
  color: white;
  border: none;
}

.register-button:hover {
  background: #2bbd5f;
}

.login-button {
  background: #59aaff;
  color: white;
  text-decoration: none;
  display: inline-block;
  margin-top: 12px;
}

.login-button:hover {
  background: #1c8cff;
}
</style>
