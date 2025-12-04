<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: undefined
  },
  checked: {
    type: Boolean,
    default: undefined
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'update:checked'])

const isChecked = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue
  }
  if (props.checked !== undefined) {
    return props.checked
  }
  return false
})

const toggle = () => {
  const next = !isChecked.value
  emit('update:modelValue', next)
  emit('update:checked', next)
}
</script>

<template>
  <button
      type="button"
      data-slot="checkbox"
      :class="[
      'peer border size-4 shrink-0 rounded-[4px] border bg-input-background transition-shadow shadow-xs outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      isChecked && 'bg-primary text-primary-foreground border-primary',
      props.class
    ]"
      @click="toggle"
  >
    <svg
        v-if="isChecked"
        class="size-3.5 text-current"
        viewBox="0 0 24 24"
    >
      <path d="M5 12l5 5l10-10" stroke="currentColor" fill="none" />
    </svg>
  </button>
</template>