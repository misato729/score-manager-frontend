<template>
  <div class="jiriki-section">
    <!-- ✅ 地力ランク名（セクションタイトル） -->
    <h3 class="tier-title">地力{{ tier }}</h3>

    <!-- ✅ 曲カードグリッド（0件でもセクション表示） -->
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
import SongCard from './SongCard.vue'

interface Song {
  id: number
  title: string
  jiriki_rank: string
  rank: string
  fc: boolean
}

const props = defineProps<{
  tier: string
  songs: Song[]
}>()
</script>

<style scoped>
.jiriki-section {
  padding-top: 16px;
}

.tier-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
  text-align: center;
}

.song-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap: 12px;
}
</style>
