<script setup>
import { ref, watch, provide } from 'vue'
import { cn } from '../utils'

const props = defineProps({
  modelValue: String,
  defaultValue: String,
  class: String
})

const emit = defineEmits(['update:modelValue'])

const current = ref(props.modelValue || props.defaultValue)

watch(
    () => props.modelValue,
    val => {
      if (val) current.value = val
    }
)

provide('tabsValue', current)
provide('tabsSetValue', val => emit('update:modelValue', val))
</script>

<template>
  <div :class="cn('flex flex-col gap-2', props.class)">
    <slot />
  </div>
</template>