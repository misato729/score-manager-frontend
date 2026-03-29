# agents.md

## 目的
このリポジトリで AI エージェントが実装・修正・レビューを行う際の前提とルールを定義する。

---

## プロジェクト概要
REFLEC BEAT plus のフロントエンドアプリケーション。

### 主な機能
- 難易度表の閲覧
- クリアランク / FC / メモの管理
- 進捗表示
- 設置店舗マップ表示
- 行脚関連機能
- 問い合わせ画面
- 楽曲一覧表示

---

## 技術スタック
- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Axios

---

## ディレクトリ構成
src/
├─ api/
│  ├─ auth.ts
│  ├─ authApi.ts
│  ├─ axios.ts
│  ├─ csrf.ts
│  ├─ interceptor.ts
│  ├─ scoreApi.ts
│  └─ userApi.ts
├─ assets/
├─ components/
│  ├─ common/
│  │  ├─ AdNinja.vue
│  │  ├─ Footer.vue
│  │  ├─ Header.vue
│  │  └─ ModeSwitch.vue
│  ├─ dashboard/
│  │  ├─ FilterPanel.vue
│  │  ├─ JirikiSection.vue
│  │  ├─ ProgressBar.vue
│  │  ├─ ProgressSection.vue
│  │  ├─ RankSelect.vue
│  │  ├─ SongCard.vue
│  │  └─ TierSection.vue
│  └─ shop/
│     ├─ HowToAngya.vue
│     ├─ ShopFilters.vue
│     ├─ ShopInfoWindow.vue
│     ├─ ShopMap.vue
│     └─ ShopTable.vue
├─ router/
│  └─ index.ts
├─ stores/
│  ├─ authStore.ts
│  ├─ filterStore.ts
│  ├─ scoreStore.ts
│  └─ uiStore.ts
├─ utils/
│  ├─ rank.ts
│  └─ shop.ts
├─ views/
│  ├─ Dashboard.vue
│  ├─ Inquiry.vue
│  ├─ Login.vue
│  ├─ Register.vue
│  ├─ Shops.vue
│  ├─ Songlist.vue
│  ├─ Top.vue
│  └─ VisitedShops.vue
├─ App.vue
├─ main.ts
├─ types.ts
└─ vite-env.d.ts

---

## 設計方針
- 既存のディレクトリ構成を維持する
- 新規コンポーネントは責務に応じて `common` / `dashboard` / `shop` に配置する
- 画面単位のファイルは `views` に置く
- API 通信は `src/api` 配下に集約する
- グローバル状態は Pinia store に集約する
- 型は `types.ts` または適切な箇所で明示する

---

## Store の役割
- `authStore.ts`: 認証状態
- `filterStore.ts`: フィルター条件
- `scoreStore.ts`: スコア関連状態
- `uiStore.ts`: UI 状態

---

## コーディングルール
### 共通
- 可読性優先
- 変更は最小限
- 既存命名・既存責務を尊重する
- 不要な全体リファクタリングは禁止

### Vue
- Composition API を優先
- script setup を優先
- props / emit の責務を明確にする
- 既存コンポーネントの責務を崩さない

### API
- 直接 fetch を増やさず、既存の `src/api` レイヤーを優先利用する
- 認証まわりは `auth.ts` / `authApi.ts` / `csrf.ts` / `interceptor.ts` の既存構成を尊重する

---

## AIへの指示
- まず既存構成に合わせる
- 新しいフォルダを勝手に増やさない
- 変更時は対象ファイルと変更理由を明確にする
- 既存 UI と状態管理の流れを壊さない
- 必要以上にアーキテクチャを作り替えない

---

## 禁止事項
- API キーや秘密情報のハードコード
- 既存フォルダ構成の無断変更
- store の責務の混在
- components と views の責務逆転
