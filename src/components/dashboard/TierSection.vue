<template>
    <div class="tier-section">
      <!-- ✅ フィルターパネル -->
      <FilterPanel />
  
      <!-- ✅ 地力別セクション（10段階） -->
      <div class="jiriki-container">
        <JirikiSection
          v-for="group in jirikiGroups"
          :key="group.tier"
          :tier="group.tier"
          :songs="group.songs"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import FilterPanel from '@/components/filter/FilterPanel.vue'
  import JirikiSection from '@/components/jiriki/JirikiSection.vue'
  import { useFilterStore } from '@/stores/filterStore'
  import { useUiStore } from '@/stores/uiStore'
  import { rankDisplay } from '@/utils/rank' 
  
// ✅ 曲データ型
interface Song {
    id: number
    title: string
    jiriki_rank: string
    rank: string
    fc: boolean
}
  
const props = defineProps<{
    songs: Song[]
}>()
  
const filterStore = useFilterStore()

const uiStore = useUiStore()
const mode = computed(() => uiStore.mode)
  
// ✅ モード・ランク・FCでフィルタリング
const filteredSongs = computed(() =>
  props.songs.filter(song => {
    const display = rankDisplay(song.rank, mode.value)

    const rankOk =
      filterStore.selectedRanks.length === 0 ||
      filterStore.selectedRanks.includes(display)

    const fcOk =
      (song.fc && filterStore.showFC) ||
      (!song.fc && filterStore.showNotFC)

    return rankOk && fcOk
  })
)
  
  // ✅ 地力ランク一覧（S+ ～ F）
  const jirikiScale = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C', 'D', 'E', 'F']
  
  // ✅ 地力ごとにグルーピング
  const jirikiGroups = computed(() =>
    jirikiScale.map(tier => ({
      tier,
      songs: filteredSongs.value.filter(song => song.jiriki_rank === tier)
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
  