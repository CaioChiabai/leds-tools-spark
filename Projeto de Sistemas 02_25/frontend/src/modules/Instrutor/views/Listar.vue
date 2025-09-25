<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import {
  listarInstrutor,
  excluirInstrutors,
} from '../controllers/instrutor'
import type { Instrutor } from '../types/instrutor'



const ui = useUiStore()
const headers = [
    { value: 'nome', title: 'nome' },
    { value: 'cpfstring', title: 'cpfstring' },
    { value: 'numero', title: 'numero' }

]
const items = ref<Instrutor[]>([])

const carregarInstrutors = async () => {
  const instrutor = await listarInstrutor()
  items.value = instrutor
}

const router = useRouter()
const editarInstrutor = (cls: Instrutor) => {
  router.push({ name: 'instrutor-criar', params: { id: cls.Id }})
}

const excluirinstrutor = async (cls: Instrutor[]) => {
  const ids = cls.map((a) => a.Id)
  await excluirInstrutors(ids)
  await carregarInstrutors()
}

onBeforeMount(carregarInstrutors)
</script>

<template>
  <data-table
    :headers="headers"
    :items="items"
    @editar="editarInstrutor"
    @excluir="excluirinstrutor"
  />
</template>