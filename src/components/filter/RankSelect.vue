<template>
    <select v-model="selected" @change="onChange" class="rank-select">
      <option disabled value=""></option>
      <option
        v-for="rank in rankOptions"
        :key="rank"
        :value="rank"
      >
        {{ rank }}
      </option>
    </select>
  </template>
  
  <script setup lang="ts">
  import { useUiStore } from '@/stores/uiStore'
  import { useRankStore } from '@/stores/rankStore'
  import { computed } from 'vue'
  import { NormalRankScale, ExpertRankScale } from '@/constants/rank'
  
  const uiStore = useUiStore()
  const rankStore = useRankStore()
  
  const rankOptions = computed(() =>
    uiStore.mode === 'Expert' ? ExpertRankScale : NormalRankScale
  )
  
  const selected = computed({
    get: () => rankStore.selectedRank,
    set: (val) => rankStore.setRank(val),
  })
  
  const onChange = () => {
    // 変更時の追加処理があればここに
  }
  </script>
  
  <style scoped>
  .rank-select {
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
  }
  </style>
  