<template>
  <div class="tier-section">
    <!-- ✅ フィルターパネル -->
    <FilterPanel v-if="showFilter" :mode="mode" :hasBelowProRank="hasBelowProRank" />

    <!-- ✅ 地力別セクション（10段階） -->
    <div class="jiriki-container">
      <JirikiSection
        v-for="group in jirikiGroups"
        :key="group.tier"
        :tierName="group.tier"
        :scores="group.scores"
        :editable="editable"
        :mode="mode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FilterPanel from '@/components/dashboard/FilterPanel.vue'
import JirikiSection from '@/components/dashboard/JirikiSection.vue'
import { useFilterStore } from '@/stores/filterStore'
import { getRankScale, rankDisplay } from '@/utils/rank'
import type { Mode, Score } from '@/types'

// ✅ props（Score型に変更）
const props = defineProps<{
  songs: Score[]  // ← Scoreとして受け取る
  editable: boolean
  showFilter: boolean 
  mode: Mode
}>()

const filterStore = useFilterStore()
const hasBelowProRank = computed(() => props.songs.some(score => score.rank === '<99.0%'))
const allRanksSelected = computed(() =>
  getRankScale(props.mode).every(rank => filterStore.selectedRanks.includes(rank)) &&
  (!hasBelowProRank.value || filterStore.selectedRanks.includes('<99.0%'))
)

// ✅ モード・ランク・FCでフィルタリング
const filteredScores = computed(() =>
  props.songs.filter(score => {
    if (!props.showFilter) return true
    const display = rankDisplay(score.rank, props.mode)

    const rankOk = display === ''
      ? allRanksSelected.value
      : filterStore.selectedRanks.includes(display)

    const fcOk =
      (score.fc && filterStore.showFC) ||
      (!score.fc && filterStore.showNotFC)

    return rankOk && fcOk
  })
)



// ✅ 地力ランク一覧（S+ ～ F）
const jirikiScale = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C', 'D', 'E', 'F']

// ✅ 地力ごとにグルーピング（Scoreの.song.jiriki_rankで分ける）
const jirikiGroups = computed(() =>
  jirikiScale.map(tier => ({
    tier,
    scores: filteredScores.value.filter(score => score.song.jiriki_rank === tier)
  }))
)
</script>

<style scoped>
.tier-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.jiriki-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>
