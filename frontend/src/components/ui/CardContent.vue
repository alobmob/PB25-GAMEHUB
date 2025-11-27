<script setup>
defineProps({
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
      data-slot="card-content"
      :class="['px-6 [&:last-child]:pb-6', $props.class]"
  >
    <slot />
  </div>
</template>