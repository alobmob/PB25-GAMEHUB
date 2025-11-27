<script setup>
import DialogOverlay from './DialogOverlay.vue'
import DialogClose from './DialogClose.vue'
</script>

<template>
  <DialogOverlay />

  <div
      class="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-white p-6 shadow-lg"
  >
    <slot />

    <DialogClose />
  </div>
</template>