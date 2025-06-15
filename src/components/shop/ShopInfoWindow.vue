<template>
    <GMapInfoWindow :opened="true" @closeclick="$emit('close')">
      <div style="max-width: 250px; font-size: 14px; line-height: 1.6;">
        <strong style="font-size: 16px;">🏢 {{ shop.name }}</strong><br />
        📍 {{ shop.address }}<br />
        🎮 {{ shop.price }}円 / 🕹️ {{ shop.number_of_machine }}台<br />
        {{ shop.description }}<br />
        <!-- <div v-if="isNear" style="margin-top: 10px;">
          <button @click="$emit('record')">✅ この店舗に行脚記録をつける</button>
        </div> -->
      </div>
    </GMapInfoWindow>
  </template>
  
  <script setup lang="ts">
  import type { Shop } from '@/utils/shop'
  
  defineProps<{
    shop: Shop
    isNear: boolean
  }>()
  
  defineEmits<{
    (e: 'close'): void
    (e: 'record'): void
  }>()
  </script>
  