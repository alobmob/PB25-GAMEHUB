<script setup>
import { ref, computed, onMounted } from 'vue'
import FiltersPanel from '../components/filters/FiltersPanel.vue'
import GameCard from '../components/cards/GameCard.vue'
import Pagination from '../components/pagination/Pagination.vue'
import Select from '../components/ui/select/Select.vue'
import SelectTrigger from '../components/ui/select/SelectTrigger.vue'
import SelectContent from '../components/ui/select/SelectContent.vue'
import SelectItem from '../components/ui/select/SelectItem.vue'
import SelectValue from '../components/ui/select/SelectValue.vue'
import Label from '../components/ui/Label.vue'

const allGames = ref([])

const selectedGenres = ref([])
const selectedPlatforms = ref([])
const selectedYear = ref('Wszystkie')
const sortBy = ref('popularity')
const currentPage = ref(1)
const itemsPerPage = ref(9)

const resetFilters = () => {
  selectedGenres.value = []
  selectedPlatforms.value = []
  selectedYear.value = 'Wszystkie'
  currentPage.value = 1
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/games')
    const data = await res.json()
  
    allGames.value = data.map(game => ({
  ...game,
  releaseYear: game.release_date ? new Date(game.release_date).getFullYear() : null,
  genres: game.genres ? JSON.parse(game.genres) : [],
  platforms: game.platforms ? JSON.parse(game.platforms) : [],
  popularityScore: game.points || 0,
  averageRating: game.points || 0
}));
  } catch (err) {
    console.error('Błąd pobierania gier:', err)
  }
})

// Filtrowanie i sortowanie
const filteredAndSortedGames = computed(() => {
  let filtered = [...allGames.value]

  if (selectedGenres.value.length) {
    filtered = filtered.filter(game =>
      game.genres.some(genre => selectedGenres.value.includes(genre))
    )
  }

  if (selectedPlatforms.value.length) {
    filtered = filtered.filter(game =>
      game.platforms.some(platform => selectedPlatforms.value.includes(platform))
    )
  }

  if (selectedYear.value !== 'Wszystkie') {
    filtered = filtered.filter(game => game.releaseYear === Number(selectedYear.value))
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'popularity': return (b.points || 0) - (a.points || 0)
      case 'rating': return (b.points || 0) - (a.points || 0) // jeśli masz średnią ocenę
      case 'year-desc': return b.releaseYear - a.releaseYear
      case 'year-asc': return a.releaseYear - b.releaseYear
      default: return 0
    }
  })

  return filtered
})

const totalPages = computed(() =>
  Math.ceil(filteredAndSortedGames.value.length / itemsPerPage.value)
)

const paginatedGames = computed(() =>
  filteredAndSortedGames.value.slice(
    (currentPage.value - 1) * itemsPerPage.value,
    currentPage.value * itemsPerPage.value
  )
)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="gh-container px-4 py-8">
      <div class="mb-8">
        <h1 class="mb-2">Katalog gier</h1>
        <p class="text-gray-600">
          Przeglądaj {{ allGames.length }} gier w naszej bazie danych
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="w-full lg:w-[260px] lg:shrink-0">
          <FiltersPanel
            v-model:genres="selectedGenres"
            v-model:platforms="selectedPlatforms"
            v-model:year="selectedYear"
            @reset="resetFilters"
          />
        </aside>

        <main class="flex-1 space-y-6">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Znaleziono {{ filteredAndSortedGames.length }}
              {{ filteredAndSortedGames.length === 1 ? 'grę' : 'gier' }}
            </p>

            <div class="flex items-center gap-2">
              <Label class="text-sm">Sortuj:</Label>
              <Select v-model="sortBy">
                <SelectTrigger class="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularność</SelectItem>
                  <SelectItem value="rating">Ocena</SelectItem>
                  <SelectItem value="year-desc">Rok (najnowsze)</SelectItem>
                  <SelectItem value="year-asc">Rok (najstarsze)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div
            v-if="paginatedGames.length"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <GameCard
              v-for="game in paginatedGames"
              :key="game.id"
              :game="game"
            />
          </div>

          <div v-else class="text-center py-12">
            <p class="text-gray-500">Nie znaleziono gier spełniających kryteria</p>
          </div>

          <div v-if="totalPages > 1" class="pt-8">
            <Pagination
              v-model:currentPage="currentPage"
              :totalPages="totalPages"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
