import { test, expect, type Page } from '@playwright/test'

interface ApiRequest {
  path: string
  method: string
  body: Record<string, unknown> | null
}

async function mockScores(page: Page, appUrl: string, ranks: Array<string | null>, owner = false, target = '98%', targetSaveDelays: number[] = []) {
  const requests: ApiRequest[] = []
  let targetSaveIndex = 0
  const appOrigin = new URL(appUrl).origin
  const scores = ranks.map((rank, index) => ({
    song_id: index + 1,
    title: `確認曲${index + 1}`,
    jiriki_rank: 'A',
    score_id: rank === null ? null : 100 + index,
    rank,
    fc: rank === '100%',
    memo: null,
    user_name: '確認ユーザー',
  }))

  await page.route('**/*', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    if (['http://localhost:8000', 'https://api.rbplus-rank-manager.site'].includes(url.origin)) {
      const headers = {
        'access-control-allow-origin': appOrigin,
        'access-control-allow-credentials': 'true',
        'access-control-allow-methods': 'GET, PUT, POST, OPTIONS',
        'access-control-allow-headers': 'X-Requested-With, X-XSRF-TOKEN, Content-Type',
      }
      if (request.method() === 'OPTIONS' || url.pathname === '/sanctum/csrf-cookie') {
        await route.fulfill({ status: 204, headers })
        return
      }

      const body = request.postData() ? request.postDataJSON() : null
      requests.push({ path: url.pathname, method: request.method(), body })
      let response: unknown = {}
      let status = 200
      if (url.pathname === '/api/user') {
        status = owner ? 200 : 401
        response = owner
          ? { id: 52, name: '確認ユーザー', email: 'owner@example.com', target }
          : { message: 'Unauthenticated.' }
      } else if (url.pathname === '/api/users/52/song-scores') {
        response = scores
      } else if (/^\/api\/scores\/\d+$/.test(url.pathname) && request.method() === 'PUT') {
        const score = scores.find((entry) => entry.score_id === Number(url.pathname.split('/').pop()))!
        Object.assign(score, body)
        response = { data: { id: score.score_id, rank: score.rank, fc: score.fc, memo: score.memo } }
      } else if (url.pathname === '/api/scores' && request.method() === 'POST') {
        const score = scores.find((entry) => entry.song_id === body.song_id)!
        Object.assign(score, body, { score_id: 200 + score.song_id })
        response = { id: score.score_id, rank: score.rank, fc: score.fc, memo: score.memo }
      } else if (url.pathname === '/api/users/target' && request.method() === 'PUT') {
        const delay = targetSaveDelays[targetSaveIndex++] ?? 0
        if (delay) await new Promise((resolve) => setTimeout(resolve, delay))
        target = body.target
      } else {
        status = 404
      }
      await route.fulfill({ status, headers, contentType: 'application/json', body: JSON.stringify(response) })
      return
    }
    if (url.origin === appOrigin) {
      await route.continue()
      return
    }
    await route.abort()
  })
  return requests
}

const card = (page: Page, number: number) => page.locator('.song-card').filter({ hasText: `確認曲${number}` })

test('Proの公開URLは既存ランクを変換して表示し、履歴・再読込でもモードを維持する', async ({ page, baseURL }) => {
  const requests = await mockScores(page, baseURL!, ['99.5%', '99%', '98%', 'AAA', null, '100%'])
  await page.goto('/dashboard/52?mode=Pro&view=detail#progress')

  await expect(page.getByRole('radio', { name: 'Pro', exact: true })).toBeChecked()
  await expect(card(page, 1).locator('.readonly')).toHaveText('99.5%')
  await expect(card(page, 2).locator('.readonly')).toHaveText('99.0%')
  await expect(card(page, 3).locator('.readonly')).toHaveText('<99.0%')
  await expect(card(page, 4).locator('.readonly')).toHaveText('<99.0%')
  await expect(card(page, 5).locator('.readonly')).toHaveText('')
  await expect(card(page, 6).locator('.card-surface')).toHaveCSS('background-color', 'rgb(230, 180, 34)')
  await expect(card(page, 6).locator('.excellent-label')).toHaveText('EXCELLENT!!!')

  await page.getByRole('radio', { name: 'Expert', exact: true }).check()
  await expect(page).toHaveURL(new URL('/dashboard/52?mode=Expert&view=detail#progress', baseURL!).href)
  await expect(card(page, 1).locator('.readonly')).toHaveText('99%')
  await page.getByRole('radio', { name: 'Normal', exact: true }).check()
  await expect(card(page, 1).locator('.readonly')).toHaveText('AAA+')
  await page.goBack()
  await expect(page.getByRole('radio', { name: 'Expert', exact: true })).toBeChecked()
  await page.goBack()
  await expect(page.getByRole('radio', { name: 'Pro', exact: true })).toBeChecked()
  await page.reload()
  await expect(page.getByRole('radio', { name: 'Pro', exact: true })).toBeChecked()
  await expect(card(page, 1).locator('.readonly')).toHaveText('99.5%')
  expect(requests.filter(({ method }) => method !== 'GET')).toEqual([])
})

for (const query of ['', '?mode=invalid', '?mode=Pro&mode=Expert']) {
  test(`モードが未指定または不正ならNormalを表示する: ${query || '未指定'}`, async ({ page, baseURL }) => {
    await mockScores(page, baseURL!, ['99.5%'])
    await page.goto(`/dashboard/52${query}`)
    await expect(page.getByRole('radio', { name: 'Normal', exact: true })).toBeChecked()
    await expect(card(page, 1).locator('.readonly')).toHaveText('AAA+')
  })
}

test('Proは0.1%ごとに絞り込め、目標の進捗を保存済みランクから計算する', async ({ page, baseURL }) => {
  const requests = await mockScores(page, baseURL!, ['99.5%', '99.9%', '100%', '99.4%', '99%', '98%', null], true)
  await page.goto('/dashboard/52?mode=Pro')
  await expect(page.locator('.song-card')).toHaveCount(7)
  await expect(page.locator('.goal-row select')).toHaveValue('<99.0%')
  await expect(page.getByRole('radio', { name: 'Pro', exact: true })).toBeChecked()
  expect(requests.filter(({ path, method }) => path === '/api/users/target' && method === 'PUT')).toEqual([])

  const expectedRanks = ['100%', '99.9%', '99.8%', '99.7%', '99.6%', '99.5%', '99.4%', '99.3%', '99.2%', '99.1%', '99.0%', '<99.0%']
  await expect(page.locator('.goal-row select option')).toHaveText(expectedRanks)
  await page.locator('.goal-row select').selectOption('99.5%')
  await expect(page.locator('.count-display')).toHaveText('3 / 7 (43%)')
  await expect.poll(() => requests.filter(({ path, method }) => path === '/api/users/target' && method === 'PUT').map(({ body }) => body)).toEqual([{ target: '99.5%' }])

  await page.locator('.all-chip input').uncheck()
  await page.locator('.filter-group').nth(1).getByText('FC', { exact: true }).locator('input').check()
  await page.locator('.filter-group').nth(1).getByText('未FC', { exact: true }).locator('input').check()
  await expect(page.locator('.song-card')).toHaveCount(0)
  await page.locator('.filter-group').first().getByText('99.5%', { exact: true }).locator('input').check()
  await expect(page.locator('.song-card')).toHaveCount(1)
  await expect(card(page, 1)).toBeVisible()
  await page.locator('.filter-group').first().getByText('99.5%', { exact: true }).locator('input').uncheck()
  await page.locator('.filter-group').first().getByText('<99.0%', { exact: true }).locator('input').check()
  await expect(page.locator('.song-card')).toHaveCount(1)
  await expect(card(page, 6)).toBeVisible()
})

test('低い表示モードでFCやメモを保存しても小数ランクを維持する', async ({ page, baseURL }) => {
  const requests = await mockScores(page, baseURL!, ['99.5%'], true)
  await page.goto('/dashboard/52?mode=Expert')
  await expect(card(page, 1).locator('select')).toHaveValue('99%')
  await card(page, 1).getByRole('checkbox').check()
  await expect.poll(() => requests.filter(({ path, method }) => path === '/api/scores/100' && method === 'PUT').map(({ body }) => body?.rank)).toEqual(['99.5%'])
  await page.getByRole('radio', { name: 'Normal', exact: true }).check()
  await expect(card(page, 1).locator('select')).toHaveValue('AAA+')
  await card(page, 1).locator('.title').click()
  await page.getByRole('textbox').fill('小数ランクを維持するメモ')
  await page.getByRole('button', { name: '保存', exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(requests.filter(({ path, method }) => path === '/api/scores/100' && method === 'PUT').map(({ body }) => body?.rank)).toEqual(['99.5%', '99.5%'])
  expect(requests.filter(({ path, method }) => path === '/api/scores/100' && method === 'PUT').at(-1)?.body?.memo).toBe('小数ランクを維持するメモ')
  await page.getByRole('radio', { name: 'Pro', exact: true }).check()
  await expect(card(page, 1).locator('select')).toHaveValue('99.5%')
  expect(requests.filter(({ path, method }) => path === '/api/users/target' && method === 'PUT')).toEqual([])
})

test('目標を連続変更しても古い保存応答で表示が戻らず、最後の目標を保存する', async ({ page, baseURL }) => {
  const requests = await mockScores(page, baseURL!, ['99.5%', '99.8%'], true, '98%', [400, 400])
  await page.goto('/dashboard/52?mode=Pro')
  const goal = page.locator('.goal-row select')
  await expect(goal).toHaveValue('<99.0%')
  const targetBodies = () => requests
    .filter(({ path, method }) => path === '/api/users/target' && method === 'PUT')
    .map(({ body }) => body)
  const lastSave = page.waitForResponse((response) =>
    new URL(response.url()).pathname === '/api/users/target' &&
    response.request().method() === 'PUT' &&
    response.request().postDataJSON().target === '99.8%',
  )

  await goal.selectOption('99.5%')
  await expect.poll(targetBodies).toEqual([{ target: '99.5%' }])
  await goal.selectOption('99.8%')
  await expect(goal).toHaveValue('99.8%')
  // 2件目が届いた時点では、1件目は完了し、2件目の応答はまだ保留中。
  await expect.poll(targetBodies, { intervals: [20] }).toEqual([{ target: '99.5%' }, { target: '99.8%' }])
  await expect(goal).toHaveValue('99.8%')
  await (await lastSave).finished()
  await page.reload()
  await expect(goal).toHaveValue('99.8%')
})

test('保存済み99.0%未満はNormalとExpertでも範囲のまま表示・保存する', async ({ page, baseURL }) => {
  await mockScores(page, baseURL!, ['<99.0%', '99.5%'])
  for (const mode of ['Normal', 'Expert']) {
    await page.goto(`/dashboard/52?mode=${mode}`)
    await expect(card(page, 1).locator('.readonly')).toHaveText('<99.0%')
    const bucket = page.locator('.filter-group').first().getByText('<99.0%', { exact: true }).locator('input')
    await expect(bucket).toBeChecked()
    await bucket.uncheck()
    await expect(card(page, 1)).toHaveCount(0)
    await bucket.check()
    await expect(card(page, 1)).toBeVisible()
  }

  const requests = await mockScores(page, baseURL!, ['<99.0%'], true)
  await page.goto('/dashboard/52?mode=Expert')
  await expect(card(page, 1).locator('select')).toHaveValue('<99.0%')
  await card(page, 1).getByRole('checkbox').check()
  await expect.poll(() => requests.filter(({ path, method }) => path === '/api/scores/100' && method === 'PUT').map(({ body }) => body?.rank)).toEqual(['<99.0%'])
  await page.getByRole('radio', { name: 'Normal', exact: true }).check()
  await expect(card(page, 1).locator('select')).toHaveValue('<99.0%')
  await card(page, 1).getByRole('checkbox').uncheck()
  await expect.poll(() => requests.filter(({ path, method }) => path === '/api/scores/100' && method === 'PUT').map(({ body }) => body?.rank)).toEqual(['<99.0%', '<99.0%'])
})

test('Normalの保存済みAAA+目標はAAA+のスコアを達成数に含める', async ({ page, baseURL }) => {
  const requests = await mockScores(page, baseURL!, ['AAA+', '95%', '99.5%', 'AAA', null], true, 'AAA+')
  await page.goto('/dashboard/52?mode=Normal')
  await expect(page.locator('.goal-row select')).toHaveValue('AAA+')
  await expect(page.locator('.count-display')).toHaveText('3 / 5 (60%)')
  expect(requests.filter(({ path, method }) => path === '/api/users/target' && method === 'PUT')).toEqual([])
})

test('Proの新規スコアと100%を保存し、100%はFCと金色になる', async ({ page, baseURL }) => {
  const requests = await mockScores(page, baseURL!, [null], true)
  await page.goto('/dashboard/52?mode=Pro')
  await card(page, 1).locator('select').selectOption('99.3%')
  await expect.poll(() => requests.filter(({ path, method }) => path === '/api/scores' && method === 'POST').map(({ body }) => body?.rank)).toEqual(['99.3%'])
  await page.reload()
  await expect(card(page, 1).locator('select')).toHaveValue('99.3%')
  await card(page, 1).locator('select').selectOption('100%')
  await expect.poll(() => requests.filter(({ path, method }) => path === '/api/scores/201' && method === 'PUT').map(({ body }) => body?.rank)).toEqual(['100%'])
  const saved = requests.find(({ path, method }) => path === '/api/scores/201' && method === 'PUT')!
  expect(Boolean(saved.body?.fc)).toBe(true)
  await expect(card(page, 1).getByRole('checkbox')).toBeChecked()
  await expect(card(page, 1).getByRole('checkbox')).toBeDisabled()
  await expect(card(page, 1).locator('.card-surface')).toHaveCSS('background-color', 'rgb(230, 180, 34)')
})

test('スマートフォン幅でProのカードと小数ランクを重ねずに表示する', async ({ page, baseURL }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await mockScores(page, baseURL!, ['99.5%', '99.9%', '100%', '<99.0%'])
  await page.goto('/dashboard/52?mode=Pro')
  await expect(page.locator('.song-card')).toHaveCount(4)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
  for (let number = 1; number <= 4; number++) {
    const bounds = await card(page, number).boundingBox()
    const titleBounds = await card(page, number).locator('.title').boundingBox()
    const rankBounds = await card(page, number).locator('.readonly').boundingBox()
    expect(titleBounds!.y + titleBounds!.height).toBeLessThanOrEqual(rankBounds!.y)
    expect(rankBounds!.y + rankBounds!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height)
  }
})
