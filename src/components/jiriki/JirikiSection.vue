<template>
    <div class="jiriki-section">
      <div
        v-for="tier in jirikiTiers"
        :key="tier.name"
        class="tier-block"
      >
        <h3 class="tier-title">{{ tier.name }}</h3>
        <div class="song-grid">
          <SongCard
            v-for="song in tier.songs"
            :key="song.id"
            :song="song"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import SongCard from '@/components/jiriki/SongCard.vue'
  
  interface Song {
    id: number
    title: string
    tier: string
  }
  
  interface TierGroup {
    name: string
    songs: Song[]
  }
  
  // ✅ Tierの並び順
  const tierOrder = ['地力S+', '地力S', '地力A+', '地力A', '地力B+', '地力B', '地力C', '地力D', '地力E', '地力F']
  
  // ✅ ダミーデータ生成
  let idCounter = 1
  const jirikiTiers: TierGroup[] = tierOrder.map((tier) => {
    const songs: Song[] = Array.from({ length: 6 }, (_, i) => ({
      id: idCounter++,
      title: `${tier} 曲 ${i + 1}`,
      tier,
    }))
    return {
      name: tier,
      songs,
    }
  })
  </script>
  
  <style scoped>
  .jiriki-section {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  
  .tier-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
    border-left: 6px solid #a48be0;
    padding-left: 10px;
  }
  
  /* ✅ 5列グリッド対応 */
  .song-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
  </style>
  