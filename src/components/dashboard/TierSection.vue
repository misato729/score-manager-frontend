<template>
  <div class="tier-section">
    <!-- ✅ フィルターパネル -->
    <FilterPanel v-if="showFilter" />

    <!-- ✅ 地力別セクション（10段階） -->
    <div class="jiriki-container">
      <JirikiSection
        v-for="group in jirikiGroups"
        :key="group.tier"
        :tierName="group.tier"
        :scores="group.scores"
        :editable="editable"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FilterPanel from '@/components/dashboard/FilterPanel.vue'
import JirikiSection from '@/components/dashboard/JirikiSection.vue'
import { useFilterStore } from '@/stores/filterStore'
import { useUiStore } from '@/stores/uiStore'
import { rankDisplay } from '@/utils/rank'
import type { Score } from '@/types'

// ✅ props（Score型に変更）
const props = defineProps<{
  songs: Score[]  // ← Scoreとして受け取る
  editable: boolean
  showFilter: boolean 
}>()

const filterStore = useFilterStore()
const uiStore = useUiStore()
const mode = computed(() => uiStore.mode)

// ✅ モード・ランク・FCでフィルタリング
const filteredScores = computed(() =>
  props.songs.filter(score => {
    const display = rankDisplay(score.rank, mode.value)

    const rankOk =
      score.rank === '' || // ← rank未入力でもALLなら通す
      filterStore.selectedRanks.length === 0 ||
      filterStore.selectedRanks.includes(display)

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
