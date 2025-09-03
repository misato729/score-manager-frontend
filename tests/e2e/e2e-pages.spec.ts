import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL; // ← Render 側 (例: https://api.rbplus-rank-manager.site)
const BASE_URL = process.env.BASE_URL; // ← Vercel 側 (例: https://rbplus-rank-manager.site)

test.describe('E2Eページ表示確認 - ログイン後', () => {
  test.beforeEach(async ({ page, request }) => {
    // CSRF Cookie を API ドメインから取得
    const csrfResponse = await request.get(`${API_URL}/sanctum/csrf-cookie`);
    expect(csrfResponse.ok()).toBeTruthy();

    // Vue のログインページを開く
    await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('#email', { timeout: 5000 });

    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/dashboard/);
  });

  const pagesToTest = ['/', '/songlist', '/dashboard', '/shops'];

  for (const path of pagesToTest) {
    test(`ページ表示確認: ${path}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${path}`);
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
