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

// ✅ 明度に応じた文字色（白 or 黒）
function getTextColor(bgColor: string): string {
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 150 ? '#000' : '#fff'
}

// ✅ モード変更時、選択ランクを初期化
watch(currentRanks, (newRanks) => {
  filterStore.selectedRanks = [...newRanks]
}, { immediate: true })
</script>

<template>
  <div class="filter-panel">
    <!-- ✅ ランクフィルター -->
    <div class="filter-group">
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
        {{ rankDisplay(rank, mode.value) }}
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
          :checked="filterStore.showFC"
          @change="filterStore.toggleFC()"
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
          :checked="filterStore.showNotFC"
          @change="filterStore.toggleNotFC()"
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
</style>
