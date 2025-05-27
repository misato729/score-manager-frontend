import { NormalRankScale, ExpertRankScale } from '@/utils/rank'

export type Mode = 'Normal' | 'Expert'
export type Rank = typeof NormalRankScale[number] | typeof ExpertRankScale[number]

export interface Song {
  id: number
  title: string
  jiriki_rank: string
}

export interface Score {
  id: number
  user_id: number | null
  song_id: number
  rank: string | null
  fc: boolean
  created_at: string
  updated_at: string
  song: Song
}
