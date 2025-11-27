<script setup>
const props = defineProps({
  placeholder: String
})
</script>

<template>
  <span data-slot="select-value" class="line-clamp-1">
    <slot>{{ props.placeholder }}</slot>
  </span>
</template>