# ProgressBar.vue 設計書

## 1. 概要

`ProgressBar.vue` は、特定Tierの達成状況（例: S+ / S / A+など）を視覚的なバーで表現するシンプルなコンポーネントです。達成率に応じたバーの長さとカラーを表示し、達成数と総数をラベルで併記します。

## 2. Props

| プロパティ名   | 型       | 必須 | 説明                                   |
|----------------|----------|------|----------------------------------------|
| `tier`         | `string` | ✅   | 対象となる地力Tier名（例：S+, Aなど） |
| `achieved`     | `number` | ✅   | 達成済み曲数                           |
| `total`        | `number` | ✅   | 対象曲数                               |
| `rank`         | `string` | ❌   | 現在の目標ランク（色指定用）           |
| `showDetail`   | `boolean`| ❌   | 詳細スロットの表示有無（デフォルト非表示）|

## 3. 使用ユーティリティ

| モジュール        | 関数名          | 役割                      |
|-------------------|------------------|---------------------------|
| `@/utils/rank.ts` | `getRankColor()` | 指定されたランクに応じたバーの色を返す |

## 4. 内部ロジック

| 変数名      | 内容                                           |
|-------------|------------------------------------------------|
| `percentage`| `achieved / total` をパーセントで計算した結果  |
| `barColor`  | `rank` に応じて `getRankColor()` から取得      |

## 5. UI構成

- `tier-label`：地力Tier名（例：地力A+）
- `bar-wrapper`：進捗バー背景
- `bar-filled`：進捗バー（長さ・色は進捗に応じて変化）
- `count-label`：達成数/総数（例: 7 / 12）
- `slot`：詳細表示（オプション）

## 6. スタイリングルール

```css
.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  margin-bottom: 6px;
}

.tier-label {
  width: 80px;
  font-weight: bold;
  text-align: right;
  flex-shrink: 0;
}

.bar-wrapper {
  flex: 1;
  height: 10px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
}

.bar-filled {
  height: 100%;
  transition: width 0.3s ease;
}

.count-label {
  width: 60px;
  text-align: left;
  color: #555;
  font-size: 13px;
  flex-shrink: 0;
}

.detail-section {
  margin-top: 6px;
  font-size: 13px;
  color: #444;
}
