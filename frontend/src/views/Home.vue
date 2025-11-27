<script setup>
import GameCard from '../components/cards/GameCard.vue'

const testGame = {
  id: 1,
  title: 'Cyberpunk 2077',
  coverImage: 'https://picsum.photos/300/450?random=1',
  averageRating: 4.6,
  ratingsCount: 25123,
  genres: ['RPG', 'Sci-Fi'],
  releaseYear: 2020
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl mb-4">Test GameCard</h1>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <GameCard :game="testGame" />
    </div>
  </div>
</template>

<style scoped>
</style>