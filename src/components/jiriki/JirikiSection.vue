<template>
  <div class="jiriki-section">
    <!-- Tier名の中央見出し -->
    <h3 class="tier-title">地力{{ tierName }}</h3>

    <!-- 曲カード一覧（最大5列） -->
    <div class="song-grid">
      <SongCard
        v-for="song in songs"
        :key="song.id"
        :song="song"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SongCard from '@/components/jiriki/SongCard.vue'
import type { Song } from '@/types'

defineProps<{
  tierName: string
  songs: Song[]
}>()
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
