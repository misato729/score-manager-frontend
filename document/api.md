# 📘 API仕様書（Score管理 & 認証 / ユーザー管理）

本ドキュメントは、以下のファイル構成および状態管理に基づいたAPI通信仕様の設計書です。

- `axios.ts`: API通信の共通インスタンス
- `userApi.ts`: 認証 / ユーザー関連API
- `scoreApi.ts`: スコアデータの取得・更新API
- 状態管理設計書: `authStore.ts`, `scoreStore.ts`, 他

---

## ✅ API共通設定（axios.ts）

### ● Base URL
https://api.rbplus-rank-manager.site


### ● 共通設定

- `withCredentials: true` によりCookie送信
- `X-XSRF-TOKEN` を `js-cookie` 経由で自動送信

---

## 👤 認証 / ユーザー系 API（userApi.ts）

### 1. `POST /login`

| 項目           | 内容                     |
|----------------|--------------------------|
| 概要           | ユーザーログイン         |
| パラメータ     | `email`, `password`      |
| 成功レスポンス | ログインユーザー情報（`user`） |

---

### 2. `POST /logout`

| 項目       | 内容             |
|------------|------------------|
| 概要       | ログアウト処理   |
| パラメータ | なし             |
| レスポンス | `204 No Content` |

---

### 3. `GET /user`

| 項目       | 内容                       |
|------------|----------------------------|
| 概要       | 現在ログイン中のユーザー取得 |
| パラメータ | Cookie認証                 |
| レスポンス | `User` オブジェクト       |

---

### 4. `PUT /user`

| 項目       | 内容                               |
|------------|------------------------------------|
| 概要       | ユーザー情報の更新（目標ランクなど） |
| パラメータ | `target` など                     |
| レスポンス | 更新後のユーザー情報               |

---

## 🎵 スコア関連 API（scoreApi.ts）

### 1. `GET /scores?user_id=xxx`

| 項目       | 内容                                   |
|------------|----------------------------------------|
| 概要       | 指定ユーザーの全スコア取得             |
| パラメータ | `user_id`                              |
| レスポンス | `Score[]`（曲ID、ランク、FC状態など） |

---

### 2. `PUT /scores/:score_id`

| 項目       | 内容                         |
|------------|------------------------------|
| 概要       | 指定スコア情報の更新         |
| パラメータ | `rank`, `fc`                 |
| レスポンス | 更新後のスコアオブジェクト   |

---

### 3. `POST /scores`

| 項目       | 内容                                   |
|------------|----------------------------------------|
| 概要       | 新規スコア登録（未登録の曲を初保存）   |
| パラメータ | `user_id`, `song_id`, `rank`, `fc`     |
| レスポンス | 作成されたスコア情報                   |

---

## 🧠 使用例

### ログイン後のスコア取得処理

```ts
await fetchUser()
const uid = authStore.user?.id
const scores = await fetchScores(uid)
```

### ランク変更時の保存処理
```ts
if (score.id) {
  await updateScore(score.id, { rank: newRank })
} else {
  await createScore({ user_id, song_id, rank: newRank, fc: false })
}
```

## 今後の拡張候補

| API                | 内容                |
| ------------------ | ----------------- |
| `GET /shops`       | 店舗一覧の取得（CSVからDB化） |
| `POST /user_visit` | 店舗訪問記録の登録         |
| `GET /user_visit`  | 訪問済み店舗の取得         |
| `DELETE /user`     | アカウント削除（自身のみ）     |
