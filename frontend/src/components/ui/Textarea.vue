<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  class: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const onInput = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <textarea
      data-slot="textarea"
      :class="`
      resize-none border-input placeholder:text-muted-foreground
      focus-visible:border-ring focus-visible:ring-ring/50
      aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
      aria-invalid:border-destructive dark:bg-input/30
      flex field-sizing-content min-h-16 w-full rounded-md border
      bg-input-background px-3 py-2 text-base
      transition-[color,box-shadow] outline-none focus-visible:ring-[3px]
      disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
      ${props.class}
    `"
      :value="modelValue"
      @input="onInput"
  />
</template>