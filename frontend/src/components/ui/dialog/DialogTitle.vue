<script setup>
defineProps({
  class: String
})
</script>

<template>
  <h2
      class="text-lg font-semibold leading-none"
      :class="class"
  >
    <slot />
  </h2>
</template>