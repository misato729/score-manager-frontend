import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    mode: 'Normal' as 'Normal' | 'Expert',
  }),
  getters: {
    isExpert: (state) => state.mode === 'Expert',
  },
  actions: {
    setMode(newMode: 'Normal' | 'Expert') {
      this.mode = newMode
    },
  },
})
