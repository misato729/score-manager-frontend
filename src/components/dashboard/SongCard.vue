<template>
  <div class="song-card">
    <!-- ✅ 光る演出 -->
    <div v-if="showGlow" class="backglow" :class="{ excellent: isExcellent, fc: !isExcellent && isFC }" />
    <div v-if="isExcellent" class="excellent-label">EXCELLENT!!!</div>
    <div v-else-if="isFC" class="fc-label">FULL COMBO!!</div>

    <div class="card-surface" :style="{ backgroundColor: rankColor }">
      <!-- ✅ タイトル -->
      <div
        class="title"
        ref="titleRef"
        :class="{ small: isTooLongTitle }"
        :style="{ marginTop: isTooLongTitle ? '14px' : isLongTitle ? '20px' : '28px' }"
      >
        {{ props.score.song.title }}
      </div>

      <!-- ✅ 編集可能（自分のスコアページ） -->
      <div v-if="props.editable" class="bottom">
        <select v-model="localRank" @change="onSave">
          <option v-for="rank in currentRanks" :key="rank" :value="rank">{{ rank }}</option>
        </select>
        <label>
          <input
            type="checkbox"
            v-model="localFc"
            :disabled="fcLocked"
            @change="onSave"
          />
          FC
        </label>
      </div>

      <!-- ✅ 閲覧モード（編集不可・チェックなし） -->
      <div v-else class="bottom readonly">
        <span>{{ rankDisplay(localRank, mode) }}{{ localFc ? ' / FC' : '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import type { Score } from '@/types'
import { getRankColor, rankDisplay } from '@/utils/rank'
import { useUiStore } from '@/stores/uiStore'
import { useScoreStore } from '@/stores/scoreStore'

const props = defineProps<{
  score: Score
  editable: boolean
}>()

const uiStore = useUiStore()
const scoreStore = useScoreStore()
const mode = computed(() => uiStore.mode)

const localRank = ref(props.score.rank)
const localFc = ref(Boolean(props.score.fc))

watch(() => props.score, (newScore) => {
  localRank.value = newScore.rank
  localFc.value = Boolean(newScore.fc)
}, { immediate: true })

watch(localRank, (newRank) => {
  if (newRank === '100%') {
    localFc.value = true
  }
})

const isExcellent = computed(() => localRank.value === '100%')
const isFC = computed(() => localFc.value)
const showGlow = computed(() => isFC.value || isExcellent.value)
const fcLocked = computed(() => isExcellent.value)
const rankColor = computed(() =>
  getRankColor(rankDisplay(localRank.value, mode.value)) || '#f2f2f2'
)

const normalRanks = ['AAA+', 'AAA', 'AA', 'A', 'B', 'C']
const expertRanks = ['100%', '99%', '98%', '97%', '96%', '95%', 'AAA', 'AA', 'A', 'B', 'C']
const currentRanks = computed(() => (mode.value === 'Expert' ? expertRanks : normalRanks))

const onSave = async () => {
  await scoreStore.saveScore(props.score.id, {
    rank: localRank.value,
    fc: localFc.value ? 1 : 0
  })
}

const titleRef = ref<HTMLElement | null>(null)
const isLongTitle = ref(false)
const isTooLongTitle = ref(false)

const checkTitleLines = () => {
  if (titleRef.value) {
    const el = titleRef.value
    const computedStyle = window.getComputedStyle(el)
    const lineHeightStr = computedStyle.lineHeight
    const fontSizeStr = computedStyle.fontSize

    const lineHeight =
      lineHeightStr === 'normal'
        ? parseFloat(fontSizeStr) * 1.2
        : parseFloat(lineHeightStr)

    const lines = Math.round(el.clientHeight / lineHeight)
    isLongTitle.value = lines >= 3
    isTooLongTitle.value = lines >= 4
  }
}

onMounted(() => nextTick(checkTitleLines))
watch(() => props.score.song.title, async () => {
  await nextTick()
  checkTitleLines()
})
</script>

<style scoped>
.song-card {
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  z-index: 0;
}

.card-surface {
  position: relative;
  z-index: 1;
  border-radius: 12px;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  border: 1px solid #ccc; /* 細めのグレーの境界線 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* ソフトな影 */
}

.title {
  font-size: 20px;
  text-align: center;
  line-height: 1.2;
  font-weight: bold;
  word-break: break-word;
  transition: margin 0.2s ease, font-size 0.2s ease;
}

.title.small {
  font-size: 16px;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.bottom.readonly {
  justify-content: center;
  font-size: 12px;
  color: #333;
}

.backglow {
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(1.1);
  width: 100%;
  height: 100%;
  border-radius: 12px;
  z-index: -1;
  filter: blur(6px);
  opacity: 0;
  animation: glow-in 0.3s ease-out forwards;
  pointer-events: none;
}

@keyframes glow-in {
  from {
    opacity: 0;
    transform: scale(1.05);
    filter: blur(20px);
  }
  to {
    opacity: 0.8;
    transform: scale(1.1);
    filter: blur(6px);
  }
}

.backglow.fc {
  background: #ffb6c1;
  box-shadow: 0 0 20px #ffb6c1;
}

.backglow.excellent {
  background: #E6B422;
  box-shadow: 0 0 20px #E6B422;
}

.fc-label,
.excellent-label {
  font-weight: bold;
  text-align: center;
  font-size: 14px;
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  pointer-events: none;
  white-space: nowrap;
}

.fc-label {
  color: #ff69b4;
}

.excellent-label {
  color: #E6B422;
}

@media (max-width: 400px) {
  .fc-label,
  .excellent-label {
    font-size: 10px;
  }
}
</style>
