<template>
    <div class="mode-switch">
      <label>
        <input
          type="radio"
          value="Normal"
          v-model="mode"
          @change="onModeChange"
        />
        Normal
      </label>
      <span>/</span>
      <label>
        <input
          type="radio"
          value="Expert"
          v-model="mode"
          @change="onModeChange"
        />
        Expert
      </label>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useUiStore } from '@/stores/uiStore'
  import { computed } from 'vue'
  
  const uiStore = useUiStore()
  const mode = computed({
    get: () => uiStore.mode,
    set: (val) => uiStore.setMode(val),
  })
  
  const onModeChange = () => {
    // 必要があればここでイベント発行など
  }
  </script>
  
  <style scoped>
  .mode-switch {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    gap: 8px;
  }
  
  input[type="radio"] {
    margin-right: 4px;
  }
  </style>
  