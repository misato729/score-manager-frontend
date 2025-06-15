<template>
    <div class="visited-shops">
      <h1>行脚店舗一覧</h1>
      <h2>Coming Soon ...</h2>
  
      <!-- <table class="visited-table" v-if="visitedList.length > 0">
        <thead>
          <tr>
            <th>都道府県</th>
            <th>店舗名</th>
            <th>訪問日時</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="shop in visitedList" :key="shop.id">
            <td>{{ extractPrefecture(shop.address) }}</td>
            <td>{{ shop.name }}</td>
            <td>{{ shop.visited_at }}</td>
          </tr>
        </tbody>
      </table>
  
      <p v-else>訪問記録がありません。</p> -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  interface VisitedShop {
    id: number
    name: string
    address: string
    visited_at: string
  }
  
  const route = useRoute()
  const userId = computed(() => route.query.user as string)
  
  const allVisitedShops = ref<VisitedShop[]>([
    {
      id: 1,
      name: 'GiGO秋葉原3号館',
      address: '東京都千代田区外神田1-11-11',
      visited_at: '2025-06-10 14:23',
    }
])
  
  const visitedList = ref<VisitedShop[]>([])
  
  onMounted(() => {
    if (userId.value === '15') {
      visitedList.value = allVisitedShops.value.slice(0, 2)
    } else if (userId.value === '99') {
      visitedList.value = [allVisitedShops.value[2]]
    } else {
      visitedList.value = []
    }
  })
  
  function extractPrefecture(address: string): string {
  const match = address.match(/^.{2,3}(都|道|府|県)/)
  return match ? match[0] : '不明'
}
  </script>
  
  <style scoped>
  h1{
    font-size: 24px;
    margin-bottom: 16px;
    text-align: center;
  }

  .visited-shops {
    padding: 24px;
  }
  
  .visited-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
    background: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  }
  
  .visited-table th,
  .visited-table td {
    border: 1px solid #ccc;
    padding: 12px;
    text-align: left;
  }
  
  .visited-table th {
    background-color: #f0f0f0;
  }
  </style>
  