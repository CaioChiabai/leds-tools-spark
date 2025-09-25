import { defineStore } from 'pinia'
import { computed, ref, type ComputedRef, type Ref } from 'vue'



// tipo ruim. esperar vuetify implementar e expor o tipo
type Snackbar = Record<string, any>

interface PrivateUIStore {
  mensagensAlerta: Ref<Snackbar[]>
}
// pinia reclama quando usa uma store dentro da outra, por algum motivo
interface PrivateUIStore_ {
  mensagensAlerta: Snackbar[]
}
// https://masteringpinia.com/blog/how-to-create-private-state-in-stores
const usePrivateState = defineStore('ui-private', () => {
  const mensagensAlerta = ref<Snackbar>([])
  return {
    mensagensAlerta,
  } as PrivateUIStore
})


interface UIStore {
  mensagensAlerta: ComputedRef<Snackbar[]>
  exibirAlertas: (novaMsgAlerta: Snackbar) => boolean
  exibirAlerta: (novaMsgAlerta: Snackbar) => boolean
  fecharAlerta: (mensagensRestantes: Snackbar[]) => boolean
  carregando: Ref<boolean>
  mostrarBarraLateral: Ref<boolean>
}
export const useUiStore = defineStore('ui', () => {
  const privado = usePrivateState() as unknown as PrivateUIStore_

  const mensagensAlerta = computed(() => privado.mensagensAlerta)

  const exibirAlertas = (
    novasMensagens: Snackbar[]
  ) => {
    privado.mensagensAlerta.splice(0, 0, ...novasMensagens)
    return true
  }
  const exibirAlerta = (
    novaMsgAlerta: Snackbar
  ) => {
    return exibirAlertas([novaMsgAlerta])
  }

  const fecharAlerta = (mensagensRestantes: Snackbar[]) => {
    privado.mensagensAlerta = mensagensRestantes
    return true
  }

  const carregando = ref(false)

  const mostrarBarraLateral = ref(true)

  return {
    mensagensAlerta,
    exibirAlertas,
    exibirAlerta,
    fecharAlerta,
    carregando,
    mostrarBarraLateral
  } as UIStore
})