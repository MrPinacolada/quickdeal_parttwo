<template>
  <div class="list-container">
    <Table row-key="id" :columns="columns" :data="data" border>
      <template #action="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 5px" @click="ShowModal(row, row)"
          >Show map</Button
        >
      </template>
    </Table>
    <Modal ok-text="OK" cancel-text="Cancel" v-model="modal" title="Location">
      <div class="ym-wrapper">
        <div class="ymMap" :id="`mapYMforEach_${currentIndex}`"></div>
      </div>
    </Modal>
    <RouterLink :to="{ name: 'home' }">
      <h3 style="text-align: center">go back</h3>
      <lottie-player
        src="https://assets2.lottiefiles.com/packages/lf20_wsyyln4p.json"
        background="transparent"
        speed="1"
        style="width: 300px; height: 300px"
        loop
        autoplay
      ></lottie-player>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { Store } from '@/stores/dbPinia'
let store = Store()
let data = ref([] as any)
let modal = ref(false)
let currentIndex = ref(0)
let YMmap: any
let columns = [
  {
    title: 'Name',
    key: 'name',
    tree: true,
    sortable: true
  },
  {
    title: 'Age',
    key: 'age',
    sortable: true
  },
  {
    title: 'Action',
    slot: 'action',
    width: 250,
    align: 'center'
  }
]

const ShowModal = (data: Object, index: any) => {
  if (YMmap) {
    YMmap.destroy()
  }
  modal.value = !modal.value
  currentIndex.value = index.id
  nextTick(() => {
    ;(window as any).ymaps.ready(() => init(data))
  })
}

const users = computed(() => store.$state.firebaseUsers)
const buildTree = (user: any) => {
  let children = users.value.filter((u: any) => u.bossid === user.id)
  if (children.length > 0) {
    user.children = children.map((child: any) => buildTree(child))
  }
  return {
    name: user.name,
    id: user.id,
    age: user.age,
    long: user.geoLong,
    lat: user.geoLat,
    children: user.children || [],
    _showChildren: true
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

const init = (data: any) => {
  YMmap = new (window as any).ymaps.Map(
    `mapYMforEach_${currentIndex.value}`,
    {
      center: [data.lat, data.long],
      zoom: 9
    },
    {
      searchControlProvider: 'yandex#search'
    }
  )
  let myGeoObject = new (window as any).ymaps.GeoObject(
    {
      geometry: {
        type: 'Point',
        coordinates: [data.lat, data.long]
      },
      properties: {
        iconContent: 'I live here',
        hintContent: 'Right here1'
      }
    },
    {
      preset: 'islands#blackStretchyIcon'
    }
  )
  YMmap.geoObjects.add(myGeoObject)
}
onMounted(() => {
  getUsers()
})
</script>

<style scoped>
.list-container {
  padding: 50px;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-rows: 1fr 1fr;
}
.ym-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.ymMap {
  border-radius: 15px;
  margin-top: 10px;
  width: 420px;
  height: 300px;
}
</style>
