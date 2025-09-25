import type { RouteRecordRaw } from 'vue-router'
import Listar from '../views/Listar.vue'
import Criar from '../views/Criar.vue'

export const routes: RouteRecordRaw[] = [
  {
    name: 'aula-home',
    path: 'home',
    component: Listar,
  },
  {
    name: 'aula-criar',
    path: 'criar/:id?',
    component: Criar,
  }
]