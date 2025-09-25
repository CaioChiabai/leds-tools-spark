import { type RouteRecordRaw } from 'vue-router'

import { routes as instrutorRoute } from './Instrutor'
import { routes as automovelRoute } from './Automovel'
import { routes as alunoRoute } from './Aluno'
import { routes as aulaRoute } from './Aula'


export const routes: RouteRecordRaw[] = [
  ...instrutorRoute,
  ...automovelRoute,
  ...alunoRoute,
  ...aulaRoute,

]