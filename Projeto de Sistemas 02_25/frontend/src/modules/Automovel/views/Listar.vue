<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import {
  listarAutomovel,
  excluirAutomovels,
} from '../controllers/automovel'
import type { Automovel } from '../types/automovel'



const ui = useUiStore()
const headers = [
    { value: 'placa', title: 'placa' }

]
const items = ref<Automovel[]>([])

const carregarAutomovels = async () => {
  const automovel = await listarAutomovel()
  items.value = automovel
}

const router = useRouter()
const editarAutomovel = (cls: Automovel) => {
  router.push({ name: 'automovel-criar', params: { id: cls.Id }})
}

const excluirautomovel = async (cls: Automovel[]) => {
  const ids = cls.map((a) => a.Id)
  await excluirAutomovels(ids)
  await carregarAutomovels()
}

onBeforeMount(carregarAutomovels)
</script>

<template>
  <data-table
    :headers="headers"
    :items="items"
    @editar="editarAutomovel"
    @excluir="excluirautomovel"
  />
</template>