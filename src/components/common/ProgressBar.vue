<template>
  <div class="progress-bar-container">
    <!-- Tierラベル -->
    <span class="tier-label">{{ tier }}</span>

    <!-- バー -->
    <div class="bar-wrapper">
      <div
        class="bar-filled"
        :style="{
          width: percentage + '%',
          backgroundColor: rankColor
        }"
      />
    </div>

    <!-- 数値 -->
    <span class="count-label">{{ achieved }} / {{ total }}</span>
  </div>

  <!-- 詳細表示（スロット） -->
  <div v-if="showDetail" class="detail-section">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getRankColor } from '@/constants/rank'

interface Props {
  tier: string
  achieved: number
  total: number
  rank: string
  showDetail?: boolean
}

const props = defineProps<Props>()

const percentage = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.achieved / props.total) * 100)
})

const rankColor = computed(() => getRankColor(props.rank) || '#ccc')
</script>

<style scoped>
.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  margin-bottom: 6px;
}

.tier-label {
  width: 80px;
  font-weight: bold;
  text-align: right;
  flex-shrink: 0;
}

.bar-wrapper {
  flex: 1;
  height: 10px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
}

.bar-filled {
  height: 100%;
  transition: width 0.3s ease;
}

.count-label {
  width: 60px;
  text-align: left;
  color: #555;
  font-size: 13px;
  flex-shrink: 0;
}

.detail-section {
  margin-top: 6px;
  font-size: 13px;
  color: #444;
}
</style>
