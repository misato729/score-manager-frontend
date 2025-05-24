<template>
  <div class="rank-select">
    <select v-model="uiStore.selectedRank">
      <option v-for="rank in currentRanks" :key="rank" :value="rank">
        {{ rankDisplay(rank) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { NormalRankScale, ExpertRankScale } from '@/utils/rank'

const uiStore = useUiStore()

const currentRanks = computed(() =>
  uiStore.mode === 'Expert' ? ExpertRankScale : NormalRankScale
)

const rankDisplay = (rank: string): string => {
  if (uiStore.mode === 'Normal' && ['100%', '99%', '98%', '97%', '96%', '95%'].includes(rank)) {
    return 'AAA+'
  }
  return rank
}
</script>

<style scoped>
.rank-select select {
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 6px;
}
</style>
