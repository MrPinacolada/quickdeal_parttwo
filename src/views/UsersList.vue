<template>
  <Cascader
    v-if="store.$state.firebaseUsers"
    placeholder="Workers list"
    :data="data"
    trigger="hover"
    v-width="800"
    change-on-select
    :render-format="format"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref,h } from 'vue'

import { Store } from '@/stores/dbPinia'
let store = Store()
const data = ref([] as any)
let users = computed(() => store.$state.firebaseUsers)
let format = (labels: any, selectedData: any) => {
  const index = labels.length - 1
  const data = selectedData[index] || false
  if (data && data.age) {
    return `${labels[index]} - ${data.age} years old ${h('div', { class: 'bar', innerHTML: 'hello' })}`
  }
  
  return labels[index]
}

const buildTree = (user: any) => {
  let children = users.value.filter((u: any) => u.bossid === user.id)
  if (children.length > 0) {
    user.children = children.map((child: any) => buildTree(child))
  }
  return {
    label: user.name,
    value: user.id,
    age: user.age,
    test:200,
    children: user.children || []
  }
}

const treeArray = () => {
  const rootUsers = users.value.filter((user: any) => user.bossid === 0)
  const tree = rootUsers.map((rootUser: any) => buildTree(rootUser))
  data.value = data.value.concat(tree)
}
const getUsers = async () => {
  await store.getUsers()
  treeArray()
}

onMounted(() => {
  getUsers()
})
</script>

<style scoped></style>
