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
  gameTitle: { type: String, required: true },
  gameId: { type: Number, required: true }
})

const emit = defineEmits(['update:open', 'ratingAdded'])

const rating = ref(0)
const comment = ref('')
const isLoading = ref(false)

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

const handleSubmit = async () => {
  if (rating.value === 0) {
    alert('Prosze wybrac ocene')
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/games/${props.gameId}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        score: rating.value,
        comment: comment.value
      })
    })

    if (!response.ok) {
      const error = await response.json()
      alert('Błąd: ' + (error.error || 'Nie udało się dodać opinii'))
      return
    }

    await response.json()
    alert('Ocena zostala dodana!')
    emit('ratingAdded')
    close()
  } catch (err) {
    console.error('Błąd dodawania opinii:', err)
    alert('Błąd: ' + err.message)
  } finally {
    isLoading.value = false
  }
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
        <Button variant="outline" @click="close" :disabled="isLoading">Anuluj</Button>
        <Button @click="handleSubmit" :disabled="isLoading">{{ isLoading ? 'Dodawanie...' : 'Dodaj ocene' }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>