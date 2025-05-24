# ProgressSection.vue 設計書

## 1. 概要

`ProgressSection.vue` は、スコア管理アプリにおける目標ランクに対する達成状況を表示するコンポーネントです。全体および地力Tier別の進捗を `ProgressBar.vue` を使って可視化します。

## 2. 使用コンポーネント

| コンポーネント名       | 役割                        |
|------------------------|-----------------------------|
| RankSelect.vue         | 目標ランク選択プルダウン    |
| ProgressBar.vue        | 達成率バーの表示（全体・各Tier） |

## 3. Props / Emits

| 項目   | 内容 |
|--------|------|
| Props  | なし |
| Emits  | なし |

## 4. 使用ストア（Pinia）

| ストア名      | 用途                         | 備考                           |
|---------------|------------------------------|--------------------------------|
| uiStore       | `mode`, `selectedRank`       | モードと選択ランクの取得に使用 |
| filterStore   | `selectedRanks`, `showFC` 等 | 楽曲表示条件の判定に使用       |

## 5. 内部状態・ロジック

| 変数名           | 内容                              |
|------------------|-----------------------------------|
| `showDetail`     | Tier別詳細表示のトグル             |
| `filteredSongs`  | FC・ランクによって絞られた楽曲配列 |
| `isAchieved()`   | 楽曲が目標ランク以上かどうか判定  |
| `jirikiProgress` | Tierごとの達成数・総数             |
| `totalAchieved`  | 全体の達成数                       |
| `totalSongs`     | 全体の対象楽曲数                   |
| `percentDisplay` | 達成率（百分率）                   |

## 6. UI構成

- RankSelect による目標ランク選択
- 達成数と総数の表示（例: 42 / 126 (33%)）
- ProgressBar による進捗バー（全体 + 各Tier：S+〜F）
- 「詳細表示 / 詳細非表示」トグルボタン
- フェードトランジションで Tier 別バーを開閉

## 7. スタイリングルール

```css
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
