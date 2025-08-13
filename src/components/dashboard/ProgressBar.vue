<template>
  <div class="progress-row">
    <!-- ラベル -->
    <span class="tier-label">{{ labelText }}</span>

    <!-- バー -->
    <div class="bar-wrapper">
      <div
        class="bar-filled"
        :style="{ width: percentage + '%', backgroundColor: barColor }"
      />
    </div>

    <!-- 数値 -->
    <span class="count-label">{{ achieved }} / {{ total }}</span>

    <!-- 詳細（任意） -->
    <div v-if="showDetail" class="detail-section">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getRankColor } from '@/utils/rank'

interface Props {
  tier: string                          // '全体' | 'FC' | 'S+' など
  achieved: number                      // この行の達成数
  total: number                         // この行の総数
  rank?: string                         // 色に使う（FC行は無視）
  showDetail?: boolean                  // デフォルトfalse
}

const props = defineProps<Props>()

const percentage = computed(() =>
  props.total === 0 ? 0 : Math.round((props.achieved / props.total) * 100)
)

const labelText = computed(() => {
  if (props.tier === '全体') return '全体'
  if (props.tier === 'FC') return 'FC'
  return `地力${props.tier}`
})

const barColor = computed(() => {
  if (props.tier === 'FC') return '#ff69b4'     // FCは固定色
  return props.rank ? getRankColor(props.rank) : '#ccc'
})
</script>

<style scoped>
.progress-row {
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
  font-size: 12px;
  flex-shrink: 0;
}
.detail-section {
  margin-top: 6px;
  font-size: 13px;
  color: #444;
}
</style>
