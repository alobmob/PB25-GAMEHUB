<script setup>
import FiltersPanel from '../components/filters/FiltersPanel.vue'
import GameCard from '../components/cards/GameCard.vue'
import { ref } from 'vue'

// mock listy gier — na razie 6 sztuk
const games = ref([
  {
    id: 1,
    title: 'Cyberpunk 2077',
    coverImage: 'https://placehold.co/400x600',
    averageRating: 4.6,
    ratingsCount: 1532,
    genres: ['RPG', 'Action'],
    releaseYear: '2020'
  },
  {
    id: 2,
    title: 'The Witcher 3',
    coverImage: 'https://placehold.co/400x600',
    averageRating: 4.9,
    ratingsCount: 8123,
    genres: ['RPG', 'Adventure'],
    releaseYear: '2015'
  }
])

// domyślne stany filtrów
const selectedGenres = ref([])
const selectedPlatforms = ref([])
const selectedYear = ref('Wszystkie')

const onGenresChange = (value) => selectedGenres.value = value
const onPlatformsChange = (value) => selectedPlatforms.value = value
const onYearChange = (value) => selectedYear.value = value

const onReset = () => {
  selectedGenres.value = []
  selectedPlatforms.value = []
  selectedYear.value = 'Wszystkie'
}
</script>

<template>
  <div class="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

    <FiltersPanel
        :selectedGenres="selectedGenres"
        :selectedPlatforms="selectedPlatforms"
        :selectedYear="selectedYear"
        @onGenresChange="onGenresChange"
        @onPlatformsChange="onPlatformsChange"
        @onYearChange="onYearChange"
        @onReset="onReset"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <GameCard
          v-for="game in games"
          :key="game.id"
          :game="game"
      />
    </div>

  </div>
</template>