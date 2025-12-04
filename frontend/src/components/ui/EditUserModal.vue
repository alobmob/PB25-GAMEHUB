<script setup>
import { ref, watch } from 'vue'

import Dialog from './dialog/Dialog.vue'
import DialogContent from './dialog/DialogContent.vue'
import DialogHeader from './dialog/DialogHeader.vue'
import DialogTitle from './dialog/DialogTitle.vue'
import DialogFooter from './dialog/DialogFooter.vue'

import Button from './Button.vue'
import Input from './Input.vue'
import Label from './Label.vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  currentDisplayName: { type: String, required: true },
  currentEmail: { type: String, required: true }
})

const emit = defineEmits(['update:open', 'save'])

const displayName = ref('')
const email = ref('')
const password = ref('')

const errors = ref({
  displayName: '',
  email: '',
  password: ''
})

watch(
    () => props.open,
    (value) => {
      if (value) {
        displayName.value = props.currentDisplayName
        email.value = props.currentEmail
        password.value = ''
        errors.value = { displayName: '', email: '', password: '' }
      }
    }
)

const close = () => emit('update:open', false)

const validate = () => {
  const err = { displayName: '', email: '', password: '' }
  let ok = true

  if (!displayName.value.trim()) {
    err.displayName = 'Nazwa wyświetlana jest wymagana'
    ok = false
  } else if (displayName.value.length < 3) {
    err.displayName = 'Nazwa wyświetlana musi mieć minimum 3 znaki'
    ok = false
  }

  if (!email.value.trim()) {
    err.email = 'Adres e-mail jest wymagany'
    ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    err.email = 'Nieprawidłowy format adresu e-mail'
    ok = false
  }

  if (password.value && password.value.length < 6) {
    err.password = 'Hasło musi mieć minimum 6 znaków'
    ok = false
  }

  errors.value = err
  return ok
}

const handleSubmit = () => {
  if (!validate()) return

  const data = {
    displayName: displayName.value,
    email: email.value,
    ...(password.value && { password: password.value })
  }

  emit('save', data)
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edytuj dane użytkownika</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="displayName">Nazwa wyświetlana</Label>
          <Input
              id="displayName"
              v-model="displayName"
              placeholder="Wprowadź nazwę wyświetlaną"
              :class="errors.displayName ? 'border-red-500' : ''"
          />
          <p v-if="errors.displayName" class="text-sm text-red-500">
            {{ errors.displayName }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="email">Adres e-mail</Label>
          <Input
              id="email"
              type="email"
              v-model="email"
              placeholder="twoj@email.com"
              :class="errors.email ? 'border-red-500' : ''"
          />
          <p v-if="errors.email" class="text-sm text-red-500">
            {{ errors.email }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="password">Hasło</Label>
          <Input
              id="password"
              type="password"
              v-model="password"
              placeholder="••••••••"
              :class="errors.password ? 'border-red-500' : ''"
          />
          <p class="text-xs text-gray-500">
            Pozostaw puste, jeśli nie chcesz zmieniać hasła
          </p>
          <p v-if="errors.password" class="text-sm text-red-500">
            {{ errors.password }}
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="close">
          Anuluj
        </Button>
        <Button @click="handleSubmit">
          Zapisz zmiany
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>