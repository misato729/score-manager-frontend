import { test, expect, type Page } from '@playwright/test'

interface ApiRequest {
  url: URL
  method: string
  body: unknown
}

async function mockPublicApis(
  page: Page,
  appUrl: string,
  responses: Record<string, unknown> = {},
) {
  const apiRequests: ApiRequest[] = []
  const appOrigin = new URL(appUrl).origin
  const apiOrigins = ['http://localhost:8000', 'https://api.rbplus-rank-manager.site']

  await page.route('**/*', async (route) => {
    const request = route.request()
    const url = new URL(request.url())

    if (apiOrigins.includes(url.origin)) {
      const headers = {
        'access-control-allow-origin': appOrigin,
        'access-control-allow-credentials': 'true',
        'access-control-allow-methods': 'GET, PUT, OPTIONS',
        'access-control-allow-headers': 'X-Requested-With, X-XSRF-TOKEN, Content-Type',
      }

      if (request.method() === 'OPTIONS' || url.pathname === '/sanctum/csrf-cookie') {
        await route.fulfill({ status: 204, headers })
        return
      }

      apiRequests.push({
        url,
        method: request.method(),
        body: request.postData() ? request.postDataJSON() : null,
      })
      const status = url.pathname in responses ? 200 : url.pathname === '/api/user' ? 401 : 404
      await route.fulfill({
        status,
        headers,
        contentType: 'application/json',
        body: JSON.stringify(responses[url.pathname] ?? { message: 'Unauthenticated.' }),
      })
      return
    }

    if (url.origin === appOrigin) {
      await route.continue()
      return
    }

    await route.abort()
  })

  return apiRequests
}

test('公開難易度表はパスで指定したユーザーの全楽曲スコアを表示する', async ({ page, baseURL }) => {
  const requests = await mockPublicApis(page, baseURL!, {
    '/api/users/52/song-scores': [
      {
        song_id: 1,
        title: 'API確認用のプレイ済み曲',
        jiriki_rank: 'A',
        score_id: 100,
        rank: 'AA',
        fc: true,
        memo: null,
        user_name: 'ユーザー52',
      },
      {
        song_id: 2,
        title: 'API確認用の未プレイ曲',
        jiriki_rank: 'B',
        score_id: null,
        rank: null,
        fc: null,
        memo: null,
        user_name: 'ユーザー52',
      },
    ],
  })

  await page.goto('/dashboard/52')

  await expect(page.getByRole('heading', { name: 'ユーザー52さんのレベル11難易度表' })).toBeVisible()
  await expect(page.locator('.song-card')).toHaveCount(2)
  await expect(page.getByText('API確認用のプレイ済み曲', { exact: true })).toBeVisible()
  await expect(page.getByText('API確認用の未プレイ曲', { exact: true })).toBeVisible()
  await expect(page.locator('.song-card').filter({ hasText: 'API確認用のプレイ済み曲' }).locator('.readonly')).toHaveText('AA / FC')
  await expect(page.locator('.song-card select')).toHaveCount(0)

  const scoreRequests = requests.filter(({ url }) => url.pathname.includes('scores'))
  expect(scoreRequests.map(({ url }) => url.pathname + url.search)).toEqual(['/api/users/52/song-scores'])
})

test('公開行脚履歴はパスで指定したユーザーの店舗と訪問日時を表示する', async ({ page, baseURL }) => {
  const requests = await mockPublicApis(page, baseURL!, {
    '/api/users/52/visited-shops': {
      user_name: 'ユーザー52',
      visited_shops: [
        { id: 7, name: 'API確認用の店舗', address: '東京都千代田区', created_at: '2026-10-20T03:04:00Z' },
      ],
    },
  })

  await page.goto('/visited_shops/52')

  await expect(page.getByRole('heading', { name: 'ユーザー52さんの行脚履歴' })).toBeVisible()
  const row = page.getByRole('row').filter({ hasText: 'API確認用の店舗' })
  await expect(row).toContainText('東京都')
  await expect(row).toContainText('2026/10/20 12:04')

  const visitRequests = requests.filter(({ url }) => url.pathname.includes('visited-shops'))
  expect(visitRequests.map(({ url }) => url.pathname + url.search)).toEqual(['/api/users/52/visited-shops'])
})

test('訪問記録がなくても行脚履歴にユーザー名を表示する', async ({ page, baseURL }) => {
  await mockPublicApis(page, baseURL!, {
    '/api/users/52/visited-shops': { user_name: 'ユーザー52', visited_shops: [] },
  })

  await page.goto('/visited_shops/52')

  await expect(page.getByRole('heading', { name: 'ユーザー52さんの行脚履歴' })).toBeVisible()
  await expect(page.getByText('訪問記録がありません。', { exact: true })).toBeVisible()
  await expect(page.getByRole('table')).toHaveCount(0)
})

test('ゲスト難易度表はユーザースコアAPIを使わずCSVを表示する', async ({ page, baseURL }) => {
  const requests = await mockPublicApis(page, baseURL!)
  await page.route('**/songsTable.csv', (route) => route.fulfill({
    contentType: 'text/csv',
    body: 'id,title,jiriki_rank\n1,ゲスト確認用の曲,A',
  }))

  await page.goto('/dashboard')

  await expect(page.getByRole('heading', { name: 'レベル11難易度表', exact: true })).toBeVisible()
  await expect(page.getByText('ゲスト確認用の曲', { exact: true })).toBeVisible()
  expect(requests.filter(({ url }) => url.pathname.includes('scores'))).toEqual([])
})

for (const path of ['dashboard', 'visited_shops']) {
  test(`旧${path} URLはユーザーIDをパスへ移し、他のクエリとハッシュを維持する`, async ({ page, baseURL }) => {
    await mockPublicApis(page, baseURL!, {
      '/api/users/52/song-scores': [],
      '/api/users/52/visited-shops': { user_name: 'ユーザー52', visited_shops: [] },
    })

    await page.goto(`/${path}?user=52&view=detail#progress`)

    await expect(page).toHaveURL(new URL(`/${path}/52?view=detail#progress`, baseURL!).href)
  })
}

for (const userId of [52, 8]) {
  test(`本人の難易度表を編集でき、アカウント削除は${userId === 8 ? 'デモユーザーでは無効' : '通常ユーザーでは有効'}`, async ({ page, baseURL }) => {
    const requests = await mockPublicApis(page, baseURL!, {
      '/api/user': { id: userId, name: '本人', email: 'owner@example.com', target: 'AAA+' },
      '/api/users/target': {},
      [`/api/users/${userId}/song-scores`]: [
        { song_id: 1, title: '本人のプレイ曲', jiriki_rank: 'A', score_id: 100, rank: 'AA', fc: false, memo: null, user_name: '本人' },
      ],
    })

    await page.goto(`/dashboard/${userId}`)

    await expect(page.getByRole('heading', { name: '本人さんのレベル11難易度表' })).toBeVisible()
    await expect(page.locator('.song-card select')).toBeVisible()
    await expect(page.locator('.song-card input[type="checkbox"]')).toBeEnabled()
    const deleteButton = page.getByRole('button', { name: 'アカウントを削除する' })
    if (userId === 8) {
      await expect(deleteButton).toBeDisabled()
    } else {
      await expect(deleteButton).toBeEnabled()
    }

    // 初期表示では目標を保存せず、明示的な変更だけを保存する。
    expect(requests.filter(({ url, method }) => url.pathname === '/api/users/target' && method === 'PUT')).toEqual([])
    requests.length = 0
    await page.locator('.goal-row select').selectOption('AA')
    await expect.poll(() => requests
      .filter(({ url, method }) => url.pathname === '/api/users/target' && method === 'PUT')
      .map(({ body }) => body),
    ).toContainEqual({ target: 'AA' })
  })
}

test('ログイン中でも他人の難易度表は読取専用で表示する', async ({ page, baseURL }) => {
  const requests = await mockPublicApis(page, baseURL!, {
    '/api/user': { id: 8, name: 'ログインユーザー', email: 'viewer@example.com', target: 'AAA+' },
    '/api/users/52/song-scores': [
      { song_id: 1, title: '他人のプレイ曲', jiriki_rank: 'A', score_id: 100, rank: 'AA', fc: true, memo: null, user_name: 'ユーザー52' },
    ],
  })

  await page.goto('/dashboard/52')

  await expect(page.locator('.username')).toContainText('ログインユーザー')
  await expect(page.getByRole('heading', { name: 'ユーザー52さんのレベル11難易度表' })).toBeVisible()
  await expect(page.locator('.song-card .readonly')).toHaveText('AA / FC')
  await expect(page.locator('.song-card select')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'アカウントを削除する' })).toHaveCount(0)

  // debounce期間を過ぎてから変更し、保存リクエストが遅れて発生しないことも確認する。
  await page.waitForTimeout(400)
  requests.length = 0
  await page.locator('.goal-row select').selectOption('AA')
  await expect(page.locator('.goal-row select')).toHaveValue('AA')
  await page.waitForTimeout(400)
  expect(requests.filter(({ url, method }) =>
    url.pathname === '/api/users/target' && method === 'PUT',
  )).toEqual([])
})

test('行脚履歴のユーザーをSPA遷移で切り替えるとタイトルと店舗も更新する', async ({ page, baseURL }) => {
  const requests = await mockPublicApis(page, baseURL!, {
    '/api/user': { id: 52, name: '本人', email: 'owner@example.com', target: 'AAA+' },
    '/api/users/53/visited-shops': {
      user_name: '前のユーザー53',
      visited_shops: [
        { id: 7, name: '前のユーザーだけの店舗', address: '東京都千代田区', created_at: '2026-10-20T03:04:00Z' },
      ],
    },
    '/api/users/52/visited-shops': {
      user_name: '本人52',
      visited_shops: [
        { id: 8, name: '本人だけの店舗', address: '神奈川県横浜市', created_at: '2026-10-21T03:04:00Z' },
      ],
    },
  })

  await page.goto('/visited_shops/53')
  await expect(page.getByRole('heading', { name: '前のユーザー53さんの行脚履歴' })).toBeVisible()
  await expect(page.getByRole('cell', { name: '前のユーザーだけの店舗', exact: true })).toBeVisible()
  await page.locator('.username').click()
  await page.getByRole('link', { name: '行脚履歴', exact: true }).click()

  await expect(page).toHaveURL(new URL('/visited_shops/52', baseURL!).href)
  await expect(page.getByRole('heading', { name: '本人52さんの行脚履歴' })).toBeVisible()
  await expect(page.getByRole('cell', { name: '本人だけの店舗', exact: true })).toBeVisible()
  await expect(page.getByText('前のユーザー53さんの行脚履歴', { exact: true })).toHaveCount(0)
  await expect(page.getByRole('cell', { name: '前のユーザーだけの店舗', exact: true })).toHaveCount(0)

  const visitRequests = requests.filter(({ url }) => url.pathname.includes('visited-shops'))
  expect(visitRequests.map(({ url }) => url.pathname + url.search)).toEqual([
    '/api/users/53/visited-shops',
    '/api/users/52/visited-shops',
  ])
})
