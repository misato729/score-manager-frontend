<template>
  <div class="song-card">
    <div v-if="showGlow" class="backglow" :class="{ excellent: isExcellent, fc: !isExcellent && isFC }" />
    <div v-if="isExcellent" class="excellent-label">EXCELLENT!!!</div>
    <div v-else-if="isFC" class="fc-label">FULL COMBO!!</div>

    <div class="card-surface" :style="{ backgroundColor: rankColor }">
      <div
        class="title"
        ref="titleRef"
        :style="{ marginTop: isLongTitle ? '11px' : '24px' }"
      >
        {{ localSong.title }}
      </div>
      <div class="bottom">
        <select v-model="localSong.rank" :disabled="!editable">
          <option v-for="rank in currentRanks" :key="rank" :value="rank">{{ rank }}</option>
        </select>
        <label>
          <input type="checkbox" v-model="localSong.fc" :disabled="fcLocked" />
          FC
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ref, onMounted, nextTick } from 'vue'
import type { Song } from '@/types'
import { getRankColor, rankDisplay } from '@/utils/rank'
import { useUiStore } from '@/stores/uiStore'

const props = defineProps<{ song: Song }>()
const uiStore = useUiStore()

const localSong = reactive({
  ...props.song,
  fc: Boolean(props.song.fc),
})

const mode = computed(() => uiStore.mode)
const isExcellent = computed(() => localSong.rank === '100%')
const isFC = computed(() => localSong.fc)
const showGlow = computed(() => isFC.value || isExcellent.value)
const fcLocked = computed(() => isExcellent.value)
const rankColor = computed(() => getRankColor(rankDisplay(localSong.rank, mode.value)))

const normalRanks = ['AAA+', 'AAA', 'AA', 'A', 'B', 'C']
const expertRanks = ['100%', '99%', '98%', '97%', '96%', '95%', 'AAA', 'AA', 'A', 'B', 'C']
const currentRanks = computed(() => (mode.value === 'Expert' ? expertRanks : normalRanks))

watch(() => localSong.rank, (newRank) => {
  if (newRank === '100%') {
    localSong.fc = true
  }
})

// ✅ タイトルの高さを計測して行数チェック
const titleRef = ref<HTMLElement | null>(null)
const isLongTitle = ref(false)

const checkTitleLines = () => {
  if (titleRef.value) {
    const lineHeight = 17 // CSSと合わせる
    const lines = Math.round(titleRef.value.clientHeight / lineHeight)
    isLongTitle.value = lines >= 3
  }
}

onMounted(() => nextTick(checkTitleLines))
watch(() => props.song.title, async () => {
  await nextTick()
  checkTitleLines()
})

const editable = true
</script>

<style scoped>
.song-card {
  position: relative;
  width: 120px;
  min-height: 120px;
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
}

.title {
  font-size: 13px;
  text-align: center;
  line-height: 17px;
  font-weight: bold;
  word-break: break-word;
  transition: margin 0.2s ease;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
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
  font-size: 12px;
  position: absolute;
  top: -18px;
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
</style>
