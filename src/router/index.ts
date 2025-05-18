// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Top from '@/views/Top.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Dashboard from '@/views/Dashboard.vue';

const routes = [
  { path: '/', component: Top },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
