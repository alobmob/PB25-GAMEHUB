<script setup>
import FiltersPanel from '../components/filters/FiltersPanel.vue'
import GameCard from '../components/cards/GameCard.vue'
import { ref, computed } from 'vue'

const allGames = ref([
  {
    id: 1,
    title: 'Cyberpunk 2077',
    coverImage: 'https://picsum.photos/300/450?random=1',
    averageRating: 4.6,
    ratingsCount: 25123,
    genres: ['RPG', 'Sci-Fi'],
    releaseYear: '2020'
  },
  {
    id: 2,
    title: 'The Witcher 3',
    coverImage: 'https://picsum.photos/300/450?random=2',
    averageRating: 4.9,
    ratingsCount: 84211,
    genres: ['RPG', 'Fantasy'],
    releaseYear: '2015'
  }
])

const selectedGenres = ref([])
const selectedPlatforms = ref([])
const selectedYear = ref('Wszystkie')

const resetFilters = () => {
  selectedGenres.value = []
  selectedPlatforms.value = []
  selectedYear.value = 'Wszystkie'
}

const filteredGames = computed(() => {
  return allGames.value.filter((game) => {
    if (selectedYear.value !== 'Wszystkie' && game.releaseYear.toString() !== selectedYear.value) {
      return false
    }

    if (selectedGenres.value.length > 0 && !selectedGenres.value.some((g) => game.genres.includes(g))) {
      return false
    }

    return true
  })
})
</script>

<template>
  <div class="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
    <FiltersPanel
        v-model:genres="selectedGenres"
        v-model:platforms="selectedPlatforms"
        v-model:year="selectedYear"
        @reset="resetFilters"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <GameCard
          v-for="game in filteredGames"
          :key="game.id"
          :game="game"
      />
    </div>
  </div>
</template>