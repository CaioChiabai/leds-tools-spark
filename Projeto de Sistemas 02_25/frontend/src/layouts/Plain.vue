<script setup lang="ts">
import { ref, provide, readonly } from 'vue'
import { chaveModal } from '@/types/ui'

const modal = ref(false)
const texto = ref('')
// usando readonly porque 'modal' nao deve ser mutado por outros
// componentes e nao e necessaria nenhuma transformacao em seu
// valor
const estaAberto = readonly(modal)
const abrirModal = (novoTexto?: string) => {
  texto.value = novoTexto || ''
  modal.value = true
}
const fecharModal = () => {
  modal.value = false
  texto.value = ''
}

// provide
provide(chaveModal, {
  estaAberto,
  abrirModal,
  fecharModal
})
</script>


<template>
  <v-app>
    <v-main>
      <v-container class="d-flex justify-center">
        <RouterView />
      </v-container>
    </v-main>

    <v-dialog
      v-model="modal"
      max-width="250px"
    >
      <v-card>
        <v-card-title class="d-flex ga-3">
          <v-icon color="orange">mdi-alert</v-icon>
          <span>Aviso!</span>

        </v-card-title>

        <v-card-text>{{ texto }}</v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="fecharModal"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>