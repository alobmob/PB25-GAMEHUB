<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
const meta = ref({ total: 0, page: 1, limit: 9, totalPages: 1 })

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

const buildQuery = () => {
  const params = new URLSearchParams();
  params.set('page', currentPage.value)
  params.set('limit', itemsPerPage.value)
  params.set('sort', sortBy.value)
  if (selectedYear.value && selectedYear.value !== 'Wszystkie') params.set('year', selectedYear.value)
  if (selectedGenres.value.length) params.set('tags', selectedGenres.value.join(','))
  if (selectedPlatforms.value.length) {
    const existing = params.get('tags')
    const combined = existing ? `${existing},${selectedPlatforms.value.join(',')}` : selectedPlatforms.value.join(',')
    params.set('tags', combined)
  }
  return params.toString()
}

const loadGames = async () => {
  try {
    const qs = buildQuery()
    const res = await fetch(`http://localhost:3000/api/games?${qs}`)
    const json = await res.json()
    const rows = Array.isArray(json.data) ? json.data : []
    allGames.value = rows.map(game => {
      const tags = Array.isArray(game.tags) ? game.tags : (typeof game.tags === 'string' && game.tags ? game.tags.split(',') : [])
      return {
        id: game.id,
        title: game.title,
        slug: game.slug,
        description: game.description,
        releaseYear: game.releaseYear,
        coverImage: game.coverUrl || game.coverImage || '',
        averageRating: Number(game.averageRating || game.average_rating || 0),
        ratingsCount: Number(game.ratingsCount || game.ratings_count || 0),
        ratings: game.ratings || [],
        popularityScore: Number(game.popularityScore || game.popularity_score || 0),
        tags,
        genres: tags.filter(t => ['RPG','Akcja','Przygodowa','Strategiczna','Symulacyjna','Platformowa','Indie','Sandbox','Survivalowa','Hack and Slash','Western','Souls-like','Eksploracjna'].includes(t)),
        platforms: tags.filter(t => ['PC','PlayStation 5','PlayStation 4','Xbox Series X','Xbox One','Nintendo Switch','Mobile'].includes(t))
      }
    })
    if (json.meta) {
      meta.value = json.meta
      currentPage.value = json.meta.page || currentPage.value
      itemsPerPage.value = json.meta.limit || itemsPerPage.value
    }
  } catch (err) {
    console.error('Błąd pobierania gier:', err);
  }
}

onMounted(() => {
  loadGames()
})

watch([selectedGenres, selectedPlatforms, selectedYear, sortBy, currentPage], () => {
  currentPage.value = Number(currentPage.value) || 1
  loadGames()
})


const totalPages = computed(() => Math.ceil((meta.value.total || 0) / itemsPerPage.value))
const paginatedGames = computed(() => allGames.value)
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
