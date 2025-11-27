<script setup>
const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
      data-slot="select-label"
      :class="['text-muted-foreground px-2 py-1.5 text-xs', props.class]"
  >
    <slot />
  </div>
</template>