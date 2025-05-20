// stores/filterStore.ts
import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filter', {
    state: () => ({
        selectedRanks: [] as string[],
        selectedFC: ['FC', '未FC'], // 
      }),
  actions: {
    setRanks(ranks: string[]) {
      this.selectedRanks = ranks
    },
    toggleFC() {
      this.showFC = !this.showFC
    },
    toggleNotFC() {
      this.showNotFC = !this.showNotFC
    },
  },
})


  