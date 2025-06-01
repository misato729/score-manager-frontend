import api from './axios'  // ← 共通axiosインスタンスをimport
import type { Score } from '@/types'

// ✅ ユーザーごとのスコア一覧を取得
export const fetchUserSongScores = async (userId: number) => {
  const response = await api.get(`/api/user-scores?user=${userId}`)
  return response.data
}


// ✅ スコアを更新（ランク or FC）
export const updateScore = async (scoreId: number, data: { rank: string | null; fc: boolean }) => {
    const response = await api.put(`/api/scores/${scoreId}`, data)
    return response.data
  }


// ✅ スコアを新規作成
export const createScore = async (data: {
  user_id: number
  song_id: number
  rank: string | null
  fc: boolean
}) => {
  const response = await api.post('/api/scores', data)
  return response.data
}
  