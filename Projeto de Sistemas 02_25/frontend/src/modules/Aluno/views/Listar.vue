<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import {
  listarAluno,
  excluirAlunos,
} from '../controllers/aluno'
import type { Aluno } from '../types/aluno'



const ui = useUiStore()
const headers = [
    { value: 'nome', title: 'nome' },
    { value: 'cpfstring', title: 'cpfstring' },
    { value: 'numero', title: 'numero' }

]
const items = ref<Aluno[]>([])

const carregarAlunos = async () => {
  const aluno = await listarAluno()
  items.value = aluno
}

const router = useRouter()
const editarAluno = (cls: Aluno) => {
  router.push({ name: 'aluno-criar', params: { id: cls.Id }})
}

const excluiraluno = async (cls: Aluno[]) => {
  const ids = cls.map((a) => a.Id)
  await excluirAlunos(ids)
  await carregarAlunos()
}

onBeforeMount(carregarAlunos)
</script>

<template>
  <data-table
    :headers="headers"
    :items="items"
    @editar="editarAluno"
    @excluir="excluiraluno"
  />
</template>