import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    headless: true,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // ▼ VercelのPreview保護をバイパス
    extraHTTPHeaders: process.env.VERCEL_BYPASS_TOKEN
      ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_TOKEN }
      : {},
  },
});
