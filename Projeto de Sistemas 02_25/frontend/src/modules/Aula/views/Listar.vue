<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import {
  listarAula,
  excluirAulas,
} from '../controllers/aula'
import type { Aula } from '../types/aula'



const ui = useUiStore()
const headers = [

]
const items = ref<Aula[]>([])

const carregarAulas = async () => {
  const aula = await listarAula()
  items.value = aula
}

const router = useRouter()
const editarAula = (cls: Aula) => {
  router.push({ name: 'aula-criar', params: { id: cls.Id }})
}

const excluiraula = async (cls: Aula[]) => {
  const ids = cls.map((a) => a.Id)
  await excluirAulas(ids)
  await carregarAulas()
}

onBeforeMount(carregarAulas)
</script>

<template>
  <data-table
    :headers="headers"
    :items="items"
    @editar="editarAula"
    @excluir="excluiraula"
  />
</template>