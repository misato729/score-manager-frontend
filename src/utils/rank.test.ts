import { describe, it, expect } from 'vitest'
import {
  getRankColor,
  getFCColor,
  rankDisplay,
  isRankGreaterOrEqual,
  NormalRankScale,
  ExpertRankScale,
  ProRankScale,
  getRankScale,
  parseMode,
} from '@/utils/rank'

describe('modeとランクスケール', () => {
  it('Proは99.0%以上を0.1%単位と99.0%未満で管理する', () => {
    expect(ProRankScale).toEqual([
      '100%', '99.9%', '99.8%', '99.7%', '99.6%', '99.5%',
      '99.4%', '99.3%', '99.2%', '99.1%', '99.0%', '<99.0%',
    ])
  })

  it('各モードに対応するランクスケールを返す', () => {
    expect(getRankScale('Normal')).toEqual(NormalRankScale)
    expect(getRankScale('Expert')).toEqual(ExpertRankScale)
    expect(getRankScale('Pro')).toEqual(ProRankScale)
  })

  it('有効なクエリ値だけをモードとして採用する', () => {
    for (const mode of ['Normal', 'Expert', 'Pro'] as const) {
      expect(parseMode(mode)).toBe(mode)
    }
    for (const value of [undefined, null, '', 'pro', 'normal', 'EXPERT', 'Unknown', ['Pro'], ['Pro', 'Expert'], 1]) {
      expect(parseMode(value)).toBe('Normal')
    }
  })
})

describe('getRankColor', () => {
  it('既知のランクは想定カラーを返す', () => {
    expect(getRankColor('AAA+')).toBe('#FF005C')
    expect(getRankColor('AAA')).toBe('#FF41B1')
    expect(getRankColor('AA')).toBe('#FF8500')
    expect(getRankColor('A')).toBe('#FFB800')
    expect(getRankColor('B')).toBe('#00B0FF')
    expect(getRankColor('C')).toBe('#A847E6')
    expect(getRankColor('100%')).toBe('#E6B422')
  })

  it('未知のランクはデフォルト色を返す', () => {
    expect(getRankColor('UNKNOWN')).toBe('#f2f2f2')
  })

  it('Proの12段階に別々の色を割り当て、100%は既存の金色を使う', () => {
    const colors = ProRankScale.map(getRankColor)
    colors.forEach(color => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      expect(color).not.toBe('#f2f2f2')
    })
    expect(new Set(colors).size).toBe(12)
    expect(getRankColor('100%')).toBe('#E6B422')
  })
})

describe('getFCColor', () => {
  it('FC/未FC を判定する', () => {
    expect(getFCColor('FC')).toBe('#ffb6c1')
    expect(getFCColor('未FC')).toBe('#cccccc')
  })

  it('未知のラベルはデフォルト色を返す', () => {
    expect(getFCColor('???')).toBe('#eeeeee')
  })
})

describe('rankDisplay', () => {
  it('Normal: %ランクはすべて AAA+ にマスク', () => {
    ;['95%', '96%', '97%', '98%', '99%', '100%'].forEach((r) => {
      expect(rankDisplay(r, 'Normal')).toBe('AAA+')
    })
    // 通常ランクはそのまま
    NormalRankScale.forEach((r) => {
      expect(rankDisplay(r as string, 'Normal')).toBe(r)
    })
  })

  it('Expert: AAA+ は 95% として表示。それ以外はそのまま', () => {
    expect(rankDisplay('AAA+', 'Expert')).toBe('95%')
    ExpertRankScale.forEach((r) => {
      expect(rankDisplay(r, 'Expert')).toBe(r)
    })
  })

  it('Proの小数ランクはNormalでAAA+、Expertで99%にまとめる', () => {
    const decimalRanks = ProRankScale.filter(rank => /^99\.\d%$/.test(rank))
    decimalRanks.forEach(rank => {
      expect(rankDisplay(rank, 'Normal')).toBe('AAA+')
      expect(rankDisplay(rank, 'Expert')).toBe('99%')
    })
  })

  it('Pro: 既存99%は99.0%、既知の下位ランクは99.0%未満として表示する', () => {
    expect(rankDisplay('99%', 'Pro')).toBe('99.0%')
    for (const rank of [...NormalRankScale, '95%', '96%', '97%', '98%']) {
      expect(rankDisplay(rank, 'Pro')).toBe('<99.0%')
    }
    ProRankScale.forEach(rank => {
      expect(rankDisplay(rank, 'Pro')).toBe(rank)
    })
  })

  it('未入力はどのモードでも未入力のままにする', () => {
    for (const mode of ['Normal', 'Expert', 'Pro'] as const) {
      expect(rankDisplay('', mode)).toBe('')
      expect(rankDisplay(null, mode)).toBe('')
      expect(rankDisplay(undefined, mode)).toBe('')
    }
  })

  it('保存された99.0%未満からNormalやExpertのランクを推測しない', () => {
    expect(rankDisplay('<99.0%', 'Normal')).toBe('<99.0%')
    expect(rankDisplay('<99.0%', 'Expert')).toBe('<99.0%')
  })
})

describe('isRankGreaterOrEqual', () => {
  it('順序付けに従って比較できる', () => {
    expect(isRankGreaterOrEqual('AAA', 'AA')).toBe(true)
    expect(isRankGreaterOrEqual('AA', 'AAA')).toBe(false)
    expect(isRankGreaterOrEqual('99%', '98%')).toBe(true)
    expect(isRankGreaterOrEqual('95%', 'AAA+')).toBe(true) // 7 >= 6
    expect(isRankGreaterOrEqual('AAA+', 'AAA+')).toBe(true)
  })

  it('未知のランクはスコア0扱い（最弱）', () => {
    expect(isRankGreaterOrEqual('AAA', '???')).toBe(true)  // 既知(>0) >= 0
    expect(isRankGreaterOrEqual('???', 'AAA')).toBe(false) // 0 >= 既知(>0) は false
    expect(isRankGreaterOrEqual('???', '???')).toBe(true)  // 0 >= 0
  })

  it('旧99%と99.0%を同じ達成度として扱う', () => {
    expect(isRankGreaterOrEqual('99%', '99.0%')).toBe(true)
    expect(isRankGreaterOrEqual('99.0%', '99%')).toBe(true)
    expect(isRankGreaterOrEqual('99%', '99.1%')).toBe(false)
  })

  it('小数ランクを0.1%刻みで比較し、100%を最上位にする', () => {
    const ranks = ProRankScale.filter(rank => rank !== '<99.0%')
    for (let higherIndex = 0; higherIndex < ranks.length; higherIndex++) {
      for (let lowerIndex = 0; lowerIndex < ranks.length; lowerIndex++) {
        expect(isRankGreaterOrEqual(ranks[higherIndex], ranks[lowerIndex]))
          .toBe(higherIndex <= lowerIndex)
      }
    }
  })

  it('99.0%未満は記録済みだが、既存の最低ランクC達成とは断定しない', () => {
    expect(isRankGreaterOrEqual('<99.0%', '')).toBe(true)
    expect(isRankGreaterOrEqual('', '<99.0%')).toBe(false)
    expect(isRankGreaterOrEqual('C', '<99.0%')).toBe(true)
    expect(isRankGreaterOrEqual('<99.0%', 'C')).toBe(false)
  })
})
