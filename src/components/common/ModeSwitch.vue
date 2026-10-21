<template>
  <div class="mode-switch">
    <label class="radio-label">
      <input
        type="radio"
        name="mode"
        value="Normal"
        :checked="mode === 'Normal'"
        @change="emit('change', 'Normal')"
      />
      Normal
    </label>
    <span class="divider">/</span>
    <label class="radio-label">
      <input
        type="radio"
        name="mode"
        value="Expert"
        :checked="mode === 'Expert'"
        @change="emit('change', 'Expert')"
      />
      Expert
    </label>
    <span class="divider">/</span>
    <label class="radio-label">
      <input
        type="radio"
        name="mode"
        value="Pro"
        :checked="mode === 'Pro'"
        @change="emit('change', 'Pro')"
      />
      Pro
    </label>
  </div>
</template>

<script setup lang="ts">
import type { Mode } from '@/types'

defineProps<{ mode: Mode }>()
const emit = defineEmits<{ change: [mode: Mode] }>()
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
