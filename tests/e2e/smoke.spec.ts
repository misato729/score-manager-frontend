import { test, expect } from '@playwright/test';

test('ログインとダッシュボード表示確認', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/login`);
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL(`${process.env.BASE_URL}/dashboard`);
  await expect(page.locator('body')).toBeVisible();
});

test('トップページ表示確認', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/`);
  await expect(page.locator('body')).toBeVisible();
});
