<template>
  <div class="register-wrapper">
    <h1 class="page-title">新規登録</h1>

    <!-- 登録フォーム -->
    <section class="card register-card">
      <h2 class="title green">アカウントを作成する</h2>
      <p class="desc">メールアドレスとパスワードを入力してください</p>
      <form @submit.prevent="onRegister" class="form">
        <label for="name">ユーザー名</label>
        <input v-model="form.name" id="name" type="text" required :disabled="isSubmitting" />

        <label for="email">メールアドレス</label>
        <input v-model="form.email" id="email" type="email" required :disabled="isSubmitting" />

        <label for="password">パスワード</label>
        <input v-model="form.password" id="password" type="password" required :disabled="isSubmitting" />

        <label for="confirm">パスワード（再入力）</label>
        <input v-model="form.password_confirmation" id="confirm" type="password" required :disabled="isSubmitting" />

        <!-- 送信中は非活性＋文言切替 -->
        <button type="submit" class="btn register-button" :disabled="isSubmitting">
          {{ isSubmitting ? '新規登録中...' : '新規登録' }}
        </button>
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
import { reactive, ref } from 'vue'
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

const isSubmitting = ref(false)

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

const REGISTER_TIMEOUT_MS = 15000 // 15秒

const onRegister = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    await withTimeout(auth.register(form), REGISTER_TIMEOUT_MS)
    router.push('/dashboard')
  } catch (e: any) {
    if (e?.message === 'timeout') {
      alert('登録処理がタイムアウトしました。通信状況を確認して、もう一度お試しください。')
    } else {
      alert('登録に失敗しました')
    }
  } finally {
    isSubmitting.value = false
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
  white-space: nowrap; 
  min-width: 168px;
}

.register-button:hover {
  background: #2bbd5f;
}

/* 非活性時の色変更 */
.register-button:disabled {
  background: #9ee8b0; /* 薄い緑 */
  cursor: not-allowed;
}
.register-button:disabled:hover {
  background: #9ee8b0;
}

.login-button {
  background: #59aaff;
  color: white;
  text-decoration: none;
  display: inline-block;
  margin-top: 12px;
  white-space: nowrap; 
}

.login-button:hover {
  background: #1c8cff;
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
