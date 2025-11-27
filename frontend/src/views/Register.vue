<script setup>
import { ref } from 'vue'
import Card from '../components/ui/card/Card.vue'
import CardHeader from '../components/ui/card/CardHeader.vue'
import CardTitle from '../components/ui/card/CardTitle.vue'
import CardDescription from '../components/ui/card/CardDescription.vue'
import CardContent from '../components/ui/card/CardContent.vue'
import Label from '../components/ui/Label.vue'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'
import { Gamepad2 } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const email = ref('')
const displayName = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleSubmit = () => {
  if (!email.value || !displayName.value || !password.value || !confirmPassword.value) {
    alert('Wypełnij wszystkie pola')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Hasła nie są zgodne')
    return
  }

  if (password.value.length < 6) {
    alert('Hasło musi mieć co najmniej 6 znaków')
    return
  }

  alert('Konto zostało utworzone!')
}
</script>

<template>
  <!-- identyczne rozwiązanie jak w LOGIN (bez scrolla) -->
  <div class="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <div class="flex justify-center mb-4">
          <div class="bg-primary p-3 rounded-full">
            <Gamepad2 class="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        <CardTitle>Utwórz konto</CardTitle>
        <CardDescription>
          Dołącz do społeczności GameHub
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Adres e-mail</Label>
            <Input
                id="email"
                type="email"
                v-model="email"
                placeholder="twoj@email.pl"
            />
          </div>

          <div class="space-y-2">
            <Label for="displayName">Nazwa użytkownika</Label>
            <Input
                id="displayName"
                type="text"
                v-model="displayName"
                placeholder="Twoja nazwa"
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Hasło</Label>
            <Input
                id="password"
                type="password"
                v-model="password"
                placeholder="••••••••"
            />
            <p class="text-xs text-gray-500">
              Minimum 6 znaków
            </p>
          </div>

          <div class="space-y-2">
            <Label for="confirmPassword">Powtórz hasło</Label>
            <Input
                id="confirmPassword"
                type="password"
                v-model="confirmPassword"
                placeholder="••••••••"
            />
          </div>

          <Button type="submit" class="w-full">
            Utwórz konto
          </Button>

          <div class="text-center text-sm">
            <span class="text-gray-600">Masz już konto? </span>
            <RouterLink to="/login" class="text-primary hover:underline">
              Zaloguj się
            </RouterLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>