<template>
  <div class="form-container">
    <button @click="HandleShowForm = !HandleShowForm" v-if="!HandleShowForm">Open form</button>
    <form @submit.prevent v-if="HandleShowForm">
      <label>Type your full name: </label>
      <vue-dadata
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
      <div class="hide-YM-map" v-if="HandleShowMap">
        <YM />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useField } from 'vee-validate'
import { VueDadata } from 'vue-dadata'
import YM from '@/components/YM.vue'
import 'vue-dadata/dist/style.css'

let props = defineProps({
  age: {
    type: String,
    required: true
  }
})

let HandleShowForm = ref(false)
let HandleShowMap = ref(false)
let dadata = ref('')
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
  animation: slit-in-vertical 0.45s ease-out both !important;
}

@keyframes slit-in-vertical {
  0% {
    height: 0px;
  }
  100% {
    height: 300px;
  }
}
</style>
