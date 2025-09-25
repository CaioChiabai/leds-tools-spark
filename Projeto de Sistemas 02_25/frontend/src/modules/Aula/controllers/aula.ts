/**
 * arquivo controller trata da parte de erros e interface de usuario
 */
import {
  criarAula as _criarAula,
  listarAula as _listarAula,
  obterAula as _obterAula,
  atualizarAula as _atualizarAula,
  excluirAula as _excluirAula,
} from '../api/aula'
import type { Aula, AulaCreateReq } from '../types/aula'
import { useUiStore } from '@/stores/ui'
import { AxiosError } from 'axios'

export const listarAula = async () => {
  try {
    const { data } = await _listarAula()
    return data.value
  } catch (error) {
    throw error
  }
}

export const criarAula = async (aula: AulaCreateReq) => {
  const ui = useUiStore()

  try {
    const { data } = await _criarAula(aula)

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

export const obterAula = async (id: string) => {
  try {
    const data = await _obterAula(id)
    return data
  } catch (error) {
    throw error
  }
}

export const atualizarAula = async (aula: Aula) => {
  try {
    const { data } = await _atualizarAula(aula)
    return true
  } catch (error) {
    throw error
  }
}

export const excluirAula = async (id: string) => {
  try {
    const { data } = await _excluirAula(id)
    return true
  } catch (error) {
    throw error
  }
}

export const excluirAulas = async (ids: string[]) => {
  try {
    for (const id of ids) {
      const sucesso = await excluirAula(id)
    }
    return true
  } catch (error) {
    throw error
  }
}    