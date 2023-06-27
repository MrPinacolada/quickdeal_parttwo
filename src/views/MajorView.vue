<template>
  <div class="form-container">
    <button @click="HandleShowForm = !HandleShowForm" v-if="!HandleShowForm">Open form</button>
    <form @submit.prevent v-if="HandleShowForm">
      <label>Type your full name: </label>
      <vue-dadata
        class="error-borders"
        v-model="dadata"
        placeholder="Djon Doe"
        debounceWait="100ms"
        url="https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio"
        token="5b9b34781d705471a6dedf3d4a4b1acd1d6dee48"
      />
      <label>Your age: </label>
      <nav>
        <input v-model="value" type="number" required />
        <span class="error-span">{{ errorMessage }}</span>
      </nav>
      <label>Pick your current location:</label>
      <button type="button" @click="HandleShowMap = !HandleShowMap">
        {{ !HandleShowMap ? 'Show map' : 'Hide map' }}
      </button>
      <div class="hide-YM-map" :class="{ 'hidden-YM-map': !HandleShowMap }">
        <YM />
      </div>
      <label for="">Who is your boss?</label>
      <select name="" id="" v-for="user in store.$state.firebaseUsers">
        <option value="">{{ user.name }}</option>
        <option value="">No one</option>
      </select>
      <button @click="addUser()" class="submButt">Add User</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useField } from 'vee-validate'
import { VueDadata } from 'vue-dadata'
import YM from '@/components/YM.vue'
import 'vue-dadata/dist/style.css'
import { Store } from '@/stores/dbPinia'
import quickdealFIRESTORE from '@/firebase/config'
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore'
let store = Store()
let props = defineProps({
  age: {
    type: String,
    required: true
  }
})
interface Employee {
  age: number
  bossid: number
  geoLat: number
  geoLong: number
  id: number
  name: string
}
let HandleShowForm = ref(false)
let HandleShowMap = ref(false)
let dadata = ref('')
let bossid = ref(0)
let currentID = 0
let CheckAge = (value: number) => {
  if (Number.isInteger(value) && value >= 18) {
    return true
  }
  if (!Number.isInteger(value)) {
    return 'You should not use comma'
  }
  return 'You are not old enough'
}
let { errorMessage, value } = useField(() => props.age, CheckAge)
let loadUsers = async () => {
  let querySnapshot = await getDocs(collection(quickdealFIRESTORE, 'parttwo'))
  querySnapshot.forEach((doc) => {
    store.$state.firebaseUsers = doc.data().AllUsers
    currentID = doc.data().idCounter
  })
}
let addUser = async () => {
  if (store.$state.ymCoords) {
    let user: Employee = {
      age: value.value,
      bossid: bossid.value,
      geoLat: store.$state.ymCoords[0],
      geoLong: store.$state.ymCoords[1],
      id: currentID,
      name: dadata.value
    }
    let UserRef = doc(quickdealFIRESTORE, 'parttwo', 'Users')
    let userDoc = await getDoc(UserRef)
    let currentAllUsers = userDoc.data()?.AllUsers || []
    await updateDoc(UserRef, {
      AllUsers: [user, ...currentAllUsers],
      idCounter: (currentID += 1)
    })
  }
}
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.form-container {
  height: 100vh;
  display: grid;
  align-items: center;
  justify-items: center;
  overflow: hidden;
}
form {
  position: absolute;
  display: grid;
  width: 100%;
  height: fit-content;
  max-width: 420px;
  border: none;
  border-radius: 10px;
  background: whitesmoke;
  text-align: left;
  margin: 30px auto;
  padding: 60px;
  z-index: 21;
}
label {
  color: #aaa;
  text-transform: uppercase;
  margin: 25px 0px 15px;
  display: inline-block;
  font-size: 0.9em;
}
input,
select {
  display: block;
  border: none;
  width: 100%;
  box-sizing: border-box;
  background-color: whitesmoke;
  border-bottom: 1px solid #e2bebe;
  padding: 5px 6px;
  border-radius: 10px;
}
input:focus {
  outline: none;
  background-color: #aaa;
}
select:focus {
  outline: none;
}
.error-span {
  font-size: 0.8em;
  color: red;
}
button {
  border: none;
  padding: 10px;
  border-radius: 5px;
  background-color: #aaa;
}
.hide-YM-map {
  overflow: hidden;
  transition: height 0.45s ease-out;
  height: 300px;
}
.hidden-YM-map {
  height: 0px;
}
.submButt {
  margin-top: 20px;
  background-color: aquamarine;
  font-weight: 700;
  font-size: 1.1em;
}
.error-borders {
  border: 1px red solid;
  border-radius: 10px;
}
</style>
