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
    await page.goto(`${process.env.BASE_URL}/sanctum/csrf-cookie`);
    // ここで XSRF-TOKEN を取得してから /login へ
    await page.goto(`${process.env.BASE_URL}/login`);
    await page.waitForSelector('#email');

    // ログイン処理
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    // ダッシュボードへの遷移を確認（クエリ付きでもOK）
    await page.waitForURL(/\/dashboard/);
  });

  for (const path of pagesToTest) {
    test(`ページ表示確認: ${path}`, async ({ page }) => {
      await page.goto(`${process.env.BASE_URL}${path}`);
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
