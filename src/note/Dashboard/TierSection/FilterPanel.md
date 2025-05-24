# FilterPanel.vue 設計書

## 1. 概要

`FilterPanel.vue` は、スコア一覧のフィルター機能を提供するUIコンポーネントです。  
ユーザーが表示するランク・FC状態（フルコンボ/未フルコンボ）を選択でき、モード（Normal / Expert）に応じてランクのリストが切り替わります。

---

## 2. 使用ストア（Pinia）

| ストア名        | 管理内容                                      |
|------------------|-----------------------------------------------|
| `uiStore`         | 現在のモード（Normal / Expert）              |
| `filterStore`     | `selectedRanks`, `showFC`, `showNotFC` 状態 |

---

## 3. 機能構成

| セクション       | 内容                                                                 |
|------------------|----------------------------------------------------------------------|
| ランクフィルター | チェックボックスで表示したいランクを選択。背景色はランクごとに変化   |
| FCフィルター     | 「FC」「未FC」の表示切替チェックボックス（ピンク・グレーで色分け）   |

---

## 4. リアクティブロジック

### ✅ 現在のモードに応じて表示ランクを切り替える

```ts
const currentRanks = computed(() =>
  mode.value === 'Expert' ? ExpertRankScale : NormalRankScale
)
```

### ✅ モードが切り替わったとき、ランク選択をリセット
```ts
watch(currentRanks, (newRanks) => {
  filterStore.selectedRanks = [...newRanks]
}, { immediate: true })
```

## 5. ユーティリティ

### ✅ ランク・FCの背景色に応じた文字色調整
```ts
function getTextColor(bgColor: string): string {
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 150 ? '#000' : '#fff'
}
```

## 6. UI構成

### ✅ ランクフィルター
チェックボックスを v-for で生成
v-model="filterStore.selectedRanks" により動的にバインド
rankDisplay(rank, mode.value) で表示名を調整（例：Normalでは "100%"→"AAA+"）

### ✅ FCフィルター
filterStore.toggleFC() / toggleNotFC() によってON/OFF切替
色分け：FC → ピンク、未FC → グレー

## 7.スタイリング概要
```css
.filter-panel {
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.checkbox-item {
  font-size: 14px;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
}

.checkbox-item input[type='checkbox'] {
  accent-color: white;
}
```