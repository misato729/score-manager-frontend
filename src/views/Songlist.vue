<template>
    <div class="top-wrapper">
      <header class="page-title">
        <h1>楽曲一覧</h1>
      </header>

      <!-- 忍者AdMax広告 -->
      <AdNinja />
  
      <section class="card" style="max-width: 800px">
        <div class="form-area">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="曲名で検索"
            class="search-box"
          />
  
          <select v-model="selectedRank" class="rank-select">
            <option value="">すべてのランク</option>
            <option v-for="rank in ranks" :key="rank" :value="rank">
              {{ rank }}
            </option>
          </select>
        </div>
  
        <table v-if="songs.length" class="song-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>曲名</th>
              <th>地力ランク</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="song in filteredSongs" :key="song.id">
              <td>{{ song.id }}</td>
              <td>{{ song.title }}</td>
              <td>{{ song.jiriki_rank }}</td>
            </tr>
          </tbody>
        </table>
  
        <p v-else>読み込み中...</p>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import Papa from 'papaparse'
  
  type Song = {
    id: number
    title: string
    jiriki_rank: string
  }
  
  const songs = ref<Song[]>([])
  const searchQuery = ref('')
  const selectedRank = ref('')
  
  const ranks = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C', 'D', 'E', 'F']
  
  // CSV読み込み処理
  onMounted(() => {
  Papa.parse('/songsTable.csv', {
    header: true,
    download: true,
    complete: (results) => {
      songs.value = (results.data as any[])
        .filter((s) => s.id && s.title && s.jiriki_rank)
        .map((s) => ({
          id: Number(s.id),
          title: s.title,
          jiriki_rank: s.jiriki_rank,
        }))
    },
  })
})

  
  const filteredSongs = computed(() => {
    return songs.value.filter((song) => {
      const matchesTitle = song.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesRank = !selectedRank.value || song.jiriki_rank === selectedRank.value
      return matchesTitle && matchesRank
    })
  })
  </script>
  
  <style scoped>
.top-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff, #ffece6, #e8fff2);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
}

.page-title {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 24px;
}

.page-title h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-title h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #444;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
}

.form-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.search-box,
.rank-select {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.song-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.song-table thead {
  background-color: #f0f0f0;
}

.song-table th,
.song-table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.song-table tbody tr:hover {
  background-color: #f9f9f9;
}

  </style>
  