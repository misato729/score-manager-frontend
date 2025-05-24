import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rank, Mode } from '@/types'
import { NormalRankScale, ExpertRankScale } from '@/utils/rank'
import { useFilterStore } from './filterStore'

export const useUiStore = defineStore('ui', () => {
  // ✅ グローバルUI状態
  const mode = ref<Mode>('Normal') // 'Normal' or 'Expert'
  const editMode = ref(false)      // 編集モードON/OFF
  const selectedRank = ref<Rank>('AAA') // 目標ランク

  // ✅ getter：モードが Expert かどうか
  const isExpertMode = computed(() => mode.value === 'Expert')

  // ✅ setter：モードを切り替える＋副作用処理
  function setMode(newMode: Mode) {
    mode.value = newMode
  
    const validRanks = Array.from(
      newMode === 'Normal' ? NormalRankScale : ExpertRankScale
    )
  
    if (!validRanks.includes(selectedRank.value)) {
      selectedRank.value = validRanks[0] as Rank
    }
  
    const filterStore = useFilterStore()
    filterStore.clearInvalidRanks(validRanks)
  }  

  return {
    mode,
    editMode,
    selectedRank,
    setMode,
    isExpertMode
  }
})
