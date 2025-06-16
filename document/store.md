# 📘 状態管理設計書（Pinia）

## 🗂 使用目的と役割

| ストア名         | 主な役割                                           |
|------------------|----------------------------------------------------|
| `authStore.ts`   | 認証状態（ログイン中ユーザー・エラー）             |
| `filterStore.ts` | 楽曲フィルター（ランク・FC状態など）               |
| `scoreStore.ts`  | スコア情報の保持とCRUD（取得・更新・保存）         |
| `uiStore.ts`     | UIのモード管理（Normal/Expert, 編集モードなど）     |

---

## 1. `authStore.ts`

### ◾ 主な状態（state）

| 変数名     | 型           | 説明                                 |
|------------|--------------|--------------------------------------|
| `user`     | `User \| null` | ログイン中のユーザー情報             |
| `isLoading`| `boolean`     | API通信用のローディングフラグ        |
| `error`    | `string`      | エラーメッセージ                     |

### ◾ 主な関数（actions）

| 関数名      | 説明                                      |
|-------------|-------------------------------------------|
| `login()`   | 認証APIによりログイン処理を実行          |
| `logout()`  | 認証状態をクリアし、セッションを破棄     |
| `fetchUser()` | 現在のユーザー情報を取得                |

---

## 2. `filterStore.ts`

### ◾ 主な状態（state）

| 変数名           | 型         | 説明                                     |
|------------------|------------|------------------------------------------|
| `selectedRanks`  | `string[]` | 表示対象ランクリスト（複数選択可）       |
| `showFC`         | `boolean`  | FULL COMBO 曲のみを表示する              |
| `showNotFC`      | `boolean`  | 未FCの曲のみを表示する                   |

### ◾ 主な関数（actions）

| 関数名         | 説明                                |
|----------------|-------------------------------------|
| `toggleRank()` | ランクの選択状態をトグル切り替え    |
| `reset()`      | 全てのフィルター状態を初期化        |

---

## 3. `scoreStore.ts`

### ◾ 主な状態（state）

| 変数名     | 型               | 説明                                |
|------------|------------------|-------------------------------------|
| `scores`   | `Score[]`        | 全スコア一覧                        |
| `isSaving` | `boolean`        | 保存中状態（スピナー用）           |

### ◾ 主な関数（actions）

| 関数名             | 説明                                      |
|--------------------|-------------------------------------------|
| `fetchScores()`    | APIから指定ユーザーのスコアを取得         |
| `updateScore()`    | 楽曲ごとのランク・FC状態を保存・更新      |
| `getScore(songId)` | 指定楽曲に対するスコアオブジェクトを返す |

---

## 4. `uiStore.ts`

### ◾ 主な状態（state）

| 変数名        | 型                        | 説明                                 |
|---------------|---------------------------|--------------------------------------|
| `mode`        | `"normal" \| "expert"`    | モード（Normal / Expert）           |
| `editMode`    | `boolean`                 | 編集モードON/OFF                     |
| `targetRank`  | `string`                  | 目標ランク（例：AAA+, 98%など）      |

### ◾ 主な関数（actions）

| 関数名         | 説明                                 |
|----------------|--------------------------------------|
| `toggleMode()` | モードをトグル切り替え               |
| `setEditMode()`| 編集状態を設定                       |

---

## 🧭 状態依存マトリクス

| 状態                     | 使用コンポーネント例               |
|--------------------------|------------------------------------|
| `authStore.user`         | `Header.vue`, `Dashboard.vue`       |
| `uiStore.mode`           | `ModeSwitch.vue`, `RankSelect.vue`  |
| `filterStore.selectedRanks` | `FilterPanel.vue`, `JirikiSection.vue` |
| `scoreStore.scores`      | `SongCard.vue`, `ProgressBar.vue`   |

---

## 🔁 今後の拡張候補

| 内容                           | 対応ストア        | 備考                          |
|--------------------------------|-------------------|-------------------------------|
| `user_visit` を管理           | `visitStore.ts`   | 訪問済み店舗と日時の記録       |
| `shopStore.ts` の導入         | `shops.csv`読込管理 | 店舗一覧の状態管理を明示的に |
| `localStorage`による永続化   | `authStore`, etc. | ユーザー状態・フィルター保持 |

---

## 📄 Appendix: 型定義例（types.ts）

```ts
export interface User {
  id: number
  name: string
  email: string
  target: string
}

export interface Score {
  id: number
  user_id: number
  song_id: number
  rank: string
  fc: boolean
}

export interface Shop {
  id: number
  name: string
  address: string
  price: number
  number_of_machine: number
  description: string
  lat: number
  lng: number
}
