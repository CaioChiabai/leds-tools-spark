<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const sair = async () => {
  const auth = useAuthStore()
  await auth.logout()
}
</script>

<template>
  <div class="flex flex-row w-screen h-screen">
    <nav class="flex flex-col justify-between w-sm border-r-2 border-zinc-500 bg-blue-800">
      <NavMenu />
      <p-button class="bg-blue-950" @click="sair">SAIR</p-button>
    </nav>
    <main class="flex justify-center items-center w-full">
      <router-view />
    </main>
  </div>
</template>