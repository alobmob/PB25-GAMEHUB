<script setup>
import { computed } from 'vue'
import Button from '../ui/Button.vue'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})

const emit = defineEmits(['update:currentPage'])

const pages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) return [...Array(total)].map((_, i) => i + 1)

  if (current <= 4)
    return [1, 2, 3, 4, 5, 'ellipsis-right', total]

  if (current >= total - 3)
    return [1, 'ellipsis-left', total - 4, total - 3, total - 2, total - 1, total]

  return [
    1,
    'ellipsis-left',
    current - 1,
    current,
    current + 1,
    'ellipsis-right',
    total
  ]
})

function select(page) {
  if (typeof page === 'number') emit('update:currentPage', page)
}

function prev() {
  if (props.currentPage > 1) emit('update:currentPage', props.currentPage - 1)
}

function next() {
  if (props.currentPage < props.totalPages)
    emit('update:currentPage', props.currentPage + 1)
}
</script>

<template>
  <nav class="mx-auto flex w-full justify-center">
    <ul class="flex flex-row items-center gap-1">
      <li>
        <Button
            variant="ghost"
            size="default"
            class="gap-1 px-2.5"
            :disabled="currentPage === 1"
            @click="prev"
        >
          <ChevronLeft class="size-4" />
          <span class="hidden sm:block">Previous</span>
        </Button>
      </li>

      <li v-for="(page, i) in pages" :key="i">
        <template v-if="page === 'ellipsis-left' || page === 'ellipsis-right'">
          <span class="flex size-9 items-center justify-center">
            <MoreHorizontal class="size-4" />
          </span>
        </template>

        <template v-else>
          <Button
              :variant="page === currentPage ? 'outline' : 'ghost'"
              size="icon"
              class="h-9 w-9"
              @click="select(page)"
          >
            {{ page }}
          </Button>
        </template>
      </li>

      <li>
        <Button
            variant="ghost"
            size="default"
            class="gap-1 px-2.5"
            :disabled="currentPage === totalPages"
            @click="next"
        >
          <span class="hidden sm:block">Next</span>
          <ChevronRight class="size-4" />
        </Button>
      </li>
    </ul>
  </nav>
</template>