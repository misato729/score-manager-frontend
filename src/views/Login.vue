<template>
  <div class="login-wrapper">
    <h1 class="page-title">ログイン</h1>

    <!-- ログインフォーム -->
    <section class="card login-card">
      <h2 class="title purple">ログイン</h2>
      <p class="desc">メールアドレスとパスワードを入力してください</p>
      <form @submit.prevent="onLogin" class="form">
        <label for="email">メールアドレス</label>
        <input v-model="form.email" id="email" type="email" required :disabled="isSubmitting" />

        <label for="password">パスワード</label>
        <input v-model="form.password" id="password" type="password" required :disabled="isSubmitting" />

        <label>
          <input type="checkbox" v-model="form.remember" :disabled="isSubmitting" />
          ログイン状態を保持する
        </label>

        <!-- 送信中は非活性＋文言切替 -->
        <button type="submit" class="btn login-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'ログイン中...' : 'ログイン' }}
        </button>
      </form>
      <p id="caution">メールアドレス: test@example.com、パスワード: password でログイン後の仕様を体験できます。アカウントは削除しないでください。</p>
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
import { reactive, ref } from 'vue'
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

const isSubmitting = ref(false)

// タイムアウトヘルパー
const withTimeout = <T,>(p: Promise<T>, ms: number) => {
  return Promise.race<T>([
    p,
    new Promise<T>((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id)
        reject(new Error('timeout'))
      }, ms)
    }),
  ])
}

const LOGIN_TIMEOUT_MS = 15000 // 15秒

const onLogin = async () => {
  if (isSubmitting.value) return // 二重クリック防止
  isSubmitting.value = true
  try {
    // CSRFトークン取得（タイムアウト付き）
    await withTimeout(auth.getCsrfToken(), LOGIN_TIMEOUT_MS)

    console.log('📦 Cookie:', document.cookie)
    console.log('🍪 XSRF-TOKEN via js-cookie:', Cookies.get('XSRF-TOKEN'))

    // ログイン実行（タイムアウト付き）
    const user = await withTimeout(auth.login(form), LOGIN_TIMEOUT_MS)
    router.push(`/dashboard?user=${user.id}`)
  } catch (e: any) {
    if (e?.message === 'timeout') {
      alert('ログイン処理がタイムアウトしました。通信状況を確認して、もう一度お試しください。')
    } else {
      alert('ログインに失敗しました')
    }
  } finally {
    isSubmitting.value = false
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
  white-space: nowrap;
  min-width: 168px;
}

.login-button:hover {
  background: #1c8cff;
}

/* 非活性時の色変更 */
.login-button:disabled {
  background: #9ccfff; /* 薄い青 */
  cursor: not-allowed;
}
.login-button:disabled:hover {
  background: #9ccfff; /* ホバー色固定 */
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

#caution {
  font-size: 0.8rem;
}
</style>
