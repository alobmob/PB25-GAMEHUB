<script setup>
import { computed, provide, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)

const value = computed(() => props.modelValue)

const setValue = (val) => {
  emit('update:modelValue', val)
  open.value = false
}

provide('selectOpen', open)
provide('selectValue', value)
provide('selectSetValue', setValue)
</script>

<template>
  <div data-slot="select" class="relative">
    <slot />
  </div>
</template>