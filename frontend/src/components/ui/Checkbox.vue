<script setup>
const props = defineProps({
  checked: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:checked'])

const toggle = () => {
  emit('update:checked', !props.checked)
}
</script>

<template>
  <button
      type="button"
      data-slot="checkbox"
      :class="[
      'peer border size-4 shrink-0 rounded-[4px] border bg-input-background transition-shadow shadow-xs outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      props.checked && 'bg-primary text-primary-foreground border-primary',
      props.class
    ]"
      @click="toggle"
  >
    <svg
        v-if="props.checked"
        class="size-3.5 text-current"
        viewBox="0 0 24 24"
    >
      <path d="M5 12l5 5l10-10" stroke="currentColor" fill="none" />
    </svg>
  </button>
</template>