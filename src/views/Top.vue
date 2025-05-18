<template>
    <div class="max-w-2xl mx-auto p-8 bg-white rounded shadow">
      <h1 class="text-3xl font-bold mb-4 text-center">REFLEC BEAT Plus スコア管理アプリ</h1>
      
      <p class="mb-6 text-gray-700">
        本アプリは、REFLEC BEAT Plus レベル11楽曲のスコアを上級者向けに管理・可視化できるツールです。
        Normal / Expert 表示切り替え、達成率・フルコンボ管理、Tier分類などに対応しています。
      </p>
  
      <p class="mb-6 text-red-600 font-semibold">
        ※ スコア管理機能はログインユーザーのみ利用できます。未ログイン時は閲覧のみとなります。
      </p>
  
      <div class="flex justify-center gap-4">
        <RouterLink to="/login">
          <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            ログイン
          </button>
        </RouterLink>
        <RouterLink to="/register">
          <button class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
            新規登録
          </button>
        </RouterLink>
        <RouterLink to="/dashboard">
          <button class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
            難易度表
          </button>
        </RouterLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // 特にロジックは不要（静的ページ）
  </script>
  