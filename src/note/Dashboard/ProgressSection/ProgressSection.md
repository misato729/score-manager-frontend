# ProgressSection.vue 設計書

## 1. 概要

`ProgressSection.vue` は、ユーザーが選択した「目標ランク」に基づいて、全体および地力Tierごとのスコア達成状況を表示するセクションです。達成率の視覚化には `ProgressBar.vue` を使用します。

---

## 2. 使用コンポーネント

| コンポーネント名       | 役割                           |
|------------------------|--------------------------------|
| `RankSelect.vue`       | 目標ランクを選択するプルダウン |
| `ProgressBar.vue`      | 達成状況をバーで表示           |

---

## 3. 使用ストア（Pinia）

| ストア名       | 管理内容                       |
|----------------|------------------------------|
| `uiStore`      | `mode`, `selectedRank`        |
| `filterStore`  | `selectedRanks`, `showFC`, `showNotFC` など |

---

## 4. 内部状態・ロジック

| 変数名               | 内容                                                                 |
|----------------------|----------------------------------------------------------------------|
| `selectedRank`        | 現在選択中のランク（例：96%）                                        |
| `selectedRankRaw`     | 比較用：NormalモードでAAA+が選ばれた場合のみ「95%」に補正           |
| `selectedRankForColor`| 色表示用：補正せずそのまま `ProgressBar` に渡す                     |
| `filteredSongs`       | 現在のフィルター（ランク＋FC条件）に一致する楽曲                     |
| `isAchieved(song)`    | 楽曲のrankが `selectedRankRaw` 以上かを `isRankGreaterOrEqual` で判定 |
| `totalAchieved`       | 達成済みの楽曲数                                                    |
| `totalSongs`          | フィルター後の全楽曲数                                               |
| `percentDisplay`      | 達成率（xx % 表示）                                                 |
| `jirikiProgress`      | 各Tierに対する達成/全体数                                            |

---

## 5. ランク補正ロジック

```ts
const selectedRankRaw = computed(() => {
  return mode.value === 'Normal' && selectedRank.value === 'AAA+'
    ? '95%'
    : selectedRank.value
})
Normalモードの AAA+ のみ補正対象
Expertモードでは補正せずそのまま使う

## 6. UI構成

ヘッダーに「目標ランク」として RankSelect を表示
進捗バーの直下に全体の ProgressBar
詳細表示がONのとき、地力Tier（S+〜F）ごとに ProgressBar を縦に並べて表示


7. スタイリング概要

css
コピーする
編集する
.progress-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.goal-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.label {
  font-weight: bold;
}

.count-display {
  font-size: 14px;
  color: #333;
}

.toggle-btn {
  background: #eee;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
}

.tier-progress-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

