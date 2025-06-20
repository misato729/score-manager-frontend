import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import api from '@/api/axios'
import './assets/style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(VueGoogleMaps, {
  load: {
    key: import.meta.env.VITE_GOOGLE_API_KEY, 
    libraries: 'places',
    v: 'weekly',
    loading: 'async',
  },
})

// ✅ 開発時のみ確認ログを出す
  console.log('✅ VITE_GOOGLE_API_KEY:', import.meta.env.VITE_GOOGLE_API_KEY)

// ✅ CSRFトークンを取得してからマウント
api.get('/sanctum/csrf-cookie').then(() => {
  app.mount('#app')
})
