# CI/CD ドキュメント

このドキュメントは、`score-manager-frontend` の CI/CD フロー全体をまとめたものです。

## 1. ワークフロー一覧

- `.github/workflows/frontend-ci.yml`
  - main ブランチ向けのゲート付き CI/CD（PR / push / 手動）
- `.github/workflows/frontend-smoke.yml`
  - 本番スモークテスト専用（定期実行 / 手動）
- `.github/workflows/preview-ci.yml`
  - preview ブランチ向け CI/CD（push）

---

## 2. `frontend-ci.yml`（メイン）

### トリガー

- `pull_request`（`main` 宛て）
- `push`（`main`）
- `workflow_dispatch`

### 2.1 `ci` ジョブ（共通品質ゲート）

実行内容:

1. `npm ci`
2. `npm run lint --if-present`
3. `npm run typecheck --if-present`
4. `npm run test:coverage --if-present`

### 2.2 `preview-deploy`（PR時）

条件: `pull_request` かつ draft でない

実行内容:

1. Vercel CLI 準備
2. `vercel pull --environment=preview`
3. `vercel build`
4. `vercel deploy --prebuilt`
5. 出力 URL を `preview_url` として次ジョブに受け渡し

`VERCEL_ORG_SLUG` がセットされている場合は、Vercel コマンドに `--scope` を付与します。

### 2.3 `preview-e2e`（PR時）

条件: `pull_request` かつ draft でない

実行内容:

1. Playwright をインストール
2. `BASE_URL/login` への到達確認（最大30回リトライ）
   - `x-vercel-protection-bypass` ヘッダで保護環境へアクセス
   - `200` または `404` を到達可能とみなす
   - 到達不可の場合は `exit 1` で明示失敗
3. `npx playwright test tests/e2e/`
4. 失敗時を含めレポートを artifact 保存

### 2.4 `prod-deploy`（main push 時）

条件: `github.ref == refs/heads/main` かつ `push`

実行内容:

1. `vercel pull --environment=production`
2. `vercel deploy --prod`

こちらも `VERCEL_ORG_SLUG` があれば `--scope` 付きで実行します。

### 2.5 `prod-smoke`（main push 時）

条件: `github.ref == refs/heads/main` かつ `push`

実行内容:

1. Playwright をインストール
2. `npx playwright test tests/e2e/smoke.spec.ts`
3. レポートを artifact 保存

主な環境変数:

- `BASE_URL`（本番URL）
- `VERCEL_BYPASS_TOKEN`
- `E2E_EMAIL`
- `E2E_PASSWORD`

---

## 3. `frontend-smoke.yml`（定期スモーク）

### トリガー

- `workflow_dispatch`
- `schedule`（`0 6 * * *`）

### 実行内容

1. `npm ci`
2. Playwright インストール
3. `npx playwright test tests/e2e/smoke.spec.ts`

主な環境変数:

- `BASE_URL`
- `VERCEL_BYPASS_TOKEN`
- `E2E_EMAIL`
- `E2E_PASSWORD`

---

## 4. `preview-ci.yml`（preview ブランチ専用）

### トリガー

- `push` to `preview`

### ジョブ構成

1. `ci`
   - lint/typecheck/unit(coverage)
2. `deploy-and-alias`
   - preview デプロイ
   - `preview.rbplus-rank-manager.site` へ alias
3. `preview-e2e`
   - Vercel Protection バイパストークンを cookie/header/query で検証
   - `npx playwright test tests/e2e/`

---

## 5. Playwright 設定

`playwright.config.ts` で以下を設定:

- `baseURL: process.env.BASE_URL`
- `VERCEL_BYPASS_TOKEN` がある場合、`x-vercel-protection-bypass` ヘッダを全リクエストに付与
- `trace/video/screenshot` は失敗時の調査用に保持
- `retries: 1`

---

## 6. smoke.spec.ts の意図

### ログインスモーク

- `E2E_EMAIL` / `E2E_PASSWORD` が未設定なら `skip`
- `/login` 表示後に入力
- ログイン送信時は
  - `/login` API 成功レスポンス（200/204）
  - `/dashboard` への URL 遷移
  を確認

### トップページスモーク

- `/` の表示可否を確認

---

## 7. 必須 Secrets（運用）

Vercel / E2E 関連で主に以下を利用:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_SLUG`
- `VERCEL_BYPASS_TOKEN`
- `E2E_EMAIL`
- `E2E_PASSWORD`

---

## 8. 失敗時の確認ポイント

1. **Vercel 権限/スコープ**
   - Token/Org/Project/Scope の整合性
2. **Preview 保護バイパス**
   - `VERCEL_BYPASS_TOKEN` の有効性
3. **ログイン情報**
   - `E2E_EMAIL` / `E2E_PASSWORD` の設定・有効性
4. **Playwright artifacts**
   - `playwright-report` / trace / video / screenshot を確認
