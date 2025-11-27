<script setup>
import { inject } from 'vue'

const open = inject('selectOpen')

const props = defineProps({
  class: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'default'
  }
})

const toggle = () => {
  open.value = !open.value
}
</script>

<template>
  <button
      type="button"
      data-slot="select-trigger"
      :data-size="props.size"
      :class="[
      'border-input data-[placeholder]:text-muted-foreground flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50',
      props.size === 'default' ? 'h-9' : 'h-8',
      props.class
    ]"
      @click="toggle"
  >
    <slot />
    <svg class="size-4 opacity-50" viewBox="0 0 24 24">
      <path d="M7 10l5 5 5-5" stroke="currentColor" fill="none" />
    </svg>
  </button>
</template>