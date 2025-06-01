<template>
  <div class="jiriki-section">
    <!-- ✅ 地力ランク名（セクションタイトル） -->
    <h3 class="tier-title">地力{{ tierName }}</h3>

    <!-- ✅ スコアカードグリッド -->
    <div class="song-grid">
      <SongCard
        v-for="score in scores"
        :key="score.song.id"
        :score="score"
        :editable="editable"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SongCard from './SongCard.vue'
import type { Score } from '@/types'

const props = defineProps<{
  tierName: string
  scores: Score[]
  editable: boolean
}>()
</script>

<style scoped>
.jiriki-section {
  padding-top: 16px;
}

.tier-title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.song-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr)); /* 5列で均等縮小 */
  gap: 24px;
  width: 100%;
}


.song-card {
  width: 100%; /* 親の1fr幅に合わせる */
  aspect-ratio: 1 / 1;
  max-width: unset; /* ← 必ず上書き！ */
}

@media (max-width: 400px) {
  .song-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

</style>
