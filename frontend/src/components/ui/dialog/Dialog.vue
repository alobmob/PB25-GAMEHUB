<script setup>
import { provide } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:open'])

const close = () => {
  emit('update:open', false)
}

provide('dialogClose', close)
</script>

<template>
  <div v-if="open">
    <slot />
  </div>
</template>