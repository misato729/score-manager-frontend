<template>
  <div class="song-card">
    <!-- ✅ 光エフェクト -->
    <div
      v-if="showGlow"
      class="backglow"
      :class="{ excellent: isExcellent, fc: !isExcellent && isFC }"
    />

    <!-- ✅ ラベル -->
    <div v-if="isExcellent" class="excellent-label">EXCELLENT!!!</div>
    <div v-else-if="isFC" class="fc-label">FULL COMBO!!</div>

    <!-- ✅ カード本体 -->
    <div class="card-surface" :style="{ backgroundColor: rankColor }">
      <div class="title">{{ localSong.title }}</div>

      <div class="bottom">
        <!-- ランク選択 -->
        <select v-model="localSong.rank" :disabled="!editable">
          <option v-for="rank in currentRanks" :key="rank" :value="rank">{{ rank }}</option>
        </select>

        <!-- FCチェック（100%時はロック） -->
        <label>
          <input type="checkbox" v-model="localSong.fc" :disabled="fcLocked" />
          FC
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, reactive } from 'vue'
import type { Song } from '@/types'
import { getRankColor, rankDisplay } from '@/utils/rank'
import { useUiStore } from '@/stores/uiStore'

const props = defineProps<{ song: Song }>()
const uiStore = useUiStore()

// ローカルコピー（親へはまだ反映しない）
const localSong = reactive({ ...props.song })

// 現在のモード
const mode = computed(() => uiStore.mode)

// モードに応じたランクリスト
const normalRanks = ['AAA+', 'AAA', 'AA', 'A', 'B', 'C']
const expertRanks = ['100%', '99%', '98%', '97%', '96%', '95%', 'AAA', 'AA', 'A', 'B', 'C']
const currentRanks = computed(() => (mode.value === 'Expert' ? expertRanks : normalRanks))

// ✅ 表示上のランクを取得（モード変換含む）
const displayRank = computed(() => rankDisplay(localSong.rank, mode.value))

// ✅ 色や演出制御（表示ランクに対応した色）
const rankColor = computed(() => getRankColor(displayRank.value))
const isFC = computed(() => localSong.fc)
const isExcellent = computed(() => localSong.rank === '100%')
const showGlow = computed(() => isFC.value || isExcellent.value)
const fcLocked = computed(() => localSong.rank === '100%')

// ✅ 100%ならFCを強制ON
watch(() => localSong.rank, (newRank) => {
  if (newRank === '100%') {
    localSong.fc = true
  }
})

// 今後切り替え可能にする前提でeditableは仮固定
const editable = true
</script>

<style scoped>
.song-card {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  z-index: 0;
}

.title {
  font-size: 13px;
  text-align: center;
  margin-top: 24px;
  line-height: 1.4;
  font-weight: bold;
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

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
</style>
