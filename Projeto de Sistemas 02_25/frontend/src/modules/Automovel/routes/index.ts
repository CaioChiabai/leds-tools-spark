import type { RouteRecordRaw } from 'vue-router'
import Listar from '../views/Listar.vue'
import Criar from '../views/Criar.vue'

export const routes: RouteRecordRaw[] = [
  {
    name: 'automovel-home',
    path: 'home',
    component: Listar,
  },
  {
    name: 'automovel-criar',
    path: 'criar/:id?',
    component: Criar,
  }
]