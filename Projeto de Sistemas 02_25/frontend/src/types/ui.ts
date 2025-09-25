import type { InjectionKey, Ref } from "vue";



export const chaveModal = Symbol() as InjectionKey<{
  estaAberto: Readonly<Ref<boolean, boolean>>;
  abrirModal: (novoTexto?: string) => void;
  fecharModal: () => void;
}>