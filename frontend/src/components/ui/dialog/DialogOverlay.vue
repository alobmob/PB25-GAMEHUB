<script setup>
import { inject } from 'vue'

const close = inject('dialogClose')
</script>

<template>
  <div
      class="fixed inset-0 z-40 bg-black/50"
      @click="close && close()"
  />
</template>