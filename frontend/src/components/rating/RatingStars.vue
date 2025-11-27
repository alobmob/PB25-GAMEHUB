<script setup>
import { computed } from 'vue'
import { Star } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Number, required: true },
  interactive: { type: Boolean, default: false },
  size: { type: Number, default: 20 }
})

const emit = defineEmits(['update:modelValue'])

const stars = [1, 2, 3, 4, 5]

const handleClick = (value) => {
  if (props.interactive) emit('update:modelValue', value)
}

const starClass = (star) =>
    star <= props.modelValue
        ? 'fill-yellow-400 text-yellow-400'
        : 'text-gray-300'
</script>

<template>
  <div class="flex gap-1">
    <button
        v-for="star in stars"
        :key="star"
        type="button"
        :disabled="!interactive"
        @click="handleClick(star)"
        class="transition-transform"
        :class="interactive ? 'cursor-pointer hover:scale-110' : ''"
    >
      <Star
          :class="starClass(star)"
          :style="{ width: size + 'px', height: size + 'px' }"
      />
    </button>
  </div>
</template>