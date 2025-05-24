# RankSelect.vue 設計書

## 1. 概要

`RankSelect.vue` は、目標とするクリアランク（例：AAA, 97%, 100%など）を選択するためのセレクトボックスを提供するコンポーネントです。現在のモード（Normal / Expert）に応じて選択肢を切り替え、`uiStore.selectedRank` と双方向バインディングしています。

## 2. Props / Emits

| 項目   | 内容 |
|--------|------|
| Props  | なし |
| Emits  | なし（v-model で store に直接バインド） |

## 3. 使用ストア（Pinia）

| ストア名  | 管理内容          | 用途                                 |
|-----------|-------------------|--------------------------------------|
| `uiStore` | `mode`, `selectedRank` | 表示モード切替と現在の選択ランクを保持・更新 |

## 4. 使用ユーティリティ / 定数

| モジュール        | 変数 / 関数           | 用途                                |
|-------------------|------------------------|-------------------------------------|
| `@/utils/rank`    | `NormalRankScale`      | Normalモードのランクリスト         |
| `@/utils/rank`    | `ExpertRankScale`      | Expertモードのランクリスト         |

## 5. ロジック / 振る舞い

| 変数 / 関数名     | 役割                                                                 |
|-------------------|----------------------------------------------------------------------|
| `currentRanks`     | `mode` によって `NormalRankScale` または `ExpertRankScale` を選択   |
| `rankDisplay(rank)`| Normalモード時、`95%〜100%` は `AAA+` として表示（保存はしない）   |

## 6. UI構成

- `select` 要素でランクを選択
- `option` の表示は `rankDisplay()` により変換
- `v-model` で `uiStore.selectedRank` と双方向バインディング

## 7. スタイリングルール

```css
.rank-select select {
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 6px;
}
