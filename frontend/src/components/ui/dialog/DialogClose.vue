<script setup>
import { X } from 'lucide-vue-next'
const emit = defineEmits(['click'])
</script>

<template>
  <button
      class="absolute right-4 top-4 opacity-70 hover:opacity-100"
      @click="emit('click')"
  >
    <X class="size-4" />
  </button>
</template>