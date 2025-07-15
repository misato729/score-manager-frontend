<!-- src/components/common/AdNinja.vue -->
<template>
    <div ref="adContainer" class="ninja-ad"></div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue'
  
  const adContainer = ref<HTMLElement | null>(null)
  
  // スマホかどうかを判定するユーティリティ
  function isMobileDevice(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  }
  
  onMounted(() => {
    if (adContainer.value) {
      const script = document.createElement('script')
      // script.async = true
  
      // デバイスに応じてスクリプトURLを切り替える
      script.src = isMobileDevice()
        ? 'https://adm.shinobi.jp/s/49f522d873ad8300b8bb6b3dd050174b' // モバイル用
        : 'https://adm.shinobi.jp/s/72c75eb6b5a26d1116998f18665d0711' // PC用
  
      adContainer.value.appendChild(script)
    }
  })
  </script>
  
  <style scoped>
  .ninja-ad {
    margin: 1rem 0;
    text-align: center;
  }
  </style>
  