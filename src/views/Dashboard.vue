<template>
  <div class="dashboard-wrapper">
    <!-- ✅ モード切替（右上） -->
    <div class="top-controls">
      <ModeSwitch />
    </div>

    <!-- ✅ タイトル -->
    <h1 class="page-title">レベル11難易度表</h1>

    <!-- ✅ Progress セクション -->
    <section class="card">
      <h2 class="section-title">Progress</h2>
      <ProgressSection
        :achieved="totalAchieved"
        :total="allSongs.length"
        :selectRank="uiStore.selectedRank"
        :allSongs="allSongs"
      />
    </section>

    <!-- ✅ Tier セクション -->
    <section class="card">
      <h2 class="section-title">Tier</h2>
      <TierSection :songs="filteredSongs" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Papa from 'papaparse'
import ModeSwitch from '@/components/common/ModeSwitch.vue'
import ProgressSection from '@/components/dashboard/ProgressSection.vue'
import TierSection from '@/components/dashboard/TierSection.vue'
import { useFilterStore } from '@/stores/filterStore'
import { rankDisplay } from '@/utils/rank'
import { useUiStore } from '@/stores/uiStore'

// ✅ 曲情報型
interface Song {
  id: number
  title: string
  jiriki_rank: string
  rank: string
  fc: boolean
}

// ✅ 全曲リスト（CSVから読み込み）
const allSongs = ref<Song[]>([])

// ✅ 仮ユーザーID（将来的にはログインと連動）
const currentUserId = '1'

// ✅ フィルター条件
const filterStore = useFilterStore()

// ✅ UIストアからモードを取得
const uiStore = useUiStore()
const mode = computed(() => uiStore.mode)

// ✅ CSVを読み込んで結合
onMounted(async () => {
  try {
    const [songsCsv, scoresCsv] = await Promise.all([
      fetch('/songsTable.csv').then(res => res.text()),
      fetch('/scoresTable.csv').then(res => res.text())
    ])

    const parsedSongs = Papa.parse(songsCsv, { header: true }).data
    const parsedScores = Papa.parse(scoresCsv, { header: true }).data

    allSongs.value = parsedSongs.map((song: any) => {
      const score = parsedScores.find(
        (s: any) =>
          String(s.song_id) === String(song.id) &&
          String(s.user_id) === currentUserId
      )

      return {
        id: Number(song.id),
        title: song.title,
        jiriki_rank: song.jiriki_rank,
        rank: score?.rank || '',
        fc: score?.fc === true || score?.fc === 'TRUE' || score?.fc === 'true'
      }
    })
  } catch (err) {
    console.error('CSVの読み込みまたは変換に失敗しました', err)
  }
})

// ✅ フィルター後の曲リスト
const filteredSongs = computed(() =>
  allSongs.value.filter(song => {
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

// ✅ 達成曲数 = rank が入力されている曲の数
const totalAchieved = computed(() =>
  allSongs.value.filter(song => song.rank !== '').length
)
</script>

<style scoped>
.dashboard-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
}

.top-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: bold;
  border-left: 8px solid #a48be0;
  padding-left: 12px;
  margin-bottom: 12px;
}

.card {
  background: #fff;
  max-width: 800px;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}
</style>
