/**
 * arquivo controller trata da parte de erros e interface de usuario
 */
import {
  criarAutomovel as _criarAutomovel,
  listarAutomovel as _listarAutomovel,
  obterAutomovel as _obterAutomovel,
  atualizarAutomovel as _atualizarAutomovel,
  excluirAutomovel as _excluirAutomovel,
} from '../api/automovel'
import type { Automovel, AutomovelCreateReq } from '../types/automovel'
import { useUiStore } from '@/stores/ui'
import { AxiosError } from 'axios'

export const listarAutomovel = async () => {
  try {
    const { data } = await _listarAutomovel()
    return data.value
  } catch (error) {
    throw error
  }
}

export const criarAutomovel = async (automovel: AutomovelCreateReq) => {
  const ui = useUiStore()

  try {
    const { data } = await _criarAutomovel(automovel)

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

export const obterAutomovel = async (id: string) => {
  try {
    const data = await _obterAutomovel(id)
    return data
  } catch (error) {
    throw error
  }
}

export const atualizarAutomovel = async (automovel: Automovel) => {
  try {
    const { data } = await _atualizarAutomovel(automovel)
    return true
  } catch (error) {
    throw error
  }
}

export const excluirAutomovel = async (id: string) => {
  try {
    const { data } = await _excluirAutomovel(id)
    return true
  } catch (error) {
    throw error
  }
}

export const excluirAutomovels = async (ids: string[]) => {
  try {
    for (const id of ids) {
      const sucesso = await excluirAutomovel(id)
    }
    return true
  } catch (error) {
    throw error
  }
}    