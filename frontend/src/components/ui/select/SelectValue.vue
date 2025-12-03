<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  }
})

const selectValue = inject('selectValue')

const currentValue = computed(() => {
  return selectValue?.value || ''
})

const displayValue = computed(() => {
  const v = currentValue.value
  switch (v) {
    case 'popularity':
      return 'Popularność'
    case 'rating':
      return 'Ocena'
    case 'year-desc':
      return 'Rok (najnowsze)'
    case 'year-asc':
      return 'Rok (najstarsze)'
    default:
      return v
  }
})
</script>

<template>
  <span
      data-slot="select-value"
      class="line-clamp-1 flex items-center gap-2 w-full overflow-hidden text-ellipsis whitespace-nowrap"
  >
    <slot v-if="$slots.default" />

    <template v-else>
      <span v-if="displayValue">
        {{ displayValue }}
      </span>

      <span v-else-if="props.placeholder">
        {{ props.placeholder }}
      </span>

      <span v-else class="text-muted-foreground">
        Wybierz
      </span>
    </template>
  </span>
</template>