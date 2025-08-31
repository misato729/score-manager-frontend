import { describe, it, expect } from 'vitest'
import {
  getRankColor,
  getFCColor,
  rankDisplay,
  isRankGreaterOrEqual,
  NormalRankScale,
  ExpertRankScale,
} from '@/utils/rank'

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
      // Expert 側の % や通常ランクは変換しない
      if (r !== 'AAA+') {
        expect(rankDisplay(r as string, 'Expert')).toBe(r)
      }
    })
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
})
