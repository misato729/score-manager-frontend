<template>
  <section
    id="map"
    class="map-container card"
    :class="{ 'is-fullscreen': isFullscreen }"
  >
    <button
      type="button"
      class="fullscreen-btn"
      :aria-label="isFullscreen ? '地図の全画面表示を終了' : '地図を全画面表示'"
      @click="toggleFullscreen"
    >
      {{ isFullscreen ? '✕ 閉じる' : '地図を全画面で見る' }}
    </button>

    <GMapMap
      :center="center"
      :api-key="GOOGLE_MAP_API_KEY"
      :zoom="11"
      class="shop-map"
      @bounds_changed="$emit('map-ready')"
      :options="mapOptions"
    >
      <!-- ✅ 現在地マーカー -->
      <GMapMarker
        v-if="userLocation && currentLocationIcon"
        :position="userLocation"
        :icon="currentLocationIcon"
      />

      <!-- ✅ 店舗マーカー -->
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

    <!-- ✅ 現在地ボタン -->
    <button @click="$emit('move-center')" class="locate-btn">📍 現在地</button>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { Shop } from '@/types'
import ShopInfoWindow from './ShopInfoWindow.vue'

const GOOGLE_MAP_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

const props = defineProps<{
  shops: Shop[]
  center: { lat: number; lng: number }
  userLocation: { lat: number; lng: number } | null
  currentLocationIcon: any
  isNear: (shop: Shop) => boolean
  visitedShopIds: number[]
}>()

const emit = defineEmits<{
  (e: 'move-center'): void
  (e: 'marker-click', shop: Shop): void
  (e: 'record-visit', shopId: number): void
  (e: 'map-ready'): void
}>()

const isFullscreen = ref(false)
let previousBodyOverflow = ''

const mapOptions = {
  fullscreenControl: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  gestureHandling: 'greedy',
}

watch(isFullscreen, async (fullscreen) => {
  if (fullscreen) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = previousBodyOverflow
  }

  await nextTick()
  window.dispatchEvent(new Event('resize'))
})

onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow
})

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
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
.map-container {
  position: relative;
  width: 100%;
  max-width: 1000px;
}

.map-container.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 20000;
  max-width: none;
  background: white;
}

.shop-map {
  width: 100%;
  height: 600px;
}

.is-fullscreen .shop-map {
  height: 100vh;
  height: 100dvh;
}

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

.fullscreen-btn {
  display: none;
  position: absolute;
  top: calc(env(safe-area-inset-top) + 10px);
  right: calc(env(safe-area-inset-right) + 10px);
  z-index: 20;
  background: #333;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

@media (hover: none), (max-width: 768px) {
  .fullscreen-btn {
    display: block;
  }

  .locate-btn {
    bottom: calc(env(safe-area-inset-bottom) + 50px);
    right: calc(env(safe-area-inset-right) + 10px);
  }
}
</style>
