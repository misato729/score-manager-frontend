<template>
  <div class="tier-section">
    <!-- フィルターパネル -->
    <FilterPanel />

    <!-- 地力Tierごとのセクション -->
    <div class="jirikis">
      <JirikiSection
        v-for="section in songsByTier"
        :key="section.tierName"
        :tierName="section.tierName"
        :songs="section.songs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import FilterPanel from '@/components/filter/FilterPanel.vue'
import JirikiSection from '@/components/jiriki/JirikiSection.vue'
import { ref, computed } from 'vue'
import { useFilterStore } from '@/stores/filterStore'
import { useUiStore } from '@/stores/uiStore'
import { mockSongs } from '@/mock/mockSongs'
import { rankDisplay } from '@/utils/rank'
import type { Song } from '@/types'

const filterStore = useFilterStore()
const uiStore = useUiStore()
const mode = computed(() => uiStore.mode)

const allSongs = ref<Song[]>(mockSongs)

// FC or 未FC 判定
const isFC = (song: Song): boolean => {
  return song.fc || song.rank === '100%'
}

// 🎯 統一されたランク表示 + FC フィルター
const filteredSongs = computed(() => {
  return allSongs.value.filter((song) => {
    const display = rankDisplay(song.rank, mode.value)

    const matchRank =
      filterStore.selectedRanks.length === 0 ||
      filterStore.selectedRanks.includes(display)

    const matchFC =
      (filterStore.showFC && isFC(song)) ||
      (filterStore.showNotFC && !isFC(song) && song.rank !== '100%')

    return matchRank && matchFC
  })
})

// 地力ランク別に分類
const jirikiTiers = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C', 'D', 'E', 'F']

const songsByTier = computed(() =>
  jirikiTiers.map((tier) => ({
    tierName: tier,
    songs: filteredSongs.value.filter((song) => song.tier === tier),
  }))
)
</script>

<style scoped>
.tier-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.jirikis {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>
