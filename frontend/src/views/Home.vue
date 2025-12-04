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
const totalGamesCount = ref(0)

const selectedGenres = ref([])
const selectedPlatforms = ref([])
const selectedYear = ref('Wszystkie')
const sortBy = ref('popularity')
const currentPage = ref(1)
const itemsPerPage = ref(9)

const totalPages = computed(() => {
  return Math.ceil(totalGamesCount.value / itemsPerPage.value)
})

const paginatedGames = computed(() => {
  return allGames.value
})

const resetFilters = () => {
  selectedGenres.value = []
  selectedPlatforms.value = []
  selectedYear.value = 'Wszystkie'
  currentPage.value = 1
}

const fetchGames = async () => {
  try {
    const params = new URLSearchParams();

    // Filtrowanie - dodaj wszystkie zaznaczenia, nie tylko pierwsze
    selectedGenres.value.forEach(genre => params.append('genre', genre));
    selectedPlatforms.value.forEach(platform => params.append('platform', platform));
    if (selectedYear.value !== 'Wszystkie') params.append('year', selectedYear.value);

    // Sortowanie
    if (sortBy.value) params.append('sort', sortBy.value);

    // Paginacja
    params.append('page', currentPage.value);
    params.append('limit', itemsPerPage.value);

    const res = await fetch(`http://localhost:3000/api/games?${params.toString()}`);
    const response = await res.json();

    allGames.value = response.games.map(game => {
      const tags = Array.isArray(game.tags) ? game.tags : [];
      const ratings = Array.isArray(game.ratings) ? game.ratings : [];

      const avg = (typeof game.averageRating === 'number' && !isNaN(game.averageRating))
        ? Number(game.averageRating)
        : (ratings.length ? ratings.reduce((s, r) => s + (r.rating||0), 0) / ratings.length : 0);

      return {
        ...game,
        tags,
        genres: tags.filter(t => ['RPG','Akcja','Przygodowa','Strategiczna','Symulacyjna','Platformowa','Indie','Sandbox','Survivalowa','Hack and Slash','Western','Souls-like','Eksploracjna'].includes(t)),
        platforms: tags.filter(t => ['PC','PlayStation 5','PlayStation 4','Xbox Series X','Xbox One','Nintendo Switch','Mobile'].includes(t)),
        averageRating: Number(avg) || 0,
        ratingsCount: Number(game.ratingsCount || ratings.length || 0),
        coverImage: game.coverUrl || game.coverImage || ''
      };
    });
    
    totalGamesCount.value = response.total;
  } catch (err) {
    console.error('Błąd pobierania gier:', err);
  }
};

onMounted(() => {
  fetchGames();
});
watch([selectedGenres, selectedPlatforms, selectedYear, sortBy, currentPage], () => {
  fetchGames();
});


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
              Znaleziono {{ totalGamesCount }}
              {{ totalGamesCount === 1 ? 'grę' : 'gier' }}
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
