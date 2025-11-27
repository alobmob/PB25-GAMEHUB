<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'
import Button from '../ui/Button.vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:currentPage'])

const pages = computed(() => {
  const result = []

  if (props.totalPages <= 7) {
    for (let i = 1; i <= props.totalPages; i++) result.push(i)
  } else {
    result.push(1)

    if (props.currentPage > 3) result.push('...')

    const start = Math.max(2, props.currentPage - 1)
    const end = Math.min(props.totalPages - 1, props.currentPage + 1)

    for (let i = start; i <= end; i++) result.push(i)

    if (props.currentPage < props.totalPages - 2) result.push('...')

    result.push(props.totalPages)
  }

  return result
})

const setPage = (page) => {
  if (page !== '...' && page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <nav class="flex justify-center">
    <ul class="flex items-center gap-2">
      <li>
        <Button
            variant="ghost"
            size="icon"
            :disabled="props.currentPage === 1"
            @click="setPage(props.currentPage - 1)"
        >
          <ChevronLeft class="w-4 h-4" />
        </Button>
      </li>

      <li v-for="page in pages" :key="page">
        <span
            v-if="page === '...'"
            class="px-3 text-gray-500"
        >
          <MoreHorizontal class="w-4 h-4" />
        </span>

        <Button
            v-else
            :variant="page === props.currentPage ? 'outline' : 'ghost'"
            size="icon"
            @click="setPage(page)"
        >
          {{ page }}
        </Button>
      </li>

      <li>
        <Button
            variant="ghost"
            size="icon"
            :disabled="props.currentPage === props.totalPages"
            @click="setPage(props.currentPage + 1)"
        >
          <ChevronRight class="w-4 h-4" />
        </Button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
ul li button[variant="outline"] {
  font-weight: 600;
}
</style>