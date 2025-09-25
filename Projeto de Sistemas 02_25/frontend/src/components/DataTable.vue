<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

interface DataTableHeader {
  title: string; // titulo da coluna
  value: string; // valor da coluna
}

type DataTableItem = Record<string, string | number>

interface DataTableProps {
  items: DataTableItem[]
  headers?: DataTableHeader[]
}

const { items, headers } = defineProps<DataTableProps>()


const processedHeaders = computed(() => {
  if (headers) {
    return headers
  } else if (items.length > 0) {
    return Object.keys(items[0]).map((key) => {
      return { title: key, value: key }
    })
  }
})

/* pode ser exportado como v-model ou defineExpose. deixar sem exportar por enquanto */
const selectedItems = reactive<Record<number, DataTableItem>>({})

/* import { watch } from 'vue'
watch(selectedItems, (newValue) => console.log(newValue)) */

const updateSelected = (index: number, event: Event) => {
  const checked = (event.target as HTMLInputElement | null)?.checked
  if (checked) {
    selectedItems[index] = items[index]
  } else {
    delete selectedItems[index]
  }
}

const selectAll = ref(false)
const toggleSelectAll = (event: Event) => {
  selectAll.value = !!(event.target as HTMLInputElement | null)?.checked
  if (selectAll.value) {
    items.forEach((item, index) => {
      selectedItems[index] = item
    })
  } else {
    items.forEach((_, index) => {
      delete selectedItems[index]
    })
  }
}


const emit = defineEmits<{
  editar: [id: DataTableItem];
  excluir: [ids: DataTableItem[]];
}>()

const editarDesabilitado = computed(() => {
  return Object.keys(selectedItems).length !== 1
})
const editar = () => {
  emit('editar', Object.values(selectedItems)[0])
}

const excluirDesabilitado = computed(() => {
  return Object.keys(selectedItems).length === 0
})
const excluir = () => {
  emit('excluir', Object.values(selectedItems))
}
</script>

<template>
  <div>
    <p-button
      class="mr-2"
      :disabled="editarDesabilitado"
      @click="editar"
    >
      Editar
    </p-button>

    <p-button
      variant="error"
      :disabled="excluirDesabilitado"
      @click="excluir"
    >
      Excluir
    </p-button>

    <table class="w-full mb-2">
      <thead>
        <tr class="border-b border-gray-400">
          <th class="w-8 py-2">
            <input type="checkbox"
              :value="selectAll"
              @input="toggleSelectAll"
            />
          </th>

          <th v-for="header in processedHeaders" class="text-left font-medium">{{ header.title }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in items" class="border-b border-gray-300 text-gray-600">
          <td class="text-center py-2">
            <input type="checkbox"
              :checked="!!selectedItems[index]"
              :value="selectedItems[index]"
              @input="(evt: Event) => updateSelected(index, evt)"
            />
          </td>

          <td v-for="header in processedHeaders">{{ item[header.value] }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end gap-4">
      <div class="flex gap-1">
        <span>Itens por página</span>

        <select class="border rounded-md py-1 px-3">
          <option>5</option>
          
          <option>10</option>
          
          <option>15</option>
        </select>
      </div>

      <div>
        1-5 de 20
      </div>

      <div class="flex gap-2">
        <p-button>|<</p-button>

        <p-button class="border"><</p-button>

        <p-button class="border">></p-button>

        <p-button class="border">>|</p-button>
      </div>
    </div>
  </div>
</template>