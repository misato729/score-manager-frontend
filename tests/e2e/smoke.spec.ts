// tests/e2e/smoke.spec.ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('response', res => {
    if (res.status() >= 400) console.log('HTTP', res.status(), res.url());
  });
});

test.describe('スモークテスト - 本番環境', () => {
  test('ログインしてダッシュボードが表示される', async ({ page }) => {
    // baseURL + 相対パス（configでbaseURL必須）
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    console.log('After goto:', page.url());

    // もしログイン済みで即リダイレクトされた場合を検出
    // 「ログイン」見出し or 「ダッシュボード」見出しのどちらかが出るまで待つ
    const loginHeading = page.getByRole('heading', { name: /ログイン/i });
    const dashboardHeading = page.getByRole('heading', { name: /ダッシュボード|Dashboard/i });

    await expect(Promise.race([
      loginHeading.waitFor({ state: 'visible', timeout: 15_000 }).then(() => 'login'),
      dashboardHeading.waitFor({ state: 'visible', timeout: 15_000 }).then(() => 'dashboard'),
    ])).resolves.toBeDefined();

    // 既にダッシュボードならログイン不要
    if (await dashboardHeading.isVisible().catch(() => false)) {
      await expect(dashboardHeading).toBeVisible();
      return;
    }

    // クッキーバナー等があれば閉じる（存在しなければ無視）
    const consentBtn = page.getByRole('button', { name: /同意|accept|agree/i });
    if (await consentBtn.isVisible().catch(() => false)) await consentBtn.click({ trial: false }).catch(() => {});

    // ラベル/プレースホルダで堅牢に入力
    const fillEmail = async () => {
      if (await page.getByLabel(/メールアドレス/i).isVisible().catch(() => false)) {
        await page.getByLabel(/メールアドレス/i).fill('test@example.com');
        return;
      }
      await page.getByPlaceholder(/メールアドレス|email/i).fill('test@example.com');
    };
    const fillPassword = async () => {
      if (await page.getByLabel(/パスワード/i).isVisible().catch(() => false)) {
        await page.getByLabel(/パスワード/i).fill('password');
        return;
      }
      await page.getByPlaceholder(/パスワード|password/i).fill('password');
    };

    await fillEmail();
    await fillPassword();

    // 送信
    const submitBtn =
      (await page.getByRole('button', { name: /^ログイン$/ }).isVisible().catch(() => false))
        ? page.getByRole('button', { name: /^ログイン$/ })
        : page.locator('button[type="submit"]');

    await submitBtn.click();

    // 成功確認
    await expect(dashboardHeading).toBeVisible({ timeout: 30_000 });
  });

  test('トップページが表示される', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('heading', { name: /REFLEC BEAT|トップ|Home|Welcome/i })
    ).toBeVisible();
  });
});
