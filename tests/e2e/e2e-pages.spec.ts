import { test, expect } from '@playwright/test';

const userId = 8;

// テスト対象ページ一覧
const pagesToTest = [
  '/',
  '/songlist',
  '/dashboard',
  '/shops',
  '/how_to_angya',
  '/inquiry',
  `/dashboard?user=${userId}`,
  `/visited_shops?user=${userId}`,
];

test.describe('E2Eページ表示確認 - ログイン後', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('requestfailed', req => console.log('REQUEST FAIL:', req.url(), req.failure()?.errorText));
    page.on('response', res => console.log('RESPONSE:', res.url(), res.status()));

    await page.goto('/sanctum/csrf-cookie');
    await page.goto('/login');
    await page.waitForSelector('#email',{ timeout: 5000 });

    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/dashboard/);
  });

  for (const path of pagesToTest) {
    test(`ページ表示確認: ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
