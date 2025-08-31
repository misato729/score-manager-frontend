import { test, expect } from '@playwright/test';

test('トップページが表示される', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/REFLEC/i); // タイトルに合わせて調整
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible(); // 目立つ要素でOK
});
