import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { NormalRankScale, ExpertRankScale } from '@/utils/rank'
import { useUiStore } from './uiStore'

export const useFilterStore = defineStore('filter', () => {
  // 選択中のランク（複数選択可能）
  const selectedRanks = ref<string[]>([])

  // フルコンボ表示切替
  const showFC = ref(true)
  const showNotFC = ref(true)

  // ✅ FC/未FCのトグル関数
  function toggleFC() {
    showFC.value = !showFC.value
    ensureAtLeastOneFCVisible()
  }

  function toggleNotFC() {
    showNotFC.value = !showNotFC.value
    ensureAtLeastOneFCVisible()
  }

  // ✅ FC/未FCの両方OFFを防止
  function ensureAtLeastOneFCVisible() {
    if (!showFC.value && !showNotFC.value) {
      showFC.value = true
    }
  }

  // ✅ 指定ランクが選択中かどうか（templateで便利）
  function isRankSelected(rank: string) {
    return selectedRanks.value.includes(rank)
  }

  // ✅ ランクトグル（オンオフ切替）
  function toggleRank(rank: string) {
    if (selectedRanks.value.includes(rank)) {
      selectedRanks.value = selectedRanks.value.filter(r => r !== rank)
    } else {
      selectedRanks.value.push(rank)
    }
  }

  // ✅ モード切替時に無効なランクを除外
  function clearInvalidRanks(validRanks: string[]) {
    selectedRanks.value = selectedRanks.value.filter(rank => validRanks.includes(rank))
  }

  // ✅ 現在のモードに応じたランクスケール
  const currentRankScale = computed(() => {
    const uiStore = useUiStore()
    return uiStore.mode === 'Normal' ? NormalRankScale : ExpertRankScale
  })

  return {
    selectedRanks,
    showFC,
    showNotFC,
    toggleFC,
    toggleNotFC,
    toggleRank,
    clearInvalidRanks,
    isRankSelected,
    currentRankScale
  }
})
