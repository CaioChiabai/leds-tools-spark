<script setup lang="ts">
import { computed } from 'vue'

export interface GenericTextInputProps {
  type?: 'text' | 'password';
  placeholder?: string;
  variant?: 'error' | 'default';
}

const {
  type = 'text',
  placeholder,
  variant = 'default'
} = defineProps<GenericTextInputProps>()

const value = defineModel()

const baseClass = 'w-full py-2 px-3 border-2 border-gray-600 rounded-sm placeholder:text-gray-400 '
const inputClass = computed(() => {
  if (variant === 'error') {
    return baseClass + 'border-red-400'
  }
  return baseClass
})

const emit = defineEmits<{
  keyupEnter: []
}>()

const emitEnter = () => {
  emit('keyupEnter')
}
</script>


<template>
  <input
    v-model="value"
    :class="inputClass"
    :type="type"
    :placeholder="placeholder"
    @keyup.enter="emitEnter"
  />
</template>