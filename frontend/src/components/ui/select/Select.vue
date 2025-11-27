<script setup>
import { ref, provide } from 'vue'

const open = ref(false)

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

provide('selectValue', props.modelValue)
provide('selectSetValue', (val) => emit('update:modelValue', val))
provide('selectOpen', open)
</script>

<template>
  <div data-slot="select">
    <slot />
  </div>
</template>