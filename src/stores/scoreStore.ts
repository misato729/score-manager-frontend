import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Score } from '@/types'
import { fetchUserScores, updateScore } from '@/api/scoreApi'
import { useAuthStore } from './authStore'
import Papa from 'papaparse'

export const useScoreStore = defineStore('score', () => {
  const scores = ref<Score[]>([])
  const loading = ref(false)

  // ✅ スコア一覧を取得して保存
  const loadScores = async (userId?: number) => {
    // ✅ 渡された引数を優先し、未定義時のみ authStore を参照
    const uid = userId !== undefined ? userId : useAuthStore().user?.id
    if (!uid) {
      console.warn('loadScores: user ID が不正です')
      return
    }
  
    loading.value = true
    try {
      const data = await fetchUserScores(uid)
      scores.value = data
      console.log(`✅ スコア取得: ${data.length}件`)
    } catch (err) {
      console.error('❌ スコア取得に失敗', err)
    } finally {
      loading.value = false
    }
  }
  

  // ✅ スコアを更新（PUTリクエスト）
  const saveScore = async (scoreId: number, data: { rank: string | null; fc: boolean }) => {
    try {
      await updateScore(scoreId, data)
      const target = scores.value.find(s => s.id === scoreId)
      if (target) {
        target.rank = data.rank
        target.fc = data.fc
      }
      console.log(`✅ スコア更新: scoreId=${scoreId}`, data)
    } catch (err) {
      console.error(`❌ スコア更新失敗: scoreId=${scoreId}`, err)
    }
  }

const loadScoresForGuest = async () => {
    try {
      const res = await fetch('/songsTable.csv')
      const csv = await res.text()
      const parsed = Papa.parse(csv, { header: true }).data as Song[]
  
      // 仮の Score[] に変換
      scores.value = parsed.map((song, index) => ({
        id: -1 * (index + 1),      // 仮の一意なマイナスID
        song: {
          id: Number(song.id),
          title: song.title,
          jiriki_rank: song.jiriki_rank,
        },
        user_id: null,
        rank: '',
        fc: false,
      }))
  
      console.log('✅ ゲスト用スコア読み込み完了:', scores.value.length, '曲')
    } catch (err) {
      console.error('❌ songsTable.csv の読み込み失敗', err)
      scores.value = [] // フォールバック
    }
  }

  return {
    scores,
    loading,
    loadScores,
    saveScore,
    loadScoresForGuest
  }
})

  