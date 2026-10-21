<template>
  <div class="visited-shops">
    <h1>{{ pageTitle }}</h1>

    <!-- ロード中表示 -->
    <p v-if="isLoading">Now Loading...</p>

    <!-- 取得後の表示 -->
    <template v-else>
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
            <td>{{ formatDate(shop.created_at) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 取得完了 & データ0件 -->
      <p v-else>訪問記録がありません。</p>

      <!-- エラー時 -->
      <p v-if="errorMessage" style="color:#c00; margin-top:8px;">{{ errorMessage }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchUserVisitedShops, type VisitedShop } from '@/api/visitApi'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

const visitedList = ref<VisitedShop[]>([])
const displayUserName = ref('')
const isLoading = ref(true)           // ✅ 追加：ロード状態
const errorMessage = ref<string>('')  // ✅ 追加：エラーメッセージ（任意）

const route = useRoute()
const userId = computed(() => {
  const id = route.params.userId
  return typeof id === 'string' ? id : ''
})
const pageTitle = computed(() => {
  if (userId.value && displayUserName.value) {
    return `${displayUserName.value}さんの行脚履歴`
  }
  return '行脚店舗一覧'
})

watch(userId, async (id, _previousId, onCleanup) => {
  let cancelled = false
  onCleanup(() => { cancelled = true })
  isLoading.value = true
  errorMessage.value = ''
  displayUserName.value = ''
  visitedList.value = []

  try {
    if (!id) {
      // ユーザーIDが無い場合もロード完了にする（"記録なし" を出したくないなら別メッセージにしてもOK）
      errorMessage.value = 'ユーザーIDが指定されていません。'
      return
    }
    const data = await fetchUserVisitedShops(id)
    if (cancelled) return

    if (Array.isArray(data)) {
      visitedList.value = data
      displayUserName.value = data[0]?.user_name ?? ''
    } else {
      visitedList.value = data.visited_shops ?? []
      displayUserName.value = data.user_name ?? ''
    }
  } catch (err: any) {
    if (cancelled) return
    console.error('❌ 行脚店舗の取得に失敗しました', err)
    errorMessage.value =
      err?.response?.data?.message ??
      (err?.message || '不明なエラーが発生しました')
    alert(`エラー: ${errorMessage.value}`)
  } finally {
    if (!cancelled) isLoading.value = false
  }
}, { immediate: true })

function extractPrefecture(address: string): string {
  const match = address.match(/^.{2,3}(都|道|府|県)/)
  return match ? match[0] : '不明'
}

function formatDate(dateTimeStr: string): string {
  return dayjs.utc(dateTimeStr).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm')
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
