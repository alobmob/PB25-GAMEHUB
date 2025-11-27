<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'

const router = useRouter()

const user = ref(null)

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) user.value = JSON.parse(storedUser)
})

function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  user.value = null
  router.push('/')
}
</script>

<template>
  <div class="h-10 bg-red-500"></div>
  <Navbar :isLoggedIn="!!user" />
  <main class="container">
    <router-view />
  </main>
</template>