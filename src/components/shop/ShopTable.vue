<template>
    <section class="card" style="max-width: 1000px;">
      <div class="head-container">
        <h2 class="title">設置店舗一覧</h2>
        <button @click="$emit('search-nearby')" class="search-btn">📍 近くの店舗を検索</button>
      </div>
      <table class="shop-table">
        <thead>
          <tr>
            <th>店舗名</th>
            <th>住所</th>
            <th>料金</th>
            <th>筐体数</th>
            <th>距離</th>
            <th>行脚</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="shop in shops" :key="shop.id">
            <td>{{ shop.name }}</td>
            <td>{{ shop.address }}</td>
            <td>{{ shop.price === 0 ? 'No Data' : `${shop.price}円` }}</td>
            <td>{{ shop.number_of_machine === 0 ? 'No Data' : shop.number_of_machine }}</td>
            <td>
              <span v-if="hasLocation">
                {{ getDistance(shop.lat, shop.lng).toFixed(2) }} km
              </span>
              <span v-else>—</span>
            </td>
            <td>
              <span :style="{ color: isVisited(shop.id) ? 'green' : '#888' }">
                {{ isVisited(shop.id) ? '行脚済' : '未訪問' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </template>
  
  <script setup lang="ts">
  import type { Shop } from '@/types'
  
  defineProps<{
    shops: Shop[]
    getDistance: (lat: number, lng: number) => number
    isVisited: (shopId: number) => boolean
    hasLocation: boolean
  }>()
  
  </script>
  
  <style scoped>
  .head-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .search-btn {
    padding: 6px 12px;
    background-color: #59aaff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
  }
  .shop-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 24px;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .shop-table thead {
    background-color: #f0f0f0;
  }
  
  .shop-table thead th {
    padding: 12px;
    text-align: left;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
  }
  
  .shop-table tbody tr {
    background-color: #fff;
    transition: background-color 0.2s;
  }
  
  .shop-table tbody tr:hover {
    background-color: #f9f9f9;
  }
  
  .shop-table tbody td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }
  </style>
  