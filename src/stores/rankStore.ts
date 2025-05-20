import { defineStore } from 'pinia'

export const useRankStore = defineStore('rank', {
  state: () => ({
    selectedRank: '', // 現在選択中のランク
  }),
  actions: {
    setRank(rank: string) {
      this.selectedRank = rank
    },
  },
})
