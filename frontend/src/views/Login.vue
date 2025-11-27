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

const email = ref('')
const password = ref('')

const handleSubmit = () => {
  if (!email.value || !password.value) {
    alert('Wypełnij wszystkie pola')
    return
  }

  alert('Zalogowano pomyślnie!')
}
</script>

<template>
  <!-- LOGIN WYSOKOŚĆ = 100VH MINUS NAVBAR (4rem = h-16) -->
  <div class="h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <div class="flex justify-center mb-4">
          <div class="bg-primary p-3 rounded-full">
            <Gamepad2 class="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        <CardTitle>Zaloguj się</CardTitle>
        <CardDescription>
          Wprowadź swoje dane, aby uzyskać dostęp do konta
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
            <Label for="password">Hasło</Label>
            <Input
                id="password"
                type="password"
                v-model="password"
                placeholder="••••••••"
            />
          </div>

          <Button type="submit" class="w-full">
            Zaloguj się
          </Button>

          <div class="text-center text-sm">
            <span class="text-gray-600">Nie masz konta? </span>
            <RouterLink to="/register" class="text-primary hover:underline">
              Zarejestruj się
            </RouterLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>