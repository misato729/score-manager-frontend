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
    key: 'AIzaSyDiNJLDZz_STC2tqG-14imShfnkPGgcKp4',
    libraries: 'places',
    v: 'weekly',
    loading: 'async',
  },
})

// ✅ CSRFトークンを取得してからマウント
api.get('/sanctum/csrf-cookie').then(() => {
  app.mount('#app')
})
