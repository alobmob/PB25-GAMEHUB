<script setup>
import { cn } from '../utils'

const props = defineProps({ class: String })
</script>

<template>
  <div
      :class="cn(
      'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex',
      props.class
    )"
  >
    <slot />
  </div>
</template>