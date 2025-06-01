<template>
  <div class="login-wrapper">
    <h1 class="page-title">ログイン</h1>

    <!-- ログインフォーム -->
    <section class="card login-card">
      <h2 class="title purple">ログイン</h2>
      <p class="desc">メールアドレスとパスワードを入力してください</p>
      <form @submit.prevent="onLogin" class="form">
        <label for="email">メールアドレス</label>
        <input v-model="form.email" id="email" type="email" required />

        <label for="password">パスワード</label>
        <input v-model="form.password" id="password" type="password" required />

        <label>
          <input type="checkbox" v-model="form.remember" />
          ログイン状態を保持する
        </label>

        <button type="submit" class="btn login-button">ログイン</button>
      </form>
      <p>ID:test@example.com| PW: password でログイン後の使用感を体験してもかまいません。</p>
    </section>

    <!-- 新規登録への案内 -->
    <section class="card register-guide">
      <h2 class="title purple">アカウントをお持ちでない場合</h2>
      <p>以下のリンクから新規登録をしてください</p>
      <RouterLink to="/register" class="btn register-button">新規登録</RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Cookies from 'js-cookie'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  remember: true,
})

const onLogin = async () => {
  try {
    // ✅ csrf-cookieを叩いてからCookie確認
    await auth.getCsrfToken()

    console.log('📦 Cookie:', document.cookie)
    console.log('🍪 XSRF-TOKEN via js-cookie:', Cookies.get('XSRF-TOKEN'))

    await auth.login(form)
    const userId = auth.user?.id
    router.push(userId ? `/dashboard?user=${userId}` : '/')
  } catch (e) {
    alert('ログインに失敗しました')
  }
}

</script>


<style>
.login-wrapper {
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

input[type="email"],
input[type="password"] {
  width: 100%;
  box-sizing: border-box; 
  padding: 8px;
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

.login-button {
  background: #59aaff;
  color: white;
  border: none;
}

.login-button:hover {
  background: #1c8cff;
}

.register-button {
  background: #58d879;
  color: white;
  text-decoration: none;
  display: inline-block;
  margin-top: 12px;
}

.register-button:hover {
  background: #2bbd5f;
}
</style>

<style scoped>
.title {
  font-size: 1.3rem;
  font-weight: bold;
  border-left: 8px solid #a48be0;
  padding-left: 12px;
  margin-bottom: 12px;
}
</style>