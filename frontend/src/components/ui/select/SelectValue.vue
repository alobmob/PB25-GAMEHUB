<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <span data-slot="select-value" class="line-clamp-1 flex items-center gap-2">
    <slot>
      <span class="text-muted-foreground" v-if="!$slots.default && !props.placeholder">
        Wybierz
      </span>
      <span v-else-if="props.placeholder && !$slots.default">
        {{ props.placeholder }}
      </span>
    </slot>
  </span>
</template>