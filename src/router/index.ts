import { createRouter, createWebHashHistory } from 'vue-router'
import MajorView from '@/views/MajorView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MajorView
    }
  ]
})

export default router
