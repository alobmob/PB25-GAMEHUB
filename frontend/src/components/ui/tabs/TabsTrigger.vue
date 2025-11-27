<script setup>
import { inject } from 'vue'
import { cn } from '../utils'

const props = defineProps({
  value: { type: String, required: true },
  class: String
})

const current = inject('tabsValue')
const setValue = inject('tabsSetValue')
</script>

<template>
  <button
      type="button"
      @click="setValue(props.value)"
      :class="cn(
      'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-1 text-sm font-medium whitespace-nowrap border border-transparent transition',
      current === props.value
        ? 'bg-card text-foreground'
        : 'text-muted-foreground',
      props.class
    )"
  >
    <slot />
  </button>
</template>