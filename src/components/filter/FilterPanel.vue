<script setup lang="ts">
import { computed, watch } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { useFilterStore } from '@/stores/filterStore'
import { getRankColor, getFCColor } from '@/constants/rank'

const uiStore = useUiStore()
const filterStore = useFilterStore()

const mode = computed(() => uiStore.mode)

const normalRanks = ['AAA+', 'AAA', 'AA', 'A', 'B', 'C']
const expertRanks = ['100%', '99%', '98%', '97%', '96%', '95%', 'AAA', 'AA', 'A', 'B', 'C']
const currentRanks = computed(() =>
  mode.value === 'Expert' ? expertRanks : normalRanks
)

// FC表示用の定数
const currentFC = ['FC', '未FC']

// 明度で白黒を切り替える
function getTextColor(bgColor: string): string {
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 150 ? '#000' : '#fff'
}

// モード切り替えでランク初期化
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
        {{ rank }}
      </label>
    </div>

    <!-- ✅ FCフィルター -->
    <div class="filter-group">
      <label
        v-for="FC in currentFC"
        :key="FC"
        class="checkbox-item"
        :style="{
          backgroundColor: getFCColor(FC),
          color: getTextColor(getFCColor(FC))
        }"
      >
        <input
          type="checkbox"
          :value="FC"
          v-model="filterStore.selectedFC"
        />
        {{ FC }}
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
