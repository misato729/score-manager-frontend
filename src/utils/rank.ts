import type { Mode } from '@/types'

/**
 * ランクスケール定義
 */
export const NormalRankScale = ['AAA+', 'AAA', 'AA', 'A', 'B', 'C'] as const
export const ExpertRankScale = ['100%', '99%', '98%', '97%', '96%', '95%', 'AAA', 'AA', 'A', 'B', 'C'] as const
export const ProRankScale = ['100%', '99.9%', '99.8%', '99.7%', '99.6%', '99.5%', '99.4%', '99.3%', '99.2%', '99.1%', '99.0%', '<99.0%'] as const

export function getRankScale(mode: Mode) {
  if (mode === 'Pro') return ProRankScale
  return mode === 'Expert' ? ExpertRankScale : NormalRankScale
}

export function parseMode(value: unknown): Mode {
  return value === 'Expert' || value === 'Pro' ? value : 'Normal'
}

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
  // Pro: 色相0°→270°を30°刻み（赤→黄→緑→青→紫）、彩度75%・明度76%。
  '99.0%': '#F09494',
  '99.1%': '#F0C294',
  '99.2%': '#F0F094',
  '99.3%': '#C2F094',
  '99.4%': '#94F094',
  '99.5%': '#94F0C2',
  '99.6%': '#94F0F0',
  '99.7%': '#94C2F0',
  '99.8%': '#9494F0',
  '99.9%': '#C294F0',
  '<99.0%': '#cccccc',
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
 * 保存値は変えず、モードに応じた粒度で表示する。
 */
export const rankDisplay = (rank: string | null | undefined, mode: Mode): string => {
  if (!rank) return ''
  const isProPercentage = ProRankScale.some(value => value === rank) && rank !== '<99.0%'

  if (mode === 'Normal' && (ExpertRankScale.slice(0, 6).some(value => value === rank) || isProPercentage)) {
    return 'AAA+'
  }
  if (mode === 'Expert') {
    if (rank === 'AAA+') return '95%'
    if (isProPercentage && rank !== '100%') return '99%'
  }
  if (mode === 'Pro') {
    if (rank === '99%') return '99.0%'
    if (NormalRankScale.some(value => value === rank) || ExpertRankScale.slice(2).some(value => value === rank)) {
      return '<99.0%'
    }
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
  '99.0%': 11,
  '99.1%': 11.1,
  '99.2%': 11.2,
  '99.3%': 11.3,
  '99.4%': 11.4,
  '99.5%': 11.5,
  '99.6%': 11.6,
  '99.7%': 11.7,
  '99.8%': 11.8,
  '99.9%': 11.9,
  // 下限が不明なため、C以上の達成とはみなさない。
  '<99.0%': 0.5,
}

/**
 * 数値比較用：rankA >= rankB のとき true
 */
export const isRankGreaterOrEqual = (rankA: string | null | undefined, rankB: string): boolean => {
  const a = RankScoreMap[rankA ?? ''] ?? 0
  const b = RankScoreMap[rankB] ?? 0
  return a >= b
}
