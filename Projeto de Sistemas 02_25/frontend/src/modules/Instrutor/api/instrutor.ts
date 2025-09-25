/**
 * arquivo de api trata da parte de requisicao e suas configuracoes
 */
import adminApi, { adminApiConfig } from '@/api/admin'
import type {
  Instrutor,
  InstrutorCreateReq,
  InstrutorListRes,
  InstrutorCreateRes,
  InstrutorGetRes,
  InstrutorUpdateRes,
  InstrutorDeleteRes,
} from '../types/instrutor.d.ts'

const instrutorReqConf = {
  baseURL: adminApiConfig.baseURL + 'instrutor',
}

export const listarInstrutor = async () => {
  return await adminApi.get<InstrutorListRes>('/', instrutorReqConf)
}

export const criarInstrutor = async (instrutor: InstrutorCreateReq) => {
  return await adminApi.post<InstrutorCreateRes>('/', instrutor, instrutorReqConf)
}

export const obterInstrutor = async (id: string) => {
  const { data } = await adminApi.get<InstrutorGetRes>('/' + id, instrutorReqConf)
  return data.value[0]
}

export const atualizarInstrutor = async (instrutor: Instrutor) => {
  return await adminApi.put<InstrutorUpdateRes>('/' + instrutor.Id, instrutor, instrutorReqConf)
}

export const excluirInstrutor = async (id: string) => {
  return await adminApi.delete<InstrutorDeleteRes>('/' + id, instrutorReqConf)
}    