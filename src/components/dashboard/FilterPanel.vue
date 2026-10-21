<template>
  <div class="filter-panel">
    <!-- ランク一覧 -->
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
          :checked="filterStore.selectedRanks.includes(rank)"
          @change="toggleRank(rank)"
        />
        {{ rankDisplay(rank, mode) }}
      </label>

      <!-- ALLボタン -->
      <label class="checkbox-item all-chip">
        <input type="checkbox" :checked="isAllChecked" @change="toggleAll" />
        ALL
      </label>
    </div>

    <!-- FC/未FC -->
    <div class="filter-group">
      <label class="checkbox-item" style="background-color: #ffb6c1">
        <input type="checkbox" v-model="filterStore.showFC" />
        FC
      </label>
      <label class="checkbox-item" style="background-color: #ccc">
        <input type="checkbox" v-model="filterStore.showNotFC" />
        未FC
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useFilterStore } from '@/stores/filterStore'
import {
  getRankColor,
  rankDisplay,
  getRankScale,
} from '@/utils/rank'
import type { Mode } from '@/types'

const props = defineProps<{ mode: Mode; hasBelowProRank: boolean }>()
const filterStore = useFilterStore()

const currentRanks = computed(() => {
  const ranks: string[] = [...getRankScale(props.mode)]
  // Proで保存した範囲は、下位ランクを推測せず独立した分類にする。
  if (props.hasBelowProRank && !ranks.includes('<99.0%')) ranks.push('<99.0%')
  return ranks
})

// ✅ 初回マウント時に全ON
onMounted(() => {
  filterStore.selectedRanks = [...currentRanks.value]
  filterStore.showFC = true
  filterStore.showNotFC = true
})

// ✅ モード切り替え時にも全ONに追従
watch(currentRanks, () => {
  filterStore.selectedRanks = [...currentRanks.value]
  filterStore.showFC = true
  filterStore.showNotFC = true
})

// ✅ ALLボタンの状態
const isAllChecked = computed(() =>
  currentRanks.value.every(rank => filterStore.selectedRanks.includes(rank)) &&
  filterStore.showFC &&
  filterStore.showNotFC
)

function toggleRank(rank: string) {
  const index = filterStore.selectedRanks.indexOf(rank)
  if (index === -1) {
    filterStore.selectedRanks.push(rank)
  } else {
    filterStore.selectedRanks.splice(index, 1)
  }
}

function toggleAll() {
  if (isAllChecked.value) {
    filterStore.selectedRanks = []
    filterStore.showFC = false
    filterStore.showNotFC = false
  } else {
    filterStore.selectedRanks = [...currentRanks.value]
    filterStore.showFC = true
    filterStore.showNotFC = true
  }
}

function getTextColor(bgColor: string): string {
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}
</script>



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
