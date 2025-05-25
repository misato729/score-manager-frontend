<script setup lang="ts">
import { computed, watch } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { useFilterStore } from '@/stores/filterStore'
import {
  getRankColor,
  getFCColor,
  NormalRankScale,
  ExpertRankScale,
  rankDisplay,
} from '@/utils/rank'

const uiStore = useUiStore()
const filterStore = useFilterStore()

const mode = computed(() => uiStore.mode)

const currentRanks = computed(() =>
  mode.value === 'Expert' ? ExpertRankScale : NormalRankScale
)

// ✅ 初期化（mode切り替え時に全選択）
watch(
  mode,
  (newMode) => {
    filterStore.selectedRanks = [
      ...(newMode === 'Expert' ? ExpertRankScale : NormalRankScale),
    ]
  },
  { immediate: true }
)

// ✅ 明度による文字色
function getTextColor(bgColor: string): string {
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 150 ? '#000' : '#fff'
}

// ✅ ALLチェックの状態
const allSelected = computed(() =>
  currentRanks.value.every((rank) => filterStore.selectedRanks.includes(rank))
)

// ✅ トグル関数
function toggleAllRanks() {
  if (allSelected.value) {
    filterStore.selectedRanks = []
  } else {
    filterStore.selectedRanks = [...currentRanks.value]
  }
}
</script>

<template>
  <div class="filter-panel">
    <!-- ✅ ランクフィルター（ALL含む） -->
    <div class="filter-group">

      <!-- ✅ 各ランク -->
      <label
        v-for="rank in currentRanks"
        :key="rank"
        class="checkbox-item"
        :style="{
          backgroundColor: getRankColor(rank),
          color: getTextColor(getRankColor(rank))
        }"
      >
        <input
          type="checkbox"
          :value="rank"
          v-model="filterStore.selectedRanks"
        />
        {{ rankDisplay(rank, mode) }}
      </label>
      <!-- ✅ ALLチェックボックス -->
      <label
        class="checkbox-item all-chip"
        :class="{ selected: allSelected }"
        @click.prevent="toggleAllRanks"
        :style="{
          backgroundColor: '#222',
          color: '#fff',
          fontWeight: 'bold'
        }"
      >
        <input type="checkbox" :checked="allSelected" />
        ALL
      </label>
    </div>

    <!-- ✅ FCフィルター -->
    <div class="filter-group">
      <label
        class="checkbox-item"
        :style="{
          backgroundColor: getFCColor('FC'),
          color: getTextColor(getFCColor('FC'))
        }"
      >
        <input
          type="checkbox"
          v-model="filterStore.showFC"
        />
        FC
      </label>

      <label
        class="checkbox-item"
        :style="{
          backgroundColor: getFCColor('未FC'),
          color: getTextColor(getFCColor('未FC'))
        }"
      >
        <input
          type="checkbox"
          v-model="filterStore.showNotFC"
        />
        未FC
      </label>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.checkbox-item {
  font-size: 14px;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
}

.checkbox-item input[type='checkbox'] {
  accent-color: white;
}

.all-chip {
  background-color: #222;
  color: #fff;
  font-weight: bold;
}
</style>
