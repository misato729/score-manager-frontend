<template>
    <section class="card" style="max-width: 1000px; position: relative;">
      <GMapMap
        :center="center"
        :zoom="11"
        style="width: 100%; height: 600px"
        @bounds_changed="$emit('map-ready')"
      >
        <!-- 現在地マーカー -->
        <GMapMarker
          v-if="userLocation && currentLocationIcon"
          :position="userLocation"
          :icon="currentLocationIcon"
        />
  
        <!-- 店舗マーカー -->
        <GMapMarker
          v-for="shop in shops"
          :key="shop.id"
          :position="{ lat: shop.lat, lng: shop.lng }"
          @click="$emit('marker-click', shop)"
        >
          <template v-if="shop.isOpen">
            <ShopInfoWindow
              :shop="shop"
              :isNear="isNear(shop)"
              @close="shop.isOpen = false"
              @record="onRecordVisit(shop.id)"
            />
          </template>
        </GMapMarker>
      </GMapMap>
  
      <!-- 現在地ボタン -->
      <button @click="$emit('move-center')" class="locate-btn">📍 現在地</button>
    </section>
  </template>
  
  <script setup lang="ts">
  import type { Shop } from '@/types'
  import ShopInfoWindow from './ShopInfoWindow.vue'
  
  defineProps<{
    shops: Shop[]
    center: { lat: number; lng: number }
    userLocation: { lat: number; lng: number } | null
    currentLocationIcon: any
    isNear: (shop: Shop) => boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'move-center'): void
    (e: 'marker-click', shop: Shop): void
    (e: 'record-visit', shopId: number): void
    (e: 'map-ready'): void
  }>()
  
  function onRecordVisit(shopId: number) {
    emit('record-visit', shopId)
  }
  </script>
  
  <style scoped>
  .locate-btn {
    position: absolute;
    top: 740px;
    right: 60px;
    z-index: 10;
    background: white;
    border: 1px solid #ccc;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  </style>
  