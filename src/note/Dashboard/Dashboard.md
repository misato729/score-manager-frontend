Dashboard.vue 設計書

1. 概要

Dashboard.vue は、ログイン後のメイン画面です。ユーザーはここでモード切り替え（Normal / Expert）、進捗確認、楽曲リストの閲覧・編集を行えます。

2. 使用コンポーネント


| コンポーネント名        | 役割                                 |
|-------------------------|--------------------------------------|
| ModeSwitch.vue          | Normal / Expert のモード切り替え     |
| UserMenu.vue            | ユーザー情報の表示（仮）             |
| ProgressSection.vue     | 目標ランクの達成状況を表示           |
| TierSection.vue         | 地力ランク別の楽曲カードを表示       |

3. ファイルパス構成

src/
├── views/
│   └── Dashboard.vue
├── components/
│   ├── common/
│   │   └── ModeSwitch.vue
│   │   └── UserMenu.vue
│   │   └── ProgressBar.vue
│   └── dashboard/
│       └── ProgressSection.vue
│       └── TierSection.vue

4. Props / Emits

このコンポーネント自体では Props や Emits は使用していません（状態管理や子コンポーネントからの Emit に依存）。

5. ストアの使用（Pinia）

現時点では直接使用していませんが、子コンポーネントを通じて uiStore, filterStore などと連携する可能性があります。

6. スタイリングルール

.dashboard-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
}

.top-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: bold;
  border-left: 8px solid #a48be0;
  padding-left: 12px;
  margin-bottom: 12px;
}

.card {
  background: #fff;
  max-width: 800px;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

7. 今後の拡張予定（ToDo）
・UserMenu.vue の実装（ユーザー名表示・ログアウト機能）
・スマホ対応のスタイル最適化
・コンポーネント間の状態連携の見直し（特にモード切替・Filter連動）
・認証されていないユーザーのアクセス制御
・Pinia による状態の永続化（必要に応じて）


8. ルーティング情報

| パス           | コンポーネント       | 認証   |
| ------------ | ------------- | ---- |
| `/dashboard` | Dashboard.vue | 必須 ✅ |


