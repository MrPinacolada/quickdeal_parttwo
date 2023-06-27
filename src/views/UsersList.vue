<template>
  <div class="employee-list">
    <h2>Employee List</h2>
    <ul>
      <UsersTree :employee="store.$state.firebaseUsers" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import UsersTree from '@/components/UsersTree.vue'
import { Store } from '@/stores/dbPinia'
let store = Store()

</script>

<style scoped>
.employee-list {
  font-family: Arial, sans-serif;
  padding: 20px;
}

ul {
  list-style-type: none;
  padding-left: 20px;
}

h2 {
  margin-bottom: 10px;
}
</style>
