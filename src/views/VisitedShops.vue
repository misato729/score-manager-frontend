<template>
  <div class="visited-shops">
    <h1>行脚店舗一覧</h1>

    <div class="progress-summary" v-if="visitedList.length > 0">
      都道府県数：{{ uniquePrefectures.length }} / 47　
      店舗数：{{ visitedList.length }} 店舗
    </div>

    <table class="visited-table" v-if="visitedList.length > 0">
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
          <td>{{ formatDate(shop.visited_at) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>訪問記録がありません。</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'

interface VisitedShop {
  id: number
  name: string
  address: string
  visited_at: string
}

const visitedList = ref<VisitedShop[]>([])

const route = useRoute()
const userId = computed(() => route.query.user as string)

onMounted(async () => {
  if (!userId.value) return

  try {
    const res = await api.get(`/api/visited-shops?user=${userId.value}`)
    visitedList.value = res.data
  } catch (err) {
    console.error('❌ 行脚店舗の取得に失敗しました', err)
  }
})

function extractPrefecture(address: string): string {
  const match = address.match(/^.{2,3}(都|道|府|県)/)
  return match ? match[0] : '不明'
}

function formatDate(dateTimeStr: string): string {
  const date = new Date(dateTimeStr)
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const uniquePrefectures = computed(() => {
  const set = new Set(visitedList.value.map((s) => extractPrefecture(s.address)))
  return Array.from(set)
})
</script>

<style scoped>
.visited-shops {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  margin-bottom: 16px;
  text-align: center;
}

.progress-summary {
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  color: #333;
}

.visited-table {
  width: 100%;
  border-collapse: collapse;
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
