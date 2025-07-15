<!-- src/components/common/AdNinja.vue -->
<template>
  <div ref="adContainer" class="ninja-ad"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const adContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (adContainer.value) {
    const script = document.createElement('script')
    script.src = 'https://adm.shinobi.jp/s/72c75eb6b5a26d1116998f18665d0711'
    // async は明示的に付けない（＝同期読み込み）
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
