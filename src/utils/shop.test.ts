// src/utils/shop.test.ts
import { describe, it, expect } from 'vitest'
import { extractPrefecture, getDistance } from './shop'

describe('extractPrefecture', () => {
  it('住所から都道府県名を抽出できる', () => {
    expect(extractPrefecture('東京都千代田区')).toBe('東京都')
    expect(extractPrefecture('北海道札幌市')).toBe('北海道')
    expect(extractPrefecture('京都府京都市')).toBe('京都府')
    expect(extractPrefecture('沖縄県那覇市')).toBe('沖縄県')
  })
  it('抽出できない場合は不明', () => {
    expect(extractPrefecture('Somewhere Over The Rainbow')).toBe('不明')
    expect(extractPrefecture('')).toBe('不明')
  })
})

describe('getDistance', () => {
  it('同一座標は 0m', () => {
    expect(getDistance(35, 135, 35, 135)).toBe(0)
  })
  it('距離は対称で正の値', () => {
    const a = getDistance(35.681236, 139.767125, 35.710063, 139.8107) // 東京駅→スカイツリー
    const b = getDistance(35.710063, 139.8107, 35.681236, 139.767125)
    expect(a).toBeGreaterThan(0)
    expect(Math.abs(a - b)).toBeLessThan(1e-6 * a)
  })
})
