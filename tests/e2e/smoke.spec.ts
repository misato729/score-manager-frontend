import { test, expect } from '@playwright/test';

test.describe('スモークテスト - 本番環境', () => {
  test('ログインしてダッシュボードが表示される', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/login`);
    await page.waitForSelector('#email'); // ← idで待機
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${process.env.BASE_URL}/dashboard`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('トップページが表示される', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/`);
    await expect(page.locator('body')).toBeVisible();
  });
});
