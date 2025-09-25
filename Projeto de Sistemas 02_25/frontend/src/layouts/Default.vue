<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'



const auth = useAuthStore()

const sair = async () => {
  await auth.logout()
}

const ui = useUiStore()
const tooltipBarra = computed(() => {
  if (ui.mostrarBarraLateral) {
    return 'Esconder barra lateral'
  }
  return 'Mostrar barra lateral'
})
</script>

<template>
  <v-app>

    <v-app-bar>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="ui.mostrarBarraLateral = !ui.mostrarBarraLateral"
        v-tooltip:end="tooltipBarra"
      />

      <v-snackbar-queue
        :model-value="ui.mensagensAlerta"
        @update:model-value="ui.fecharAlerta"
        max-width="400px" timer
      >
      </v-snackbar-queue>
    </v-app-bar>

    <v-navigation-drawer
      v-model="ui.mostrarBarraLateral"
    >

<v-list-item title="Instrutor" />

<v-divider />

<v-list-item link title="Mostrar lista" :to="{ name: 'instrutor-home' }"/>
<v-list-item link title="Registrar nova" :to="{ name: 'instrutor-criar' }" />

<v-divider /><v-list-item title="Automovel" />

<v-divider />

<v-list-item link title="Mostrar lista" :to="{ name: 'automovel-home' }"/>
<v-list-item link title="Registrar nova" :to="{ name: 'automovel-criar' }" />

<v-divider /><v-list-item title="Aluno" />

<v-divider />

<v-list-item link title="Mostrar lista" :to="{ name: 'aluno-home' }"/>
<v-list-item link title="Registrar nova" :to="{ name: 'aluno-criar' }" />

<v-divider /><v-list-item title="Aula" />

<v-divider />

<v-list-item link title="Mostrar lista" :to="{ name: 'aula-home' }"/>
<v-list-item link title="Registrar nova" :to="{ name: 'aula-criar' }" />

      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="sair" color="red" block>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <RouterView></RouterView>
      </v-container>
    </v-main>
  </v-app>
</template>