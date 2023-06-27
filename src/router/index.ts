import { createRouter, createWebHashHistory } from 'vue-router'
import MajorView from '@/views/MajorView.vue'
import UserList from '@/views/UsersList.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MajorView
    },
    {
      path: '/list',
      name: 'UserList',
      component: UserList
    }
  ]
})

export default router
