<template>
    <div class="goal-modal">
      <h2 class="title">目標ランクを設定</h2>
  
      <!-- ランク選択 -->
      <RankSelect />
  
      <!-- 選択ランクの達成状況 -->
      <ProgressBar
        tier="全体"
        :achieved="dummyAchieved"
        :total="dummyTotal"
        :rank="selectedRank"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import RankSelect from '@/components/filter/RankSelect.vue'
  import ProgressBar from '@/components/common/ProgressBar.vue'
  import { useRankStore } from '@/stores/rankStore'
  import { computed } from 'vue'
  
  const rankStore = useRankStore()
  const selectedRank = computed(() => rankStore.selectedRank)
  
  // ✅ ダミーデータ（仮の達成数・全体数）
  const dummyAchieved = 42
  const dummyTotal = 126
  </script>
  
  <style scoped>
  .goal-modal {
    padding: 24px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 16px;
  }
  </style>
  