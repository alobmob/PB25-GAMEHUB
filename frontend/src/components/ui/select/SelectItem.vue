<script setup>
import { inject, computed } from 'vue'

const selectValue = inject('selectValue')
const setValue = inject('selectSetValue')

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  class: {
    type: String,
    default: ''
  }
})

const isSelected = computed(() => selectValue.value === props.value)

const onClick = () => {
  setValue(props.value)
}
</script>

<template>
  <div
      data-slot="select-item"
      :class="[
      'relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm select-none transition',
      'hover:bg-accent hover:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      props.class
    ]"
      @click="onClick"
  >
    <span class="absolute right-2 flex size-3.5 items-center justify-center">
      <svg
          v-if="isSelected"
          class="size-4"
          viewBox="0 0 24 24"
      >
        <path d="M5 12l5 5l10-10" stroke="currentColor" fill="none" />
      </svg>
    </span>
    <span>
      <slot>{{ props.value }}</slot>
    </span>
  </div>
</template>