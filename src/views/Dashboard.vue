<template>
  <div class="dashboard-wrapper">
        <!-- ✅ 右上に浮かせるモードスイッチ -->
        <div class="floating-mode-switch">
      <ModeSwitch />
        </div>

    <!-- Progressカード -->
    <section class="card">
      <h2 class="section-title with-line">Progress</h2>

      <!-- 目標ランク選択と達成状況 -->
      <div class="goal-row">
        <label class="label">目標：</label>
        <RankSelect />
        <span class="count-display">{{ totalAchieved }} / {{ totalSongs }} ({{ percentDisplay }})</span>
        <button class="toggle-btn" @click="showDetail = !showDetail">
          {{ showDetail ? '詳細非表示' : '詳細表示' }}
        </button>
      </div>

      <!-- 全体バー -->
      <ProgressBar
        tier="全体"
        :achieved="totalAchieved"
        :total="totalSongs"
        :rank="selectedRank"
      />

      <!-- Collapse：Tier別 -->
      <Transition name="fade">
        <div v-if="showDetail" class="tier-progress-list">
          <ProgressBar
            v-for="tier in jirikiTiers"
            :key="tier.name"
            :tier="tier.name"
            :achieved="tier.achieved"
            :total="tier.total"
            :rank="selectedRank"
          />
        </div>
      </Transition>
    </section>

    <p></p>
    <!-- フィルターパネル -->
    <section class="card">
      <h2 class="section-title with-line">Tier</h2>
      <FilterPanel />
    </section>
  </div>
</template>

<script setup lang="ts">
import ModeSwitch from '@/components/common/ModeSwitch.vue'
import RankSelect from '@/components/filter/RankSelect.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import FilterPanel from '@/components/filter/FilterPanel.vue'
import { ref, computed } from 'vue'
import { useRankStore } from '@/stores/rankStore'

const showDetail = ref(false)
const rankStore = useRankStore()
const selectedRank = computed(() => rankStore.selectedRank)

// 仮データ（後で連携）
const totalAchieved = 42
const totalSongs = 126
const percentDisplay = computed(() =>
  `${Math.round((totalAchieved / totalSongs) * 100)}%`
)

const jirikiTiers = [
  { name: '地力S+', achieved: 0, total: 10 },
  { name: '地力S', achieved: 0, total: 12 },
  { name: '地力A+', achieved: 0, total: 14 },
  { name: '地力A', achieved: 0, total: 10 },
  { name: '地力B+', achieved: 2, total: 8 },
  { name: '地力B', achieved: 4, total: 10 },
  { name: '地力C', achieved: 6, total: 10 },
  { name: '地力D', achieved: 8, total: 10 },
  { name: '地力E', achieved: 10, total: 10 },
  { name: '地力F', achieved: 9, total: 10 },
]
</script>

<style scoped>
.dashboard-wrapper {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}
.floating-mode-switch {
  position: absolute;
  top: 20px; /* Headerとの距離を調整 */
  right: 0;
  z-index: 10;
}

/* 白いカード */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 24px;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
}

.with-line {
  border-left: 8px solid #a48be0; /* 紫ライン */
  padding-left: 12px;
}


/* タイトル */
.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

/* 選択列 */
.goal-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.label {
  font-weight: bold;
}

.count-display {
  font-size: 14px;
  color: #444;
}

.toggle-btn {
  padding: 4px 12px;
  font-size: 13px;
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
}

/* アニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tier-progress-list {
  margin-top: 12px;
}
</style>
