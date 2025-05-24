<template>
  <div class="jiriki-section">
    <!-- Tier名 -->
    <h3 class="tier-title">地力{{ tierName }}</h3>

    <!-- 曲グリッド or 空メッセージ -->
    <div class="song-grid">
      <template v-if="filteredSongs.length > 0">
        <SongCard
          v-for="song in filteredSongs"
          :key="song.id"
          :song="song"
        />
      </template>
      <template v-else>
        <p></p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import SongCard from '@/components/jiriki/SongCard.vue'
import { computed } from 'vue'
import { useFilterStore } from '@/stores/filterStore'
import { useUiStore } from '@/stores/uiStore'
import { rankDisplay } from '@/utils/rank'
import type { Song } from '@/types'

const props = defineProps<{
  tierName: string
  songs: Song[]
}>()

const filterStore = useFilterStore()
const uiStore     = useUiStore()
const mode        = computed(() => uiStore.mode)

// FC判定
const isFC = (song: Song): boolean =>
  song.fc || song.rank === '100%'

// 🎯 最終フィルタロジック
const filteredSongs = computed(() => {
  return props.songs.filter((song) => {
    // ■ モードに応じた表示用ラベル
    const label = rankDisplay(song.rank, mode.value)

    // ■ ランクフィルター
    // selectedRanks が空なら全表示、それ以外は「表示ラベル」でのみ判定
    const matchRank =
      filterStore.selectedRanks.length === 0 ||
      filterStore.selectedRanks.includes(label)

    // ■ FCフィルター
    // Pinia側で「両方OFFを防止」しているので、単純判定でOK
    const matchFC =
      (filterStore.showFC    && isFC(song)) ||
      (filterStore.showNotFC && !isFC(song))

    return matchRank && matchFC
  })
})
</script>

<style scoped>
.jiriki-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tier-title {
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 8px;
}

.song-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap: 20px;
}
</style>
