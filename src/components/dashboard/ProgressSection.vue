<template>
  <div class="progress-section">
    <!-- 目標ランク選択 -->
    <div class="goal-row">
      <label class="label">目標：</label>
      <RankSelect :mode="mode" @change="saveTarget" />
      <span class="count-display">{{ totalAchieved }} / {{ totalSongs }} ({{ percentDisplay }})</span>
      <button class="toggle-btn" @click="showDetail = !showDetail">
        {{ showDetail ? '詳細非表示' : '詳細表示' }}
      </button>
    </div>
    <!-- 全体 Progress -->
<ProgressBar
  tier="全体"
  :achieved="totalAchieved"
  :total="totalSongs"
  :rank="selectedRankForColor"
  :showDetail="showDetail"
/>

<!-- FC（1回だけ上部に表示）: fullComboの合計を達成数として渡す -->
<ProgressBar
  tier="FC"
  :achieved="totalFullCombo"
  :total="totalSongs"
/>

<hr />

<!-- Collapse：Tier別 Progress -->
<Transition name="collapse">
  <div v-if="showDetail" class="tier-progress-list">
    <ProgressBar
      v-for="tier in jirikiProgress"
      :key="tier.name"
      :tier="tier.name"
      :achieved="tier.achieved"
      :total="tier.total"
      :rank="selectedRankForColor"
    />
  </div>
</Transition>

  </div>
</template>

<script setup lang="ts">
import RankSelect from '@/components/dashboard/RankSelect.vue'
import ProgressBar from '@/components/dashboard/ProgressBar.vue'
import { ref, computed, watch } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { useRoute } from 'vue-router'
import { updateTarget } from '@/api/userApi'
import { rankDisplay, isRankGreaterOrEqual } from '@/utils/rank'
import type { Mode, Rank, Score } from '@/types'

// ✅ props: ユーザーの全スコア（126曲分）
interface Props {
  achieved: number
  fullCombo: number
  total: number
  selectRank: string
  allSongs: Array<any>
  mode: Mode
}

const props = defineProps<Props>()

const showDetail = ref(false)
const uiStore = useUiStore()
const authStore = useAuthStore()
const route = useRoute()

const selectedRank = computed(() => rankDisplay(uiStore.selectedRank, props.mode))
const selectedRankForColor = computed(() => selectedRank.value)

const totalFullCombo = computed(() => props.fullCombo)

// ✅ 達成済み判定
const isAchieved = (s: Score): boolean => {
  return isRankGreaterOrEqual(rankDisplay(s.rank, props.mode), selectedRank.value)
}

// ✅ 地力ランク一覧
const jirikiTiers = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C', 'D', 'E', 'F']

const baseSongs = computed(() => props.allSongs)

const totalAchieved = computed(() => baseSongs.value.filter(isAchieved).length)
const totalSongs = computed(() => baseSongs.value.length)

const jirikiProgress = computed(() =>
  jirikiTiers.map((tier) => {
    const songs = baseSongs.value.filter((s) => s.song.jiriki_rank === tier)
    return {
      name: tier,
      achieved: songs.filter(isAchieved).length,
      total: songs.length,
    }
  })
)

const percentDisplay = computed(() => {
  if (totalSongs.value === 0) return '0%'
  return `${Math.round((totalAchieved.value / totalSongs.value) * 100)}%`
})

// ✅ 自分のページのときだけ更新を許可
const isMyPage = computed(() => {
  const paramUserId = route.params.userId
  const loginUserId = authStore.user?.id?.toString()
  return typeof paramUserId === 'string' && paramUserId === loginUserId
})

// 表示モードの変更では保存せず、目標を明示的に選んだときだけ保存する。
let targetSaveQueue = Promise.resolve()
let targetSaveVersion = 0
function saveTarget(newRank: Rank) {
  const user = authStore.user
  if (!isMyPage.value || !user) return
  const version = ++targetSaveVersion
  // 連続変更でも、最後に選んだ目標が最後に保存されるよう順番を保つ。
  targetSaveQueue = targetSaveQueue.then(async () => {
    if (authStore.user !== user) return
    await updateTarget(newRank)
    if (authStore.user === user && version === targetSaveVersion) user.target = newRank
  }).catch((error) => {
    console.error('❌ target更新失敗:', error)
  })
}

watch(
  [isMyPage, () => route.params.userId, () => isMyPage.value ? authStore.user?.target : undefined],
  () => {
    uiStore.selectedRank = isMyPage.value && authStore.user?.target
      ? authStore.user.target
      : 'AAA+'
  },
  { immediate: true }
)

</script>


<style scoped>
.progress-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.goal-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.label {
  font-weight: bold;
}

.count-display {
  font-size: 14px;
  color: #333;
}

.toggle-btn {
  background: #eee;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
}

.tier-progress-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>
