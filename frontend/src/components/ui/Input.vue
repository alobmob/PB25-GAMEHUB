<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
      :type="type"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      class="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm shadow-sm transition-colors
           placeholder:text-muted-foreground
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
           disabled:cursor-not-allowed disabled:opacity-50"
  />
</template>