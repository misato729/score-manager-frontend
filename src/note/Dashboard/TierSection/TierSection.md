# TierSection.vue 設計書

## 1. 概要

`TierSection.vue` は、楽曲を地力ランク（S+〜F）ごとに分類して表示するメインセクションです。  
ユーザーの選択したランク・FC条件に応じて、`JirikiSection.vue` を10セクションに分けて表示します。

---

## 2. 使用コンポーネント

| コンポーネント名       | 役割                                  |
|------------------------|---------------------------------------|
| `FilterPanel.vue`      | ランクとFC状態によるフィルターUI      |
| `JirikiSection.vue`    | Tierごとの楽曲群を表示（最大10個）     |

---

## 3. 使用ストア（Pinia）

| ストア名       | 用途                                               |
|----------------|----------------------------------------------------|
| `filterStore`  | `selectedRanks`, `showFC`, `showNotFC` の管理     |
| `uiStore`      | `mode`（Normal / Expert モード）の取得に使用      |

---

## 4. フィルタリングの流れ

1. `mockSongs` を元に全曲一覧を `allSongs` に保持
2. `filteredSongs` で以下の条件を満たす曲のみを抽出：
   - ランクが `filterStore.selectedRanks` に含まれている（または未指定）
   - FC or 未FC の条件に一致（100%は常にFC扱い）

3. `songsByTier` にて、フィルター後の曲を地力ランク（S+〜F）ごとに分類

---

## 5. ロジック詳細

### 🎯 FC判定関数

```ts
const isFC = (song: Song): boolean =>
  song.fc || song.rank === '100%'
```

### 🎯 フィルター処理

```ts
filteredSongs = allSongs.filter(song => {
  const display = rankDisplay(song.rank, mode.value)
  const matchRank = selectedRanks.includes(display) || 選択なし
  const matchFC = showFC / showNotFC のいずれかに合致
  return matchRank && matchFC
})
```

```ts
### 🎯 地力ランク別ソート
songsByTier = jirikiTiers.map(tier => ({
  tierName: tier,
  songs: filteredSongs.filter(song => song.tier === tier)
}))
```
---

## 6. UI構成

上部に FilterPanel.vue
下部に JirikiSection.vue を10セクション縦に並べる構造
各 JirikiSection は tierName とその Tier に属する songs を受け取って表示

## 7. スタイリング概要

.tier-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.jirikis {
  display: flex;
  flex-direction: column;
  gap: 32px;
}