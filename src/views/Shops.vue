<template>
    <div class="top-wrapper">
      <header class="page-title">
        <h1>REFLEC BEAT 設置店舗マップ</h1>
      </header>
  
      <p>「お問い合わせ」ページから情報提供のご協力をお願いいたします。</p>
  
      <ShopFilters
        v-model:keyword="keyword"
        v-model:filterUnder100="filterUnder100"
        v-model:filterTwoOrMore="filterTwoOrMore"
        v-model:selectedPrefecture="selectedPrefecture"
        :prefectures="prefectures"
        @search-nearby="searchNearby"
      />
  
      <ShopMap
        :shops="filteredShops"
        :center="center"
        :userLocation="userLocation"
        :currentLocationIcon="currentLocationIcon"
        :isNear="isNear"
        @marker-click="handleMarkerClick"
        @record-visit="recordVisit"
        @move-center="moveToCurrentLocation"
        @map-ready="onMapReady"
      />
  
      <ShopTable
        :shops="sortedShops"
        :getDistance="getDistanceFromLatLng"
        :isVisited="isVisited"
        :hasLocation="!!currentPosition"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  // ------------------------
  // 🔧 Imports
  // ------------------------
  import { ref, nextTick, computed, onMounted } from 'vue'
  import api from '@/api/axios'
  import ShopFilters from '@/components/shop/ShopFilters.vue'
  import ShopMap from '@/components/shop/ShopMap.vue'
  import ShopTable from '@/components/shop/ShopTable.vue'
  import {
    extractPrefecture,
    getDistance,
  } from '@/utils/shop'
    import type { Shop } from '@/types'
  
  // ------------------------
  // 📌 State
  // ------------------------
  const shops = ref<Shop[]>([])
  const center = ref({ lat: 35.6895, lng: 139.6917 })
  const currentPosition = ref<{ lat: number; lng: number } | null>(null)
  const currentLocationIcon = ref<any>(null)
  const userLocation = ref<{ lat: number; lng: number } | null>(null)
  const visitedShopIds = ref<number[]>([])
  
  const prefectures = [ 'すべて', '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県' ]
  
  const selectedPrefecture = ref('すべて')
  const keyword = ref('')
  const filterUnder100 = ref(false)
  const filterTwoOrMore = ref(false)
  const sortByDistance = ref(false)
  
  // ------------------------
  // 📦 Initial Load
  // ------------------------
onMounted(async () => {
  moveToCurrentLocation()
  try {
    const res = await api.get('/api/shops')
    shops.value = res.data
  } catch (err) {
    alert('❌ 店舗情報の取得に失敗しました')
    console.error(err)
  }
})

  // ------------------------
  // 🗺️ Map / Marker
  // ------------------------
  function onMapReady() {
    const gmaps = (window as any).google?.maps
    const circlePath =
      gmaps?.SymbolPath?.CIRCLE ?? 'M0,0 m -10,0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0'
  
    currentLocationIcon.value = {
      path: circlePath,
      scale: 8,
      fillColor: '#4285F4',
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: 'white',
    }
  
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLocation.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
      },
      (err) => console.error('❌ 現在地取得失敗:', err)
    )
  }
  
  function moveToCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        center.value = { lat: latitude, lng: longitude }
        currentPosition.value = { lat: latitude, lng: longitude }
        userLocation.value = { lat: latitude, lng: longitude }
      },
      (err) => {
        console.error('現在地の取得に失敗:', err)
        alert('現在地の取得に失敗しました')
      }
    )
  }
  
  // ------------------------
  // 📌 Utility Logic
  // ------------------------
  function getDistanceFromLatLng(lat: number, lng: number): number {
    if (!currentPosition.value) return Infinity
    return getDistance(currentPosition.value.lat, currentPosition.value.lng, lat, lng) / 1000
  }
  
  function isNear(shop: Shop): boolean {
    if (!userLocation.value) return false
    return getDistance(userLocation.value.lat, userLocation.value.lng, shop.lat, shop.lng) < 500
  }
  
  function isVisited(id: number): boolean {
    return visitedShopIds.value.includes(id)
  }


async function recordVisit(shopId: number) {
  try {
    const res = await api.post('/api/visit', { shop_id: shopId })

    alert('✅ 行脚しました！')

    if (!visitedShopIds.value.includes(shopId)) {
      visitedShopIds.value.push(shopId)
    }
  } catch (err: any) {
    if (err.response?.status === 409) {
      alert('⚠️ すでに行脚済みです')
    } else {
      alert('❌ 行脚に失敗しました')
      console.error(err)
    }
  }
}

  
  function handleMarkerClick(shop: Shop) {
    shops.value.forEach((s) => (s.isOpen = false))
    nextTick().then(() => {
      shop.isOpen = true
    })
  }
  
  // ------------------------
  // 🧠 Filter & Sort
  // ------------------------
  const filteredShops = computed(() =>
    shops.value.filter((shop) => {
      if (selectedPrefecture.value !== 'すべて') {
        if (extractPrefecture(shop.address) !== selectedPrefecture.value) return false
      }
      if (filterUnder100.value && (!shop.price || isNaN(shop.price) || shop.price > 100)) {
        return false
      }
      if (filterTwoOrMore.value && shop.number_of_machine < 2) return false
      if (
        keyword.value &&
        !shop.name.includes(keyword.value) &&
        !shop.address.includes(keyword.value)
      ) {
        return false
      }
      return true
    })
  )
  
  const sortedShops = computed(() => {
    if (sortByDistance.value && currentPosition.value) {
      return [...filteredShops.value].sort(
        (a, b) =>
          getDistanceFromLatLng(a.lat, a.lng) - getDistanceFromLatLng(b.lat, b.lng)
      )
    }
    return [...filteredShops.value].sort((a, b) => a.id - b.id)
  })
  
  function searchNearby() {
    sortByDistance.value = true
    moveToCurrentLocation()
  }
  </script>
  
  <style scoped>
  .top-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f4ff, #ffece6, #e8fff2);
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;
  }
  
  .page-title {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 24px;
  }
  
  .page-title h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 8px;
  }
  </style>
  