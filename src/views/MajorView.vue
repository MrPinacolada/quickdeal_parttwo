<template>
  <div class="form-container">
    <button @click="HandleShowForm = !HandleShowForm" v-if="!HandleShowForm">Open form</button>
    <nav v-if="!HandleShowForm">
      <RouterLink :to="{ name: 'UserList' }">
        <h3>or go to employee list</h3>
        <lottie-player
          src="https://assets3.lottiefiles.com/packages/lf20_t0g9na33.json"
          background="transparent"
          speed="1"
          style="width: 150px; height: 150px; cursor: pointer"
          loop
          autoplay
        ></lottie-player>
      </RouterLink>
    </nav>

    <form @submit.prevent v-if="HandleShowForm" class="animate__animated animate__flipInY">
      <div v-show="globalSucc || globalErr" class="globalDone">
        <lottie-player
          src="https://assets5.lottiefiles.com/packages/lf20_uk52xbuq.json"
          background="transparent"
          speed="1"
          style="width: 300px; height: 300px"
          autoplay
          v-if="globalSucc"
        ></lottie-player>
        <lottie-player
          src="https://assets7.lottiefiles.com/packages/lf20_qw8ewk7k.json"
          background="transparent"
          speed="1"
          style="width: 300px; height: 300px"
          autoplay
          v-if="globalErr"
        ></lottie-player>
      </div>
      <label>Type your full name: </label>
      <vue-dadata
        v-model="dadata"
        placeholder="Djon Doe"
        debounceWait="100ms"
        url="https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio"
        token="5b9b34781d705471a6dedf3d4a4b1acd1d6dee48"
      />
      <span class="error-span">{{ errorMessageName }}</span>

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
        <span class="error-span">{{ errorMessageMap }}</span>
      </div>
      <label for="">Who is your boss?</label>

      <select name="" id="" v-model="bossid">
        <option value="">No one</option>
        <option v-for="user in store.$state.firebaseUsers" :value="user.id">{{ user.name }}</option>
      </select>
      <button @click="addUser()" class="submButt">Add User</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useField } from 'vee-validate'
import { VueDadata } from 'vue-dadata'
import YM from '@/components/YM.vue'
import 'vue-dadata/dist/style.css'
import { Store } from '@/stores/dbPinia'
import quickdealFIRESTORE from '@/firebase/config'
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
let store = Store()
let props = defineProps({
  age: {
    type: String,
    required: true
  },
  name: {
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
let bossid = ref(null)
let globalErr = ref(false)
let globalSucc = ref(false)
const CheckAge = (value: number) => {
  if (Number.isInteger(value) && value >= 18) {
    return true
  }
  if (!Number.isInteger(value)) {
    return 'You should not use comma'
  }
  return 'You are not old enough'
}

let { errorMessage, value } = useField(() => props.age, CheckAge)
let errorMessageName = ref('')
let errorMessageMap = ref('')
const addUser = async () => {
  if (store.$state.ymCoords) {
    let user: Employee = {
      age: value.value,
      bossid: bossid.value ? bossid.value : 0,
      geoLat: store.$state.ymCoords[0],
      geoLong: store.$state.ymCoords[1],
      id: store.$state.currentFirestoreID,
      name: dadata.value
    }
    try {
      let UserRef = doc(quickdealFIRESTORE, 'parttwo', 'Users')
      let userDoc = await getDoc(UserRef)
      let currentAllUsers = userDoc.data()?.AllUsers || []
      await updateDoc(UserRef, {
        AllUsers: [user, ...currentAllUsers],
        idCounter: (store.$state.currentFirestoreID += 1)
      })
      globalSucc.value = true
      setTimeout(() => {
        location.reload()
      }, 2000)
    } catch (error) {
      console.error(error, 'something went wrong')
      globalErr.value = true
      setTimeout(() => {
        location.reload()
      }, 2000)
    }
  } else {
    console.log('something went wrong')
    errorMessageMap.value = 'This field if required'
  }
}
watch(dadata, () => {
  if (!dadata.value.length) {
    errorMessageName.value = 'This field if required'
  } else errorMessageName.value = ''
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
  position: relative;
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
  cursor: pointer;
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
.globalDone {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  z-index: 999;
}
</style>
