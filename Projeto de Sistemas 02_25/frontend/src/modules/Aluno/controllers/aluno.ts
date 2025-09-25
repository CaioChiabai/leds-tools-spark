/**
 * arquivo controller trata da parte de erros e interface de usuario
 */
import {
  criarAluno as _criarAluno,
  listarAluno as _listarAluno,
  obterAluno as _obterAluno,
  atualizarAluno as _atualizarAluno,
  excluirAluno as _excluirAluno,
} from '../api/aluno'
import type { Aluno, AlunoCreateReq } from '../types/aluno'
import { useUiStore } from '@/stores/ui'
import { AxiosError } from 'axios'

export const listarAluno = async () => {
  try {
    const { data } = await _listarAluno()
    return data.value
  } catch (error) {
    throw error
  }
}

export const criarAluno = async (aluno: AlunoCreateReq) => {
  const ui = useUiStore()

  try {
    const { data } = await _criarAluno(aluno)

    ui.exibirAlerta({
      text: data.message,
      color: 'success'
    })

    return true

  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response?.status === 400 &&
      error.response.data.errors
    ) {
      ui.exibirAlertas(
        error.response.data.errors
          .map((err: { mensagem: string }) => ({ text: err.mensagem, color: 'error' }))
      )

      return false

    } else {
      throw error
    }
  }
}

export const obterAluno = async (id: string) => {
  try {
    const data = await _obterAluno(id)
    return data
  } catch (error) {
    throw error
  }
}

export const atualizarAluno = async (aluno: Aluno) => {
  try {
    const { data } = await _atualizarAluno(aluno)
    return true
  } catch (error) {
    throw error
  }
}

export const excluirAluno = async (id: string) => {
  try {
    const { data } = await _excluirAluno(id)
    return true
  } catch (error) {
    throw error
  }
}

export const excluirAlunos = async (ids: string[]) => {
  try {
    for (const id of ids) {
      const sucesso = await excluirAluno(id)
    }
    return true
  } catch (error) {
    throw error
  }
}    