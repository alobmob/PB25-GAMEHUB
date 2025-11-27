<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  class: {
    type: String,
    default: ''
  }
})

const variantClass = computed(() => {
  return {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90',
    destructive: 'border-transparent bg-destructive text-white hover:bg-destructive/90',
    outline: 'text-foreground hover:bg-accent hover:text-accent-foreground'
  }[props.variant]
})
</script>

<template>
  <span
      data-slot="badge"
      :class="[
      'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow] overflow-hidden',
      variantClass,
      $props.class
    ]"
  >
    <slot />
  </span>
</template>