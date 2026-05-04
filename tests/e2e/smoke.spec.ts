import { test, expect } from '@playwright/test';

test.describe('スモークテスト - 本番環境', () => {
  test('ログインしてダッシュボードが表示される', async ({ page }) => {
    test.setTimeout(60_000);

    const email = process.env.E2E_EMAIL;
    const password = process.env.E2E_PASSWORD;
    test.skip(!email || !password, 'E2E_EMAIL / E2E_PASSWORD が未設定のためログイン確認をスキップ');

    await page.goto(`${process.env.BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#email', { timeout: 15_000 });
    await page.fill('#email', email!);
    await page.fill('#password', password!);

    await Promise.all([
      page.waitForResponse((res) =>
        /\/login$/.test(new URL(res.url()).pathname) && [200, 204].includes(res.status()),
      ),
      page.click('button[type="submit"]'),
    ]);

    await page.waitForURL(/\/dashboard(\?|$)/, { timeout: 60_000 });
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('トップページが表示される', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();
  });
});
