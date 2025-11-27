<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
      type="button"
      data-slot="checkbox"
      :class="[
      'peer border size-4 shrink-0 rounded-[4px] border bg-input-background transition-shadow shadow-xs outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      props.modelValue && 'bg-primary text-primary-foreground border-primary',
      props.class
    ]"
      @click="toggle"
  >
    <svg
        v-if="props.modelValue"
        class="size-3.5 text-current"
        viewBox="0 0 24 24"
    >
      <path d="M5 12l5 5l10-10" stroke="currentColor" fill="none" />
    </svg>
  </button>
</template>