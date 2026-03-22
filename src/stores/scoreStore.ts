import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Score } from '@/types'
import { fetchUserSongScores, updateScore, createScore } from '@/api/scoreApi'
import { useAuthStore } from './authStore'
import Papa from 'papaparse'

export const useScoreStore = defineStore('score', () => {
  const scores = ref<Score[]>([])
  const loading = ref(false)
  const displayUserName = ref('')

  const loadScores = async (userId?: number) => {
    const uid = userId ?? useAuthStore().user?.id
    if (!uid) {
      if (import.meta.env.DEV) console.warn('loadScores: user ID が不正です')
      displayUserName.value = ''
      return
    }

    loading.value = true
    try {
      const raw = await fetchUserSongScores(uid)

      displayUserName.value = raw[0]?.user_name ?? ''

      scores.value = raw
        .map((item: any) => ({
          id: item.score_id ?? -1 * item.song_id,
          user_id: uid,
          rank: item.rank ?? '',
          fc: Boolean(item.fc ?? false),
          memo: item.memo ?? null,
          song: {
            id: item.song_id,
            title: item.title,
            jiriki_rank: item.jiriki_rank,
          },
        }))
        .sort((a, b) => a.song.id - b.song.id)

      if (import.meta.env.DEV) {
        console.log(`✅ 合成スコア取得: ${scores.value.length}件`)
        console.log(`✅ displayUserName: ${displayUserName.value}`)
      }
    } catch (err) {
      displayUserName.value = ''
      if (import.meta.env.DEV) console.error('❌ ユーザー楽曲スコア取得に失敗', err)
    } finally {
      loading.value = false
    }
  }

  const upsertLocal = (updated: Partial<Score> & { id: number }) => {
    const i = scores.value.findIndex(s => s.id === updated.id)
    if (i !== -1) {
      scores.value[i] = { ...scores.value[i], ...updated }
    } else {
      scores.value.push(updated as Score)
    }
  }

  const saveScore = async (
    scoreId: number,
    data: { rank?: string | null; fc?: boolean | number; memo?: string | null }
  ) => {
    try {
      if (scoreId < 0) {
        const original = scores.value.find(s => s.id === scoreId)
        if (!original) return

        const newScore = await createScore({
          user_id: original.user_id!,
          song_id: original.song.id,
          rank: data.rank ?? original.rank ?? '',
          fc: typeof data.fc === 'boolean' ? data.fc : Boolean(original.fc ?? false),
          memo: data.memo ?? original.memo ?? null,
        })

        original.id = newScore.id
        original.rank = newScore.rank
        original.fc = Boolean(newScore.fc)
        original.memo = newScore.memo ?? null
        return newScore
      } else {
        const res = await updateScore(scoreId, data)
        const updated = res?.data ?? {}
        const target = scores.value.find(s => s.id === scoreId)

        if (target) {
          if ('rank' in data) target.rank = data.rank ?? ''
          if ('fc' in data) target.fc = typeof data.fc === 'boolean' ? data.fc : Boolean(data.fc)
          if ('memo' in data) target.memo = data.memo ?? null

          if (updated) {
            if (updated.rank !== undefined) target.rank = updated.rank
            if (updated.fc !== undefined) target.fc = Boolean(updated.fc)
            if (updated.memo !== undefined) target.memo = updated.memo ?? null
          }
        }

        return updated
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error(`❌ スコア保存失敗: scoreId=${scoreId}`, err)
      throw err
    }
  }

  const loadScoresForGuest = async () => {
    try {
      const res = await fetch('/songsTable.csv')
      const csv = await res.text()
      const parsed = Papa.parse(csv, { header: true }).data as any[]

      displayUserName.value = ''

      scores.value = parsed.map((song, index) => ({
        id: -1 * (index + 1),
        song: {
          id: Number(song.id),
          title: song.title,
          jiriki_rank: song.jiriki_rank,
        },
        user_id: null,
        rank: '',
        fc: false,
        memo: null,
      }))
    } catch (err) {
      if (import.meta.env.DEV) console.error('❌ songsTable.csv の読み込み失敗', err)
      displayUserName.value = ''
      scores.value = []
    }
  }

  return {
    scores,
    loading,
    displayUserName,
    loadScores,
    saveScore,
    loadScoresForGuest,
  }
})