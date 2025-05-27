<template>
    <header class="header">
      <div class="header-left">
        <RouterLink to="/">
          <img :src="logo" alt="ロゴ" class="logo" />
        </RouterLink>
        <RouterLink to="/dashboard" class="link">難易度表</RouterLink>
        <a href="mailto:example@example.com" class="link">お問い合わせ</a>
      </div>
  
      <div class="header-right">
        <RouterLink v-if="!auth.user" to="/login" class="link">ログイン</RouterLink>
  
        <div v-else class="user-menu" @click="toggleMenu">
          <span class="username">{{ auth.user.name }}▼</span>
            <div v-show="menuOpen" class="dropdown">
              <!-- ✅ 追加：自分の難易度表 -->
              <RouterLink
                class="dropdown-link"
                :to="`/dashboard?user=${auth.user?.id}`"
              >
                マイ難易度表
              </RouterLink>
            
              <!-- ✅ 既存：ログアウト -->
              <a href="#" class="dropdown-link" @click.prevent="logout">ログアウト</a>
            </div>
        </div>

      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { RouterLink, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  import { ref } from 'vue'
  import logo from '@/assets/logo.png'
  
  const auth = useAuthStore()
  const router = useRouter()
  const menuOpen = ref(false)
  
  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
  }
  
  const logout = async () => {
    await auth.logout() // ← authStore に logout メソッドがある前提
    menuOpen.value = false
    router.push('/')
  }
  </script>
  
  <style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background:#D9D9D9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .header-left,
  .header-right {
    display: flex;
    align-items: center;
    gap: 30px;
  }
  
  .logo {
    width: 30px;
    height: 30px;
  }
  
  .link {
    color: #333;
    text-decoration: none;
  }
  
  .link:hover {
    text-decoration: underline;
  }
  
  .user-menu {
    position: relative;
    cursor: pointer;
  }
  
  .username {
    color: #333;
    font-weight: bold;
  }
  
  .dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 8px;
    min-width: 120px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .dropdown-link {
    display: block;
    padding: 10px;
    color: #333;
    text-decoration: none;
  }
  
  .dropdown-link:hover {
    background: #f2f2f2;
  }
  </style>
  