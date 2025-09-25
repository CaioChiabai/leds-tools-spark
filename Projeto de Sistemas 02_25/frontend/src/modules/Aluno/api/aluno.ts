/**
 * arquivo de api trata da parte de requisicao e suas configuracoes
 */
import adminApi, { adminApiConfig } from '@/api/admin'
import type {
  Aluno,
  AlunoCreateReq,
  AlunoListRes,
  AlunoCreateRes,
  AlunoGetRes,
  AlunoUpdateRes,
  AlunoDeleteRes,
} from '../types/aluno.d.ts'

const alunoReqConf = {
  baseURL: adminApiConfig.baseURL + 'aluno',
}

export const listarAluno = async () => {
  return await adminApi.get<AlunoListRes>('/', alunoReqConf)
}

export const criarAluno = async (aluno: AlunoCreateReq) => {
  return await adminApi.post<AlunoCreateRes>('/', aluno, alunoReqConf)
}

export const obterAluno = async (id: string) => {
  const { data } = await adminApi.get<AlunoGetRes>('/' + id, alunoReqConf)
  return data.value[0]
}

export const atualizarAluno = async (aluno: Aluno) => {
  return await adminApi.put<AlunoUpdateRes>('/' + aluno.Id, aluno, alunoReqConf)
}

export const excluirAluno = async (id: string) => {
  return await adminApi.delete<AlunoDeleteRes>('/' + id, alunoReqConf)
}    