/**
 * arquivo de api trata da parte de requisicao e suas configuracoes
 */
import adminApi, { adminApiConfig } from '@/api/admin'
import type {
  Automovel,
  AutomovelCreateReq,
  AutomovelListRes,
  AutomovelCreateRes,
  AutomovelGetRes,
  AutomovelUpdateRes,
  AutomovelDeleteRes,
} from '../types/automovel.d.ts'

const automovelReqConf = {
  baseURL: adminApiConfig.baseURL + 'automovel',
}

export const listarAutomovel = async () => {
  return await adminApi.get<AutomovelListRes>('/', automovelReqConf)
}

export const criarAutomovel = async (automovel: AutomovelCreateReq) => {
  return await adminApi.post<AutomovelCreateRes>('/', automovel, automovelReqConf)
}

export const obterAutomovel = async (id: string) => {
  const { data } = await adminApi.get<AutomovelGetRes>('/' + id, automovelReqConf)
  return data.value[0]
}

export const atualizarAutomovel = async (automovel: Automovel) => {
  return await adminApi.put<AutomovelUpdateRes>('/' + automovel.Id, automovel, automovelReqConf)
}

export const excluirAutomovel = async (id: string) => {
  return await adminApi.delete<AutomovelDeleteRes>('/' + id, automovelReqConf)
}    