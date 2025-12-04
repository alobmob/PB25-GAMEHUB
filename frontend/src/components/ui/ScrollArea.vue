<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  class: { type: String, default: '' }
})

const root = ref(null)
const viewport = ref(null)
const verticalThumb = ref(null)
const horizontalThumb = ref(null)

const showVertical = ref(false)
const showHorizontal = ref(false)

const updateScrollbars = () => {
  const vp = viewport.value
  if (!vp) return

  showVertical.value = vp.scrollHeight > vp.clientHeight
  showHorizontal.value = vp.scrollWidth > vp.clientWidth

  if (verticalThumb.value) {
    const heightRatio = vp.clientHeight / vp.scrollHeight
    verticalThumb.value.style.height = `${heightRatio * 100}%`
    verticalThumb.value.style.top = `${(vp.scrollTop / vp.scrollHeight) * 100}%`
  }

  if (horizontalThumb.value) {
    const widthRatio = vp.clientWidth / vp.scrollWidth
    horizontalThumb.value.style.width = `${widthRatio * 100}%`
    horizontalThumb.value.style.left = `${(vp.scrollLeft / vp.scrollWidth) * 100}%`
  }
}

const onScroll = () => updateScrollbars()

onMounted(() => {
  const vp = viewport.value
  if (!vp) return

  vp.addEventListener('scroll', onScroll)
  updateScrollbars()
})

onBeforeUnmount(() => {
  const vp = viewport.value
  if (!vp) return

  vp.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div
      data-slot="scroll-area"
      :class="['relative', props.class]"
      ref="root"
  >
    <div
        data-slot="scroll-area-viewport"
        ref="viewport"
        class="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 overflow-auto"
    >
      <slot />
    </div>

    <div
        v-if="showVertical"
        data-slot="scroll-area-scrollbar"
        class="flex touch-none p-px transition-colors select-none h-full w-2.5 border-l border-l-transparent absolute right-0 top-0"
    >
      <div
          data-slot="scroll-area-thumb"
          ref="verticalThumb"
          class="bg-border relative flex-1 rounded-full"
      />
    </div>

    <div
        v-if="showHorizontal"
        data-slot="scroll-area-scrollbar"
        class="flex touch-none p-px transition-colors select-none h-2.5 flex-col border-t border-t-transparent absolute left-0 bottom-0"
    >
      <div
          data-slot="scroll-area-thumb"
          ref="horizontalThumb"
          class="bg-border relative rounded-full"
      />
    </div>

    <div
        v-if="showVertical && showHorizontal"
        class="absolute right-0 bottom-0 w-2.5 h-2.5 bg-transparent"
    />
  </div>
</template>