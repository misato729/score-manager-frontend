import type { Mode } from '@/types/mode'

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
  return RankColors[rank] || '#f2f2f2'
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

  // ✅ Normalでは %ランクをすべて AAA+ にマスク
  if (mode === 'Normal' && masked.includes(rank)) {
    return 'AAA+'
  }

  // ✅ Expertでは AAA+ を見た目上 95% に変換
  if (mode === 'Expert' && rank === 'AAA+') {
    return '95%'
  }

  return rank
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
