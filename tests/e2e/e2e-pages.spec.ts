import { test, expect } from '@playwright/test';

// 共通ログイン処理（堅い版）
async function login(page: import('@playwright/test').Page) {
  // baseURL を使う前提で相対パスに統一
  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  // ネットワークが一段落するまで待つ（SPAの初期化を待つ）
  await page.waitForLoadState('networkidle', { timeout: 30_000 });

  // もし保護ページ/404に来ていたら即失敗させる（原因をはっきりさせる）
  const url = page.url();
  const title = await page.title().catch(() => '');
  const body = await page.locator('body').innerText().catch(() => '');
  if (/vercel.*protect|protected|cloudflare|not\s*found|404/i.test(body)) {
    // 何を見ていたか分かるようにスクショ
    await page.screenshot({ path: 'login_wrong_page.png' });
    throw new Error(`Login page is not the expected form. URL=${url}, title=${title}`);
  }

  // フォームが「見える」まで待つ（10sだと足りないことがある）
  await expect(page.locator('#email')).toBeVisible({ timeout: 30_000 });

  // 入力 & 遷移確認
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
}

test.describe('E2Eページ表示確認 - ログイン後', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  const paths = [
    '/',
    '/songlist',
    '/dashboard',
    '/shops',
    '/how_to_angya',
    '/inquiry',
    '/dashboard?user=8',
    '/visited_shops?user=8',
  ];

  for (const path of paths) {
    test(`ページ表示確認: ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('body')).toBeVisible({ timeout: 30_000 });
    });
  }
});
