import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Rank } from '@/types'

export const useUiStore = defineStore('ui', () => {
  // ✅ グローバルUI状態
  const editMode = ref(false)      // 編集モードON/OFF
  const selectedRank = ref<Rank>('AAA+') // 目標ランク

  return {
    editMode,
    selectedRank,
  }
})
