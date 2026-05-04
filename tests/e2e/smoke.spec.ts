import { test, expect } from '@playwright/test';

test.describe('スモークテスト - 本番環境', () => {
  test('ログインしてダッシュボードが表示される', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto(`${process.env.BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#email', { timeout: 15_000 });
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 60_000 });
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('トップページが表示される', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();
  });
});
