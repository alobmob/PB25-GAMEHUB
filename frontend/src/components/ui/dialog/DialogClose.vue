<script setup>
import { inject } from 'vue'
import { X } from 'lucide-vue-next'

const close = inject('dialogClose')
</script>

<template>
  <button
      class="absolute right-4 top-4 opacity-70 hover:opacity-100"
      @click="close && close()"
  >
    <X class="size-4" />
  </button>
</template>