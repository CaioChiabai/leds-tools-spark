<script lang="ts" setup>
import NavGroup from './NavGroup.vue'
import NavItem from './NavItem.vue'
</script>

<template>
  <aside class="flex flex-col h-full px-4 py-6 text-white lg:px-2">
    <section class="flex flex-col grow items-center w-full h-14 px-5 space-x-2 bg-gray-0 z-30 lg:static lg:flex-col lg:justify-start lg:px-0 lg:space-x-0 lg:space-y-2 lg:bg-transparent">
      <!-- <NavItem to="/" label="Página inicial" /> -->

<NavGroup label="Instrutor">
  <NavItem :to="{ name: 'instrutor-home' }" label="Listar" />
  <NavItem :to="{ name: 'instrutor-criar' }" label="Criar" />
</NavGroup><NavGroup label="Automovel">
  <NavItem :to="{ name: 'automovel-home' }" label="Listar" />
  <NavItem :to="{ name: 'automovel-criar' }" label="Criar" />
</NavGroup><NavGroup label="Aluno">
  <NavItem :to="{ name: 'aluno-home' }" label="Listar" />
  <NavItem :to="{ name: 'aluno-criar' }" label="Criar" />
</NavGroup><NavGroup label="Aula">
  <NavItem :to="{ name: 'aula-home' }" label="Listar" />
  <NavItem :to="{ name: 'aula-criar' }" label="Criar" />
</NavGroup>

    </section>
  </aside>
</template>