// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'tests/**'], // ← Playwright の e2e は除外
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // ここがポイント：まずは utils 配下の TS だけを対象に
      include: ['src/utils/**/*.ts'],
      exclude: [
        'src/main.ts',
        'src/router/**',
        'src/stores/**',
        'src/views/**',
        'src/components/**',
        'src/api/**',
        'playwright.config.ts',
        '**/*.d.ts',
      ],
      // 必要ならしばらく閾値は外す
      // thresholds: { lines: 50, functions: 50, branches: 40, statements: 50 },
    },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
