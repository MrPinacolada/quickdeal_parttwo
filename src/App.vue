<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import 'animate.css'
import { Store } from '@/stores/dbPinia'
import { onBeforeMount, onBeforeUnmount, onMounted } from 'vue'
import quickdealFIRESTORE from '@/firebase/config'
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
let store = Store()
onBeforeMount(() => {
  let loadUsers = async () => {
    let querySnapshot = await getDocs(collection(quickdealFIRESTORE, 'parttwo'))
    querySnapshot.forEach((doc) => {
      store.$state.firebaseUsers = doc.data().AllUsers
      store.$state.currentFirestoreID = doc.data().idCounter
    })
  }
  loadUsers()
})
onMounted(() => {
  store.$state.ymScript = document.createElement('script')
  store.$state.ymScript.src =
    'https://api-maps.yandex.ru/2.1/?apikey=7987e2d8-ac2d-4b86-b0bd-b355c982ed1a&lang=ru_RU'
  store.$state.ymScript.type = 'text/javascript'
  document.head.appendChild(store.$state.ymScript)
})
onBeforeUnmount(() => {
  if (store.$state.ymScript) {
    store.$state.ymScript.remove()
  }
})
</script>

<template>
  <RouterView />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  border: none;
}
h1,
h2,
h3,
p,
span,
a {
  margin: 0;
  padding: 0;
  text-decoration: none;
}
</style>
