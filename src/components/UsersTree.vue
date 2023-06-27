<template>
  <li v-for="item in employee">
    <p v-if="item.bossid == 0 || hasSubordinates(item.id)">
      {{ item.name }}
    </p>
    <ul v-if="hasSubordinates(item.id)">
      <UsersTree
        v-for="subordinate in getSubordinates(item.id)"
        :key="subordinate.id"
        :employee="getSubordinates(item.id)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { Store } from '@/stores/dbPinia'
import UsersTree from '@/components/UsersTree.vue'
let store = Store()
const props = defineProps({
  employee: {
    type: Array<Employee>,
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
function hasSubordinates(employeeId: number): boolean {
  return subordinatesOf(employeeId).length > 0
}

function getSubordinates(employeeId: number): Employee[] {
  return subordinatesOf(employeeId)
}

function subordinatesOf(bossId: number): Employee[] {
  return props.employee.filter((employee) => employee.bossid === bossId)
}
</script>
