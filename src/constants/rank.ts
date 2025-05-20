export const NormalRankScale = ['AAA+', 'AAA', 'AA', 'A', 'B', 'C'] as const;
export const ExpertRankScale = ['100%', '99%', '98%', '97%', '96%', '95%', 'AAA', 'AA', 'A', 'B', 'C'] as const;

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
};

export const getRankColor = (rank: string): string => {
    return RankColors[rank] || '#ccc'
  }

export const FCColors: Record<string, string> = {
    FC: '#ffb6c1',
    未FC: '#cccccc' // 任意（未FCの色）
}

export function getFCColor(label: string): string {
  return FCColors[label] || '#eeeeee'
}