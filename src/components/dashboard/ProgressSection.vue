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
import { useFilterStore } from '@/stores/filterStore'
import { mockSongs } from '@/mock/mockSongs'
import { rankDisplay, isRankGreaterOrEqual } from '@/utils/rank'
import type { Song } from '@/types'

const showDetail = ref(false)
const uiStore = useUiStore()
const filterStore = useFilterStore()

const mode = computed(() => uiStore.mode)
const selectedRank = computed(() => uiStore.selectedRank)
const selectedRankForColor = computed(() => uiStore.selectedRank) // プログレスバー色用（補正なし）

// ✅ NormalかつAAA+選択時のみ 95% に補正。それ以外はそのまま。
const selectedRankRaw = computed(() => {
  return mode.value === 'Normal' && selectedRank.value === 'AAA+'
    ? '95%'
    : selectedRank.value
})

// ✅ FC判定関数
const isFC = (song: Song): boolean => {
  return song.fc || song.rank === '100%'
}

// ✅ 楽曲フィルター（FC + ランク一致）
const filteredSongs = computed(() => {
  return mockSongs.filter((song) => {
    const display = rankDisplay(song.rank, mode.value)
    const matchRank = filterStore.selectedRanks.includes(display)
    const matchFC =
      (filterStore.showFC && isFC(song)) ||
      (filterStore.showNotFC && !isFC(song) && song.rank !== '100%')
    return matchRank && matchFC
  })
})

// ✅ 達成判定（スコア比較）
const isAchieved = (song: Song): boolean => {
  return isRankGreaterOrEqual(song.rank, selectedRankRaw.value)
}

// ✅ Tier別の進捗
const jirikiTiers = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C', 'D', 'E', 'F']
const jirikiProgress = computed(() =>
  jirikiTiers.map((tier) => {
    const songs = filteredSongs.value.filter((s) => s.tier === tier)
    return {
      name: tier,
      achieved: songs.filter(isAchieved).length,
      total: songs.length,
    }
  })
)

// ✅ 全体の進捗
const totalAchieved = computed(() => filteredSongs.value.filter(isAchieved).length)
const totalSongs = computed(() => filteredSongs.value.length)
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
/* Collapseアニメーション：0.3秒かけて開閉 */
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
  max-height: 1000px; /* 十分大きい値を指定 */
  opacity: 1;
}

</style>
