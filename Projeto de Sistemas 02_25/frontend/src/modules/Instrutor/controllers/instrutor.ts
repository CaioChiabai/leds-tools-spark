/**
 * arquivo controller trata da parte de erros e interface de usuario
 */
import {
  criarInstrutor as _criarInstrutor,
  listarInstrutor as _listarInstrutor,
  obterInstrutor as _obterInstrutor,
  atualizarInstrutor as _atualizarInstrutor,
  excluirInstrutor as _excluirInstrutor,
} from '../api/instrutor'
import type { Instrutor, InstrutorCreateReq } from '../types/instrutor'
import { useUiStore } from '@/stores/ui'
import { AxiosError } from 'axios'

export const listarInstrutor = async () => {
  try {
    const { data } = await _listarInstrutor()
    return data.value
  } catch (error) {
    throw error
  }
}

export const criarInstrutor = async (instrutor: InstrutorCreateReq) => {
  const ui = useUiStore()

  try {
    const { data } = await _criarInstrutor(instrutor)

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

export const obterInstrutor = async (id: string) => {
  try {
    const data = await _obterInstrutor(id)
    return data
  } catch (error) {
    throw error
  }
}

export const atualizarInstrutor = async (instrutor: Instrutor) => {
  try {
    const { data } = await _atualizarInstrutor(instrutor)
    return true
  } catch (error) {
    throw error
  }
}

export const excluirInstrutor = async (id: string) => {
  try {
    const { data } = await _excluirInstrutor(id)
    return true
  } catch (error) {
    throw error
  }
}

export const excluirInstrutors = async (ids: string[]) => {
  try {
    for (const id of ids) {
      const sucesso = await excluirInstrutor(id)
    }
    return true
  } catch (error) {
    throw error
  }
}    