<script setup>
const props = defineProps({
  open: Boolean
})

const emit = defineEmits(['update:open'])
</script>

<template>
  <div v-if="open">
    <slot />
  </div>
</template>