// src/stores/scoreStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Score } from '@/types'
import { fetchUserSongScores, updateScore, createScore /* ★ getScoreById を後述で追加可 */ } from '@/api/scoreApi'
import { useAuthStore } from './authStore'
import Papa from 'papaparse'

export const useScoreStore = defineStore('score', () => {
  const scores = ref<Score[]>([])
  const loading = ref(false)

  // ✅ スコア一覧を取得して保存
  const loadScores = async (userId?: number) => {
    const uid = userId ?? useAuthStore().user?.id
    if (!uid) {
      if (import.meta.env.DEV) console.warn('loadScores: user ID が不正です')
      return
    }

    loading.value = true
    try {
      const raw = await fetchUserSongScores(uid)
      scores.value = raw
        .map((item: any) => ({
          id: item.score_id ?? -1 * item.song_id,   // スコア未登録なら仮ID
          user_id: uid,
          rank: item.rank ?? '',
          fc: Boolean(item.fc ?? false),
          memo: item.memo ?? null,                  // ★ APIが返す memo を保持
          song: {
            id: item.song_id,
            title: item.title,
            jiriki_rank: item.jiriki_rank,
          },
        }))
        .sort((a, b) => a.song.id - b.song.id)

      if (import.meta.env.DEV) {
        console.log(`✅ 合成スコア取得: ${scores.value.length}件`)
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('❌ ユーザー楽曲スコア取得に失敗', err)
    } finally {
      loading.value = false
    }
  }

  // ✅ 単一スコアをローカル更新（存在すればマージ）
  const upsertLocal = (updated: Partial<Score> & { id: number }) => {
    const i = scores.value.findIndex(s => s.id === updated.id)
    if (i !== -1) {
      scores.value[i] = { ...scores.value[i], ...updated }
    } else {
      // ない場合は追加
      scores.value.push(updated as Score)
    }
  }

  // ✅ スコアを更新（PUTリクエスト）
  //    rank/fc/memo のいずれかのみの部分更新OK
  const saveScore = async (
    scoreId: number,
    data: { rank?: string | null; fc?: boolean | number; memo?: string | null } // ★ memo対応 & 部分更新
  ) => {
    try {
      if (scoreId < 0) {
        // 新規スコア作成（仮ID経由）
        const original = scores.value.find(s => s.id === scoreId)
        if (!original) return

        const newScore = await createScore({
          user_id: original.user_id!,
          song_id: original.song.id,
          rank: data.rank ?? original.rank ?? '',
          fc: typeof data.fc === 'boolean' ? data.fc : Boolean(original.fc ?? false),
          memo: data.memo ?? original.memo ?? null, // ★ memoも作成時に送る
        })

        // 反映（仮IDから本物IDへ置き換え、memo含め更新）
        original.id    = newScore.id
        original.rank  = newScore.rank
        original.fc    = Boolean(newScore.fc)
        original.memo  = newScore.memo ?? null      // ★
        if (import.meta.env.DEV) console.log(`✅ 新規スコア登録`, newScore)
        return newScore
      } else {
        // 通常更新
        const res = await updateScore(scoreId, data)   // ★ APIは最新scoreを返す想定（memo含む）
        const updated = res?.data ?? {}
        const target = scores.value.find(s => s.id === scoreId)
        if (target) {
          if ('rank' in data) target.rank = data.rank ?? ''
          if ('fc'   in data) target.fc   = typeof data.fc === 'boolean' ? data.fc : Boolean(data.fc)
          if ('memo' in data) target.memo = data.memo ?? null
          // サーバーが正を返したらサーバー値で上書き（型/正規化対策）
          if (updated) {
            if (updated.rank !== undefined) target.rank = updated.rank
            if (updated.fc   !== undefined) target.fc   = Boolean(updated.fc)
            if (updated.memo !== undefined) target.memo = updated.memo ?? null
          }
        }
        if (import.meta.env.DEV) console.log(`✅ スコア更新: scoreId=${scoreId}`, data)
        return updated
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error(`❌ スコア保存失敗: scoreId=${scoreId}`, err)
      throw err
    }
  }

  // （任意）サーバの最新を再取得したい時に使う
  // const reloadScore = async (id: number) => {
  //   const res = await getScoreById(id)           // ★ scoreApi に GET /api/scores/:id を用意すれば使える
  //   upsertLocal(res.data)
  //   return res.data
  // }

  const loadScoresForGuest = async () => {
    try {
      const res = await fetch('/songsTable.csv')
      const csv = await res.text()
      // 型 Song は既存の定義を利用してください（または any でOK）
      const parsed = Papa.parse(csv, { header: true }).data as any[]

      // 仮の Score[] に変換
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
        memo: null,                                   // ★ 追加
      }))

      if (import.meta.env.DEV) {
        console.log('✅ ゲスト用スコア読み込み完了:', scores.value.length, '曲')
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('❌ songsTable.csv の読み込み失敗', err)
      scores.value = []
    }
  }

  return {
    scores,
    loading,
    loadScores,
    saveScore,
    // reloadScore, // ★ 必要なら公開
    loadScoresForGuest,
  }
})
