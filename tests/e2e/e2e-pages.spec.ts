import { test, expect } from '@playwright/test';

test.describe('E2Eページ表示確認 - ログイン後', () => {
  test.beforeEach(async ({ page, request }) => {
    // CSRF Cookie を発行（画面遷移じゃなく API コール）
    const csrfResponse = await request.get('/sanctum/csrf-cookie');
    expect(csrfResponse.ok()).toBeTruthy();

    // ログインページへ
    await page.goto('/login');
    await page.waitForSelector('#email', { timeout: 5000 });

    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/dashboard/);
  });

  const pagesToTest = ['/', '/songlist', '/dashboard', '/shops'];

  for (const path of pagesToTest) {
    test(`ページ表示確認: ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
