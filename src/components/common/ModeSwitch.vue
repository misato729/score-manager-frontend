<template>
  <div class="mode-switch">
    <label class="radio-label">
      <input
        type="radio"
        name="mode"
        value="Normal"
        v-model="mode"
      />
      Normal
    </label>
    <span class="divider">/</span>
    <label class="radio-label">
      <input
        type="radio"
        name="mode"
        value="Expert"
        v-model="mode"
      />
      Expert
    </label>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
import type { Mode } from '@/types'
import { computed } from 'vue'

const uiStore = useUiStore()

// ✅ v-model連携：getter/setterでリアルタイムに反映
const mode = computed<Mode>({
  get: () => uiStore.mode,
  set: (newMode) => {
    uiStore.setMode(newMode)
  }
})
</script>

<style scoped>
.mode-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-label {
  font-size: 16px;
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 4px;
}

.radio-label input[type='radio'] {
  accent-color: black;
  width: 18px;
  height: 18px;
}

.divider {
  color: #999;
  font-size: 16px;
}
</style>
