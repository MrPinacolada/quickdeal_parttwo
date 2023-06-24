<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import 'animate.css'
import { Store } from '@/stores/dbPinia'
import { onBeforeUnmount, onMounted } from 'vue'
let store = Store()
onMounted(() => {
  store.$state.ymScript = document.createElement('script')
  store.$state.ymScript.src =
    'https://api-maps.yandex.ru/2.1/?apikey=4fed172d-6fbb-4890-bd6b-17082df5c586&lang=ru_RU'
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
