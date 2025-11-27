<script setup>
import { ref, watch } from 'vue'

import Dialog from '../ui/dialog/Dialog.vue'
import DialogContent from '../ui/dialog/DialogContent.vue'
import DialogHeader from '../ui/dialog/DialogHeader.vue'
import DialogTitle from '../ui/dialog/DialogTitle.vue'
import DialogFooter from '../ui/dialog/DialogFooter.vue'

import Button from '../ui/Button.vue'
import Label from '../ui/Label.vue'
import Textarea from '../ui/Textarea.vue'

import RatingStars from './RatingStars.vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  gameTitle: { type: String, required: true }
})

const emit = defineEmits(['update:open'])

const rating = ref(0)
const comment = ref('')

watch(
    () => props.open,
    (value) => {
      if (!value) {
        rating.value = 0
        comment.value = ''
      }
    }
)

const close = () => emit('update:open', false)

const handleSubmit = () => {
  if (rating.value === 0) {
    alert('Prosze wybrac ocene')
    return
  }

  alert('Ocena zostala dodana!')
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Ocen gre</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <p class="text-sm text-gray-600">{{ gameTitle }}</p>

        <div class="space-y-2">
          <Label>Twoja ocena</Label>
          <RatingStars v-model="rating" interactive :size="32" />
        </div>

        <div class="space-y-2">
          <Label for="comment">Dodaj komentarz (opcjonalnie)</Label>
          <Textarea
              id="comment"
              v-model="comment"
              placeholder="Podziel sie swoja opinia o grze..."
              rows="4"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="close">Anuluj</Button>
        <Button @click="handleSubmit">Dodaj ocene</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>