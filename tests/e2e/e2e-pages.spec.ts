import { test, expect } from '@playwright/test';

// 共通ログイン処理
async function login(page) {
  await page.goto(`${process.env.BASE_URL}/login`);
  await page.waitForSelector('#email');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
}

test.describe('E2Eページ表示確認 - ログイン後', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  const pages = [
    '/',
    '/songlist',
    '/dashboard',
    '/shops',
    '/how_to_angya',
    '/inquiry',
    '/dashboard?user=8',
    '/visited_shops?user=8',
  ];

  for (const path of pages) {
    test(`ページ表示確認: ${path}`, async ({ page }) => {
      await page.goto(`${process.env.BASE_URL}${path}`);
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
