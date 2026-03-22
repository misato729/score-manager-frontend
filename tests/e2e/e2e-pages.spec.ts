import { test, expect, Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#email')).toBeVisible({ timeout: 30_000 });

  await page.fill('#email', process.env.E2E_EMAIL ?? 'test@example.com');
  await page.fill('#password', process.env.E2E_PASSWORD ?? 'password');

  // ログインAPI成功（200/204）とURL遷移を同時に待つ
  await Promise.all([
    page.waitForResponse((res) =>
      /\/login$/.test(new URL(res.url()).pathname) && [200, 204].includes(res.status())
    ),
    page.waitForURL(/\/dashboard(\?|$)/, { timeout: 30_000 }),
    page.click('button[type="submit"]'),
  ]).catch(async (err) => {
    // 失敗時のデバッグ出力
    console.log('URL after click:', page.url());
    const alert = page.locator('[role="alert"], .error, .alert');
    if (await alert.first().isVisible().catch(() => false)) {
      console.log('LOGIN ERROR TEXT:', await alert.first().innerText());
    }
    await page.screenshot({ path: 'login_failed.png' });
    throw err;
  });
}
