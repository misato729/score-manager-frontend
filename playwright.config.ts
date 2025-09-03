import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 10_000,
  use: {
    baseURL: process.env.BASE_URL,                   // ← CIから注入
    extraHTTPHeaders: process.env.VERCEL_BYPASS_TOKEN
      ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_TOKEN }
      : {},
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  retries: 1,
});
