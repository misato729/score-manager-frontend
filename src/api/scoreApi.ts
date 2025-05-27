import api from './axios'  // ← 共通axiosインスタンスをimport
import type { Score } from '@/types'

// ✅ ユーザーごとのスコア一覧を取得
export const fetchUserScores = async (userId: number): Promise<Score[]> => {
  const response = await api.get(`/api/scores/user/${userId}`)
  return response.data
}

// ✅ スコアを更新（ランク or FC）
export const updateScore = async (scoreId: number, data: { rank: string | null; fc: boolean }) => {
    const response = await api.put(`/api/scores/${scoreId}`, data)
    return response.data
  }
  