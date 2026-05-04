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

const key = import.meta.env.VITE_GOOGLE_API_KEY

app.use(VueGoogleMaps, {
  load: {
    key,
    libraries: 'places',
    v: 'weekly',
    loading: 'async',
  },
})

// ✅ CSRFトークンを取得してからマウント
api.get('/sanctum/csrf-cookie').then(() => {
  app.mount('#app')
})
