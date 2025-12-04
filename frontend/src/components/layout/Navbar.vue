<script setup>
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Button from '../ui/Button.vue'
import { Gamepad2, User, LogIn, Menu, X } from 'lucide-vue-next'

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const isMobileMenuOpen = ref(false)

const isActive = (path) => route.path === path
const closeMobileMenu = () => { isMobileMenuOpen.value = false }
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
            <Button :variant="isActive('/') ? 'secondary' : 'ghost'" size="sm">
              Strona główna
            </Button>
          </RouterLink>

          <RouterLink to="/rankings">
            <Button :variant="isActive('/rankings') ? 'secondary' : 'ghost'" size="sm">
              Ranking
            </Button>
          </RouterLink>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div class="hidden md:flex">
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

        <Button
            variant="ghost"
            size="sm"
            class="md:hidden"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <component :is="isMobileMenuOpen ? X : Menu" class="size-5" />
        </Button>
      </div>
    </div>

    <div v-if="isMobileMenuOpen">
      <div
          class="fixed inset-0 bg-black/20 z-40 md:hidden"
          @click="closeMobileMenu"
      />

      <div class="absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50 md:hidden">
        <div class="container mx-auto px-4 py-4 space-y-2">
          <RouterLink to="/" @click="closeMobileMenu">
            <Button
                :variant="isActive('/') ? 'secondary' : 'ghost'"
                size="sm"
                class="w-full justify-start"
            >
              Strona główna
            </Button>
          </RouterLink>

          <RouterLink to="/rankings" @click="closeMobileMenu">
            <Button
                :variant="isActive('/rankings') ? 'secondary' : 'ghost'"
                size="sm"
                class="w-full justify-start"
            >
              Ranking
            </Button>
          </RouterLink>

          <div class="pt-2 border-t">
            <RouterLink
                v-if="props.isLoggedIn"
                to="/profile"
                @click="closeMobileMenu"
            >
              <Button
                  :variant="isActive('/profile') ? 'default' : 'outline'"
                  size="sm"
                  class="w-full justify-start"
              >
                <User class="size-4 mr-2" />
                Profil
              </Button>
            </RouterLink>

            <RouterLink v-else to="/login" @click="closeMobileMenu">
              <Button size="sm" class="w-full justify-start">
                <LogIn class="size-4 mr-2" />
                Zaloguj się
              </Button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>