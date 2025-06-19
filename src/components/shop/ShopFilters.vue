<template>
    <section class="card" style="max-width: 1000px;">
      <div class="filters">
        <!-- 検索バー -->
        <input
          v-model="modelKeyword"
          type="text"
          placeholder="店舗名・地名を検索"
        />
  
        <!-- フィルタチェックボックス -->
        <label><input type="checkbox" v-model="modelUnder100" /> 100円以下</label>
        <label><input type="checkbox" v-model="modelTwoOrMore" /> 2台以上</label>
  
        <!-- 都道府県選択 -->
        <label>
          都道府県：
          <select v-model="modelPrefecture">
            <option v-for="pref in prefectures" :key="pref" :value="pref">
              {{ pref }}
            </option>
          </select>
        </label>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  // Props（都道府県リスト）
  defineProps<{
    prefectures: string[]
  }>()
  
  // v-modelによる親とのバインディング
  const modelKeyword = defineModel<string>('keyword')
  const modelUnder100 = defineModel<boolean>('filterUnder100')
  const modelTwoOrMore = defineModel<boolean>('filterTwoOrMore')
  const modelPrefecture = defineModel<string>('selectedPrefecture')
  </script>
  
  <style scoped>
  .filters {
    display: flex;
    gap: 16px;
    margin: 16px 0;
    flex-wrap: wrap;
  }
  
  .filters input[type="text"] {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1;
    min-width: 200px;
  }
  </style>
  