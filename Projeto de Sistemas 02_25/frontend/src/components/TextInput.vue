<script lang="ts">
import { computed, watch } from 'vue'
import type { GenericTextInputProps } from './GenericTextInput.vue'
import type { ValidationResult, ValidationResultFunction } from '@/utils/regras'

export interface TextInputProps extends Omit<GenericTextInputProps, 'variant'> {
  rules?: ValidationResultFunction[];
}
</script>

<script setup lang="ts">

const value = defineModel()

const {
  type,
  placeholder,
  rules,
} = defineProps<TextInputProps>()

const hasRules = computed(() => {
  return rules !== undefined && rules.length > 0
})

const validationMessages = computed<ValidationResult[]>(() => {
  if (!hasRules.value) {
    return []
  }
  return (rules as ((value: any) => ValidationResult)[]).map((validarRegra) => {
    return validarRegra(value.value)
  })
})

const validationMessage = computed<string>(() => {
  return validationMessages.value.find((message) => {
    return typeof message === 'string'
  }) || ''
})

const isValid = computed<boolean>(() => {
  return validationMessages.value.every((valid) => {
    return valid === true
  })
})

const variant = computed(() => {
  if (isValid.value) {
    return 'default'
  } else {
    return 'error'
  }
})

const emit = defineEmits<{
  validationUpdate: [valid: boolean];
  keyupEnter: [];
}>()

const emitEnter = () => {
  emit('keyupEnter')
}

// pode ser feito tbm como v-model, expose
watch(isValid, (newValue) => {
  emit('validationUpdate', newValue)
})
</script>

<template>
  <div class="w-[280px]">
    <div class="h-[19px] mb-[16px]">
      <label class="">
        <slot />
      </label>
    </div>
    <generic-text-input
      class="mb-[8px]"
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      :variant="variant"
      @keyup-enter="emitEnter"
    />

    <div class="h-(--text-2xl) overflow-auto text-red-400">
      {{ validationMessage }}
    </div>
  </div>
</template>