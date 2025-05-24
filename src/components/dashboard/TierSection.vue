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
import { computed, ref } from 'vue'
import { mockSongs } from '@/mock/mockSongs'
import type { Song } from '@/types'

const allSongs = ref<Song[]>(mockSongs)

// 地力ランク別に分類（フィルターなしの全曲対象）
const jirikiTiers = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C', 'D', 'E', 'F']

const songsByTier = computed(() =>
  jirikiTiers.map((tier) => ({
    tierName: tier,
    songs: allSongs.value.filter((song) => song.tier === tier),
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
