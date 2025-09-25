/**
 * arquivo de api trata da parte de requisicao e suas configuracoes
 */
import adminApi, { adminApiConfig } from '@/api/admin'
import type {
  Aula,
  AulaCreateReq,
  AulaListRes,
  AulaCreateRes,
  AulaGetRes,
  AulaUpdateRes,
  AulaDeleteRes,
} from '../types/aula.d.ts'

const aulaReqConf = {
  baseURL: adminApiConfig.baseURL + 'aula',
}

export const listarAula = async () => {
  return await adminApi.get<AulaListRes>('/', aulaReqConf)
}

export const criarAula = async (aula: AulaCreateReq) => {
  return await adminApi.post<AulaCreateRes>('/', aula, aulaReqConf)
}

export const obterAula = async (id: string) => {
  const { data } = await adminApi.get<AulaGetRes>('/' + id, aulaReqConf)
  return data.value[0]
}

export const atualizarAula = async (aula: Aula) => {
  return await adminApi.put<AulaUpdateRes>('/' + aula.Id, aula, aulaReqConf)
}

export const excluirAula = async (id: string) => {
  return await adminApi.delete<AulaDeleteRes>('/' + id, aulaReqConf)
}    