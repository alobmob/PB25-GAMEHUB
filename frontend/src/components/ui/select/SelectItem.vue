<script setup>
import { inject } from 'vue'

const value = inject('selectValue')
const setValue = inject('selectSetValue')

const props = defineProps({
  value: String,
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
      data-slot="select-item"
      :class="[
      'flex items-center gap-2 rounded-sm py-1.5 px-2 pr-8 text-sm cursor-pointer select-none transition',
      'hover:bg-accent hover:text-accent-foreground',
      props.class
    ]"
      @click="setValue(props.value)"
  >
    <div class="flex items-center justify-center size-3.5 absolute right-2">
      <svg v-if="value === props.value" class="size-4" viewBox="0 0 24 24">
        <path d="M5 12l5 5l10 -10" stroke="currentColor" fill="none"/>
      </svg>
    </div>
    <span>{{ props.value }}</span>
  </div>
</template>