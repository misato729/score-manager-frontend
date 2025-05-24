import type { Mode } from '@/types'

/**
 * ランクスケール定義
 */
export const NormalRankScale = ['AAA+', 'AAA', 'AA', 'A', 'B', 'C'] as const
export const ExpertRankScale = ['100%', '99%', '98%', '97%', '96%', '95%', 'AAA', 'AA', 'A', 'B', 'C'] as const

/**
 * ランクカラー定義
 */
export const RankColors: Record<string, string> = {
  'C': '#A847E6',
  'B': '#00B0FF',
  'A': '#FFB800',
  'AA': '#FF8500',
  'AAA': '#FF41B1',
  'AAA+': '#FF005C',
  '95%': '#FF005C',
  '96%': '#e60092',
  '97%': '#cd00c9',
  '98%': '#B400FF',
  '99%': '#A9A9F5',
  '100%': '#E6B422',
}

export const getRankColor = (rank: string): string => {
  return RankColors[rank] || '#ccc'
}

/**
 * FCカラー定義
 */
export const FCColors: Record<string, string> = {
  FC: '#ffb6c1',
  未FC: '#cccccc',
}

export function getFCColor(label: string): string {
  return FCColors[label] || '#eeeeee'
}

/**
 * 表示ランク（モードに応じて）
 * Normalモードでは 95%以上 を 'AAA+' にマスクする
 */
export const rankDisplay = (rank: string, mode: Mode): string => {
  const masked = ['95%', '96%', '97%', '98%', '99%', '100%']
  return mode === 'Normal' && masked.includes(rank) ? 'AAA+' : rank
}

/**
 * 文字列比較用（未使用化予定）
 */
export function compareRank(a: string, b: string, mode: Mode = 'Expert'): number {
  const scale = mode === 'Expert' ? ExpertRankScale : NormalRankScale
  const ai = scale.indexOf(a)
  const bi = scale.indexOf(b)
  if (ai === -1 || bi === -1) return 0
  return ai - bi
}

/**
 * スコア数値定義（ランク → 数値化）
 */
export const RankScoreMap: Record<string, number> = {
  'C': 1,
  'B': 2,
  'A': 3,
  'AA': 4,
  'AAA': 5,
  'AAA+': 6,
  '95%': 7,
  '96%': 8,
  '97%': 9,
  '98%': 10,
  '99%': 11,
  '100%': 12,
}

/**
 * 数値比較用：rankA >= rankB のとき true
 */
export const isRankGreaterOrEqual = (rankA: string, rankB: string): boolean => {
  const a = RankScoreMap[rankA] ?? 0
  const b = RankScoreMap[rankB] ?? 0
  return a >= b
}
