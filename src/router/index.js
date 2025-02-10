import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddDataView from '@/views/AddDataView.vue'
import CleanDataView from '@/views/CleanDataView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/add-data',
      name: 'addData',
      component: AddDataView,
    },
    {
      path: '/clean-data',
      name: 'cleanData',
      component: CleanDataView,
    },
  ],
})

export default router
