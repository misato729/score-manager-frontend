// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Top from '@/views/Top.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Dashboard from '@/views/Dashboard.vue';

const routes = [
  { path: '/', name: 'Top', component: Top },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'MyDashboard', component: Dashboard },
  { path: '/dashboard/:userId', name: 'UserDashboard', component: Dashboard },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
