<template>
  <section
    id="map"
    class="card"
    style="max-width: 1000px; position: relative;"
  >
    <!-- ✅ スマホのみ表示される全画面ボタン -->
    <button
      v-if="isMobile && !showOverlayMap"
      @click="showOverlayMap = true"
      class="fullscreen-btn"
    >
      地図を全画面で見る
    </button>

    <!-- ✅ 通常地図 -->
    <GMapMap
      :center="center"
      :api-key="GOOGLE_MAP_API_KEY"
      :zoom="11"
      style="width: 100%; height: 600px"
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

    <!-- ✅ 全画面オーバーレイ地図 -->
    <div v-if="showOverlayMap" class="overlay-map">
      <button @click="showOverlayMap = false" class="close-btn">✕</button>

      <GMapMap
        :center="center"
        :api-key="GOOGLE_MAP_API_KEY"
        :zoom="11"
        style="width: 100vw; height: 100vh"
        @bounds_changed="$emit('map-ready')"
        :options="mapOptions"
      >
        <GMapMarker
          v-if="userLocation && currentLocationIcon"
          :position="userLocation"
          :icon="currentLocationIcon"
        />

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
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const showOverlayMap = ref(false)
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.matchMedia('(max-width: 768px)').matches
  }

  checkMobile()
  window.addEventListener('resize', checkMobile)
})

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

.fullscreen-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10000;
  background: #333;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  border: none;
}

.overlay-map {
  position: fixed;
  inset: 0;
  background: white;
  z-index: 9999;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10000;
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 1rem;
  border: none;
}
</style>
