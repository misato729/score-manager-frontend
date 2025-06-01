import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Score } from '@/types'
import { fetchUserSongScores, updateScore, createScore } from '@/api/scoreApi'
import { useAuthStore } from './authStore'
import Papa from 'papaparse'

export const useScoreStore = defineStore('score', () => {
  const scores = ref<Score[]>([])
  const loading = ref(false)

  // ✅ スコア一覧を取得して保存
  const loadScores = async (userId?: number) => {
    const uid = userId ?? useAuthStore().user?.id
    if (!uid) {
      console.warn('loadScores: user ID が不正です')
      return
    }
  
    loading.value = true
    try {
      const raw = await fetchUserSongScores(uid)
      scores.value = raw.map((item: any) => ({
        id: item.score_id ?? -1 * item.song_id, // スコア未登録なら仮ID
        user_id: uid,
        rank: item.rank ?? '',
        fc: item.fc ?? false,
        song: {
          id: item.song_id,
          title: item.title,
          jiriki_rank: item.jiriki_rank,
        },
      }))
      .sort((a, b) => a.song.id - b.song.id)
      console.log(`✅ 合成スコア取得: ${scores.value.length}件`)
    } catch (err) {
      console.error('❌ ユーザー楽曲スコア取得に失敗', err)
    } finally {
      loading.value = false
    }
  }
  

  // ✅ スコアを更新（PUTリクエスト）
  const saveScore = async (scoreId: number, data: { rank: string | null; fc: boolean }) => {
    try {
      if (scoreId < 0) {
        // 新規スコア作成
        const original = scores.value.find(s => s.id === scoreId)
        if (!original) return
  
        const newScore = await createScore({
          user_id: original.user_id!,
          song_id: original.song.id,
          rank: data.rank,
          fc: data.fc,
        })
  
        // 反映（仮IDから本物IDへ）
        original.id = newScore.id
        original.rank = newScore.rank
        original.fc = newScore.fc
  
        console.log(`✅ 新規スコア登録`, newScore)
      } else {
        // 通常更新
        await updateScore(scoreId, data)
        const target = scores.value.find(s => s.id === scoreId)
        if (target) {
          target.rank = data.rank
          target.fc = data.fc
        }
        console.log(`✅ スコア更新: scoreId=${scoreId}`, data)
      }
    } catch (err) {
      console.error(`❌ スコア保存失敗: scoreId=${scoreId}`, err)
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

  