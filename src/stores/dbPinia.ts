import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const Store = defineStore('DefStore', () => {
  return {
    ymScript: null as HTMLScriptElement | null,
    ymCoords:null,
    firebaseUsers:null as any
  }
})
