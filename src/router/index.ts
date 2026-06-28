import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import AccessDenied from '@/views/components/AccessDenied.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/orders',
    name: 'Orders',
    component: HomePage
  },
  {
    path: '/apps',
    name: 'Apps',
    component: HomePage
  },
  {
    path: '/contents',
    name: 'Contents',
    component: HomePage
  },
  {
    path: '/reports',
    name: 'Reports',
    component: HomePage
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDenied
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
