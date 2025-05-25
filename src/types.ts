import { NormalRankScale, ExpertRankScale } from '@/utils/rank'

export type Mode = 'Normal' | 'Expert'
export type Rank = typeof NormalRankScale[number] | typeof ExpertRankScale[number]

export interface Song {
  id?: number
  title: string
  rank: string 
  fc: boolean
  jiriki_rank: string
}

  