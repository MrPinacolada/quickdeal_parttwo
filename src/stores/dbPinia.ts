import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import quickdealFIRESTORE from '@/firebase/config'
import { collection, getDocs } from 'firebase/firestore'

interface DefStoreState {
  ymScript: HTMLScriptElement | null
  ymCoords: any
  firebaseUsers: any
  currentFirestoreID: number
}

export const Store = defineStore('DefStore', {
  state: (): DefStoreState => ({
    ymScript: null,
    ymCoords: null,
    firebaseUsers: null,
    currentFirestoreID: 0
  }),
  actions: {
    async getUsers() {
      let querySnapshot = await getDocs(collection(quickdealFIRESTORE, 'parttwo'))
      querySnapshot.forEach((doc) => {
        this.firebaseUsers = doc.data().AllUsers
        this.currentFirestoreID = doc.data().idCounter
      })
    }
  }
})
