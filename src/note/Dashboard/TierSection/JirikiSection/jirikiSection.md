# JirikiSection.vue 設計書

## 1. 概要

`JirikiSection.vue` は、特定の地力Tier（例：S+, A, D など）に分類された楽曲をグリッド形式で一覧表示するセクションです。Tierごとの見出し（ラベル）と、最大5列のカードレイアウトで構成されています。

---

## 2. Props

| プロパティ名 | 型         | 説明                            |
|--------------|------------|---------------------------------|
| `tierName`   | `string`   | 表示対象の地力Tier名（例: S+）  |
| `songs`      | `Song[]`   | 該当Tierに属する楽曲の配列      |

---

## 3. 使用コンポーネント

| コンポーネント名 | 説明                         |
|------------------|------------------------------|
| `SongCard.vue`   | 楽曲を1件ずつ表示するカード |

---

## 4. UI構成

| 要素名         | 説明                                             |
|----------------|--------------------------------------------------|
| `.tier-title`  | Tier名（例：地力S+）を中央揃えで表示             |
| `.song-grid`   | 楽曲カードを最大5列のグリッドで表示              |
| `SongCard`     | `song` オブジェクトを渡して1曲ずつ描画          |

---

## 5. スタイリング概要

```css
.jiriki-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tier-title {
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 8px;
}

.song-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap: 20px;
}
```
grid-template-columns により 最大5列 に制限され、曲数が少ない場合でも均等表示
gap によりカード同士の余白が確保される