<template>
  <div class="progress-section">
    <!-- 目標ランク選択 -->
    <div class="goal-row">
      <label class="label">目標：</label>
      <RankSelect />
      <span class="count-display">{{ totalAchieved }} / {{ totalSongs }} ({{ percentDisplay }})</span>
      <button class="toggle-btn" @click="showDetail = !showDetail">
        {{ showDetail ? '詳細非表示' : '詳細表示' }}
      </button>
    </div>

    <!-- 全体 ProgressBar -->
    <ProgressBar
      tier="全体"
      :achieved="totalAchieved"
      :total="totalSongs"
      :rank="selectedRankForColor"
    />

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
import RankSelect from '@/components/filter/RankSelect.vue'
import ProgressBar from '@/components/dashboard/ProgressBar.vue'
import { ref, computed } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { rankDisplay, isRankGreaterOrEqual } from '@/utils/rank'
import type { Score } from '@/types'

// ✅ props: ユーザーの全スコア（126曲分）
const props = defineProps<{
  allSongs: Score[]
}>()

const showDetail = ref(false)
const uiStore = useUiStore()

const mode = computed(() => uiStore.mode)
const selectedRank = computed(() => uiStore.selectedRank)
const selectedRankForColor = computed(() => selectedRank.value)

// ✅ AAA+ は Expert では見た目 95% に変換して比較対象にする
const selectedRankRaw = computed(() => {
  return mode.value === 'Normal' && selectedRank.value === 'AAA+'
    ? '95%' // ← データ的に比較されるのはこちら
    : selectedRank.value
})

// ✅ 達成済み判定
const isAchieved = (s: Score): boolean => {
  return isRankGreaterOrEqual(s.rank, selectedRankRaw.value)
}

// ✅ 地力ランク一覧
const jirikiTiers = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C', 'D', 'E', 'F']

// ✅ 全体・Tier別進捗（フィルター非依存）
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
