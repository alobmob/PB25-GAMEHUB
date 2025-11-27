<script setup>
import { useRoute, RouterLink } from 'vue-router'
import Button from '../ui/Button.vue'
import { Gamepad2, User, LogIn } from 'lucide-vue-next'

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

const isActive = (path) => route.path === path
</script>

<template>
  <nav class="border-b bg-white sticky top-0 z-50">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <RouterLink to="/" class="flex items-center gap-2">
          <Gamepad2 class="size-6 text-purple-600" />
          <span class="text-xl tracking-tight">GameHub</span>
        </RouterLink>

        <div class="hidden md:flex items-center gap-1">
          <RouterLink to="/">
            <Button
                :variant="isActive('/') ? 'secondary' : 'ghost'"
                size="sm"
            >
              Strona główna
            </Button>
          </RouterLink>

          <RouterLink to="/rankings">
            <Button
                :variant="isActive('/rankings') ? 'secondary' : 'ghost'"
                size="sm"
            >
              Ranking
            </Button>
          </RouterLink>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink v-if="props.isLoggedIn" to="/profile">
          <Button :variant="isActive('/profile') ? 'default' : 'outline'" size="sm">
            <User class="size-4 mr-2" />
            Profil
          </Button>
        </RouterLink>

        <RouterLink v-else to="/login">
          <Button size="sm">
            <LogIn class="size-4 mr-2" />
            Zaloguj się
          </Button>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>