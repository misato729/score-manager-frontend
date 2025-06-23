import { createRouter, createWebHistory } from 'vue-router';
import Top from '@/views/Top.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Songlist from '@/views/Songlist.vue';
import Dashboard from '@/views/Dashboard.vue';
import Inquiry from '@/views/Inquiry.vue';
import Shops from '@/views/Shops.vue';
import VisitedShops from '@/views/VisitedShops.vue';
import HowToAngya from '@/components/shop/HowToAngya.vue';

const routes = [
  { path: '/', name: 'Top', component: Top },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'MyDashboard', component: Dashboard },
  { path: '/dashboard/:userId', name: 'UserDashboard', component: Dashboard },
  { path: '/shops', name: 'Shops', component: Shops },
  { path: '/visited_shops', name: 'VisitedShops', component: VisitedShops },
  { path: '/songlist', name: 'Songlist', component: Songlist },
  { path: '/inquiry', name: 'Inquiry', component: Inquiry },
  { path: '/how_to_angya', name: 'HowToAngya', component: HowToAngya },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
