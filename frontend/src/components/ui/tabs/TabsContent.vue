<script setup>
import { inject, computed } from 'vue'
import { cn } from '../utils'

const props = defineProps({
  value: { type: String, required: true },
  class: String
})

const current = inject('tabsValue')
const isActive = computed(() => current.value === props.value)
</script>

<template>
  <div v-show="isActive" :class="cn('flex-1 outline-none', props.class)">
    <slot />
  </div>
</template>