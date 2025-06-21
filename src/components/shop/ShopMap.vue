<template>
  <section id="map" class="card" style="max-width: 1000px; position: relative;">
    <GMapMap
      :center="center"
      :api-key="GOOGLE_MAP_API_KEY"
      :zoom="11"
      style="width: 100%; height: 600px"
      @bounds_changed="$emit('map-ready')"
      :options="mapOptions"
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
        :position="{ lat: Number(shop.lat), lng: Number(shop.lng) }"
        :icon="getMarkerIcon(shop.id)"
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

    <!-- 現在地検索ボタン -->
    <button @click="$emit('move-center')" class="locate-btn">📍 現在地</button>
  </section>
</template>

<script setup lang="ts">
import type { Shop } from '@/types'
import ShopInfoWindow from './ShopInfoWindow.vue'

const GOOGLE_MAP_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

const props = defineProps<{
  shops: Shop[]
  center: { lat: number; lng: number }
  userLocation: { lat: number; lng: number } | null
  currentLocationIcon: any
  isNear: (shop: Shop) => boolean
  visitedShopIds: number[] // ✅ 行脚済みID
}>()

const emit = defineEmits<{
  (e: 'move-center'): void
  (e: 'marker-click', shop: Shop): void
  (e: 'record-visit', shopId: number): void
  (e: 'map-ready'): void
}>()

const mapOptions = {
  fullscreenControl: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  gestureHandling: 'greedy',
}

function onRecordVisit(shopId: number) {
  emit('record-visit', shopId)
}

function getMarkerIcon(shopId: number): string {
  return props.visitedShopIds.includes(shopId)
    ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
}
</script>

<style scoped>
.locate-btn {
  position: absolute;
  bottom: 50px;
  right: 80px;
  z-index: 10;
  background: white;
  border: 1px solid #ccc;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
