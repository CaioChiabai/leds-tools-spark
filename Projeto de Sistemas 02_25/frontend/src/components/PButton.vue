<!-- P de 'pretty', para ser curto e n conflitar com button nativo-->
<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'default' | 'error'
}>(), {
  variant: 'default'
})


const className = computed(() => {
  if (props.variant === 'default') {
    return 'py-1 px-3 rounded-md text-white cursor-pointer disabled:cursor-default bg-blue-800 disabled:bg-blue-800/50'
  } else {
    return 'py-1 px-3 rounded-md text-white cursor-pointer disabled:cursor-default bg-red-800 disabled:bg-red-800/50'
  }
})
</script>

<template>
  <button
    :class="className"
  >
    <slot />
  </button>
</template>