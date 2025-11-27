<script setup>
import { inject, ref, onMounted, onBeforeUnmount } from 'vue'

const open = inject('selectOpen')

const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})

const el = ref(null)

function onClickOutside(e) {
  if (el.value && !el.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div
      v-if="open"
      ref="el"
      data-slot="select-content"
      :class="[
      'bg-popover text-popover-foreground absolute z-50 mt-1 rounded-md border shadow-md p-1 max-h-64 overflow-y-auto',
      props.class
    ]"
  >
    <slot />
  </div>
</template>