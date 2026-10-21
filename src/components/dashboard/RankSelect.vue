<template>
  <div class="rank-select">
    <select v-model="displayRank" @change="emit('change', uiStore.selectedRank)">
      <option v-if="!currentRanks.some(rank => rank === displayRank)" :value="displayRank" disabled>
        {{ displayRank }}
      </option>
      <option v-for="rank in currentRanks" :key="rank" :value="rank">
        {{ rank }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { getRankScale, rankDisplay } from '@/utils/rank'
import type { Mode, Rank } from '@/types'

const props = defineProps<{ mode: Mode }>()
const emit = defineEmits<{ change: [rank: Rank] }>()
const uiStore = useUiStore()

const currentRanks = computed(() => getRankScale(props.mode))
const displayRank = computed({
  get: () => rankDisplay(uiStore.selectedRank, props.mode),
  set: (rank: string) => { uiStore.selectedRank = rank as Rank },
})
</script>

<style scoped>
.rank-select select {
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 6px;
}
</style>
