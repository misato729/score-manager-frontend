<template>
  <div class="visit-ranking">
    <header class="page-header">
      <p class="eyebrow">SHOP VISIT RANKING</p>
      <h1>店舗行脚数ランキング</h1>
      <p class="description">全国のプレイヤーの行脚店舗数をランキングで紹介します。</p>
    </header>

    <section class="ranking-card" aria-labelledby="ranking-title">
      <div class="card-header">
        <div>
          <p class="card-label">全国ランキング</p>
          <h2 id="ranking-title">行脚店舗数 TOP {{ ranking.length }}</h2>
        </div>
        <p class="updated-at">仮データ表示中</p>
      </div>

      <div class="ranking-table-wrapper">
        <table class="ranking-table">
          <thead>
            <tr>
              <th scope="col">順位</th>
              <th scope="col">ユーザー名</th>
              <th scope="col">行脚店舗数</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in ranking"
              :key="entry.userId"
              :class="{ 'top-rank': entry.rank <= 3 }"
            >
              <td class="rank-cell">
                <span class="rank-badge" :class="`rank-${entry.rank}`">
                  {{ entry.rank }}
                </span>
              </td>
              <td class="user-cell">{{ entry.userName }}</td>
              <td class="count-cell">
                <strong>{{ entry.visitedCount }}</strong>
                <span>店舗</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface VisitRankingEntry {
  rank: number
  userId: number
  userName: string
  visitedCount: number
}

const ranking: VisitRankingEntry[] = [
  { rank: 1, userId: 101, userName: 'Ryu', visitedCount: 128 },
  { rank: 2, userId: 102, userName: 'MISATO', visitedCount: 105 },
  { rank: 3, userId: 103, userName: 'Alice', visitedCount: 87 },
  { rank: 4, userId: 104, userName: 'REFLEC_FAN', visitedCount: 72 },
  { rank: 5, userId: 105, userName: 'Tomo', visitedCount: 64 },
  { rank: 6, userId: 106, userName: 'yuki', visitedCount: 51 },
  { rank: 7, userId: 107, userName: 'MOMO', visitedCount: 43 },
  { rank: 8, userId: 108, userName: 'KAZU', visitedCount: 36 },
  { rank: 9, userId: 109, userName: 'haru', visitedCount: 28 },
  { rank: 10, userId: 110, userName: 'RB_PLUS', visitedCount: 19 },
]
</script>

<style scoped>
.visit-ranking {
  min-height: 100%;
  padding: 64px 20px 80px;
  box-sizing: border-box;
}

.page-header {
  max-width: 880px;
  margin: 0 auto 32px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 10px;
  color: #6957c8;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.page-header h1 {
  margin: 0;
  color: #29253b;
  font-size: clamp(1.8rem, 5vw, 2.5rem);
}

.description {
  margin: 14px 0 0;
  color: #625f6e;
  line-height: 1.7;
}

.ranking-card {
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(105, 87, 200, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 32px rgba(49, 42, 87, 0.1);
}

.card-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 28px;
  border-bottom: 1px solid #e9e7f0;
}

.card-label,
.updated-at {
  margin: 0;
  color: #777282;
  font-size: 0.82rem;
}

.card-header h2 {
  margin: 5px 0 0;
  color: #302b45;
  font-size: 1.25rem;
}

.updated-at {
  padding: 6px 10px;
  border-radius: 999px;
  background: #f1effb;
  color: #6957c8;
  white-space: nowrap;
}

.ranking-table-wrapper {
  overflow-x: auto;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
}

.ranking-table th,
.ranking-table td {
  padding: 16px 28px;
  border-bottom: 1px solid #eeecf2;
  text-align: left;
}

.ranking-table th {
  background: #f8f7fb;
  color: #6c6877;
  font-size: 0.82rem;
  font-weight: 600;
}

.ranking-table th:first-child,
.rank-cell {
  width: 80px;
  text-align: center;
}

.ranking-table th:last-child,
.count-cell {
  text-align: right;
}

.ranking-table tbody tr:last-child td {
  border-bottom: 0;
}

.ranking-table tbody tr {
  transition: background-color 0.15s ease;
}

.ranking-table tbody tr:hover {
  background: #faf9fd;
}

.ranking-table tbody tr.top-rank {
  background: linear-gradient(90deg, rgba(255, 248, 226, 0.72), transparent 75%);
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #eeecf2;
  color: #595563;
  font-weight: 700;
}

.rank-badge.rank-1 {
  background: linear-gradient(135deg, #ffe887, #d9a81e);
  color: #654b00;
  box-shadow: 0 3px 8px rgba(200, 148, 0, 0.24);
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, #f2f4f7, #aeb5c0);
  color: #4a505a;
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, #f2c29e, #b87343);
  color: #61351d;
}

.user-cell {
  color: #34303f;
  font-weight: 600;
}

.count-cell strong {
  color: #5f4fc0;
  font-size: 1.15rem;
}

.count-cell span {
  margin-left: 5px;
  color: #777282;
  font-size: 0.82rem;
}

@media (max-width: 600px) {
  .visit-ranking {
    padding: 40px 12px 56px;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .description {
    font-size: 0.9rem;
  }

  .card-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
  }

  .ranking-table th,
  .ranking-table td {
    padding: 14px 16px;
  }

  .ranking-table th:first-child,
  .rank-cell {
    width: 54px;
  }

  .rank-badge {
    width: 30px;
    height: 30px;
  }
}
</style>
