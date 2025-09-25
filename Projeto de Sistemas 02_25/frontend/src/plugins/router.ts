import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import { routes as rootRoutes } from '@/routes'
import { routes as moduleRoutes } from '@/modules'
import PlainLayout from '@/layouts/NewPlain.vue'
import DefaultLayout from '@/layouts/NewDefault.vue'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PlainLayout,
    children: rootRoutes,
  },
  {
    path: '/',
    component: DefaultLayout,
    children: moduleRoutes,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta?.requiresAuth) {
    if (auth.estaLogado()) {
      return true
    } else {
      return { name: 'login' }
    }
  } else {
    return true
  }
})
export default router