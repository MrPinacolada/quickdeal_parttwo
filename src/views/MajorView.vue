<template>
  <div class="form-container">
    <Button v-if="!HandleShowForm" @click="HandleShowForm = !HandleShowForm" type="primary"
      >Open form</Button
    >
    <Form
      @submit.prevent
      v-if="HandleShowForm"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80"
    >
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
      <FormItem label="Name" prop="name">
        <vue-dadata
          placeholder="Enter your name"
          v-model="formValidate.name"
          debounceWait="100ms"
          url="https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio"
          token="5b9b34781d705471a6dedf3d4a4b1acd1d6dee48"
        />
      </FormItem>
      <FormItem label="Age" prop="age">
        <Input v-model="formValidate.age" clearable placeholder="Enter your age"></Input>
      </FormItem>
      <FormItem label="Where do you live?" prop="map">
        <Button id="mapButt" type="dashed" @click="HandleShowMap = !HandleShowMap">
          {{ !HandleShowMap ? 'Show map' : 'Hide map' }}
        </Button>
        <div class="hide-YM-map" :class="{ 'hidden-YM-map': !HandleShowMap }">
          <YM />
        </div>
      </FormItem>

      <FormItem label="Your Boss" prop="boss">
        <Select v-model="formValidate.bossid" placeholder="Select your boss">
          <Option :value="0">No one</Option>
          <Option v-for="user in store.$state.firebaseUsers" :value="user.id">{{
            user.name
          }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="addUser()">Submit</Button>
      </FormItem>
    </Form>
    <RouterLink :to="{ name: 'UserList' }">
      <h3 style="text-align: center">or go to worker list</h3>
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
import { ref } from 'vue'
import type { Ref } from 'vue'
import { RouterLink } from 'vue-router'
import { VueDadata } from 'vue-dadata'
import 'vue-dadata/dist/style.css'
import YM from '@/components/YM.vue'
import Schema from 'async-validator'
import { Store } from '@/stores/dbPinia'
import quickdealFIRESTORE from '@/firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
let store = Store()
const formValidate = ref({
  name: '',
  age: '',
  bossid: 0,
  id: 0
})
let ruleValidate = ref({
  name: [{ type: 'stringr', required: true, message: 'The name cannot be empty', trigger: 'blur' }],
  age: [
    {
      type: 'number',
      asyncValidator: (rule: any, value: any) => {
        return new Promise<void>((resolve, reject) => {
          let parsedValue = parseFloat(value as string)
          if (isNaN(parsedValue)) {
            reject('Invalid input')
          } else if (parsedValue < 18) {
            reject('Too young')
          } else if (Number.isInteger(parsedValue)) {
            resolve()
          } else {
            reject('Floating point numbers are not allowed')
          }
        })
      },
      required: true,
      trigger: 'blur'
    }
  ]
})

// const validator = new Schema(ruleValidate.value);
let HandleShowForm = ref(false)
let HandleShowMap = ref(false)
let globalErr = ref(false)
let globalSucc = ref(false)
const addUser = async () => {
  if (store.$state.ymCoords) {
    let user = {
      age: formValidate.value.age,
      bossid: formValidate.value.bossid ? formValidate.value.bossid : 0,
      geoLat: store.$state.ymCoords[0],
      geoLong: store.$state.ymCoords[1],
      id: store.$state.currentFirestoreID,
      name: formValidate.value.name
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
  }
}
</script>

<style scoped>
.form-container {
  height: 100vh;
  display: grid;
  align-items: center;
  justify-items: center;
  overflow: hidden;
  background-color: grey;
}
form {
  position: relative;
  display: grid;
  width: 100%;
  height: fit-content;
  max-width: fit-content;
  border: none;
  border-radius: 10px;
  background: whitesmoke;
  text-align: left;
  margin: 30px auto;
  padding: 30px;
  z-index: 21;
}

.hide-YM-map {
  overflow: hidden;
  transition: height 0.45s ease-out;
  height: 300px;
}
.hidden-YM-map {
  height: 0px;
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
