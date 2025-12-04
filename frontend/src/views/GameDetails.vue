<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

import Navbar from '../components/layout/Navbar.vue'
import axios from 'axios';
import Card from '../components/ui/card/Card.vue'
import CardContent from '../components/ui/card/CardContent.vue'
import Badge from '../components/ui/Badge.vue'
import Button from '../components/ui/Button.vue'

import RatingStars from '../components/rating/RatingStars.vue'
import CommentItem from '../components/rating/CommentItem.vue'
import RatingModal from '../components/rating/RatingModal.vue'
import AddToListModal from '../components/rating/AddToListModal.vue'

import ImageWithFallback from '../components/ui/ImageWithFallback.vue'
import { Star, Plus, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const id = route.params.id

const game = ref(null)
const gameRatings = ref([])
const ratingBreakdown = ref([])

const ratingModalOpen = ref(false)
const listModalOpen = ref(false)

const loadGame = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/games/${id}`)
    const data = await res.json()

    if (!data || data.error) return

    const tags = Array.isArray(data.tags) ? data.tags : []
    const ratings = Array.isArray(data.ratings) ? data.ratings : []

    game.value = {
      id: data.id,
      title: data.title,
      description: data.description,
      releaseYear: data.releaseYear,
      coverImage: data.coverUrl || data.coverImage || '',
      averageRating: Number(data.averageRating || 0),
      ratingsCount: Number(data.ratingsCount || ratings.length || 0),
      ratings: ratings,
      tags,
      genres: tags.filter(t => ['RPG','Akcja','Przygodowa','Strategiczna','Symulacyjna','Platformowa','Indie','Sandbox','Survivalowa','Hack and Slash','Western','Souls-like','Eksploracjna'].includes(t)),
      platforms: tags.filter(t => ['PC','PlayStation 5','PlayStation 4','Xbox Series X','Xbox One','Nintendo Switch','Mobile'].includes(t))
    }

    gameRatings.value = ratings
    const breakdown = [5, 4, 3, 2, 1].map(stars => {
      const count = ratings.filter(r => r.rating === stars).length
      const percentage = ratings.length > 0 ? Math.round((count / ratings.length) * 100) : 0
      return { stars, count, percentage }
    })
    ratingBreakdown.value = breakdown

  } catch (err) {
    console.error('Błąd pobierania gry:', err)
  }
}

onMounted(() => {
  loadGame()
})

const handleRatingAdded = async () => {
  await loadGame()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <RouterLink to="/">
        <Button variant="ghost" size="sm" class="mb-6">
          <ArrowLeft class="size-4 mr-2" />
          Powrót do katalogu
        </Button>
      </RouterLink>

      <div v-if="!game" class="text-center py-20">
        <p class="text-gray-600">Gra nie została znaleziona</p>
      </div>

      <div
          v-else
          class="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div class="lg:col-span-1">
          <div class="aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 sticky top-24">
            <ImageWithFallback
                :src="game.coverImage"
                :alt="game.title"
                class="w-full h-full object-cover"
            />
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div>
            <h1 class="mb-2">{{ game.title }}</h1>

            <div class="flex items-center gap-4 mb-4">
              <div class="flex items-center gap-2">
                <Star class="size-5 fill-yellow-400 text-yellow-400" />
                <span class="text-xl">{{ game.averageRating.toFixed(1) }}</span>
                <span class="text-gray-500">
                  ({{ game.ratingsCount }} ocen)
                </span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-4">
              <Badge
                  v-for="genre in game.genres"
                  :key="genre"
                  variant="secondary"
              >
                {{ genre }}
              </Badge>
            </div>
          </div>

          <div class="flex gap-2">
            <Button @click="ratingModalOpen = true">
              <Star class="size-4 mr-2" />
              Oceń grę
            </Button>

            <Button variant="outline" @click="listModalOpen = true">
              <Plus class="size-4 mr-2" />
              Dodaj do listy
            </Button>
          </div>

          <Card>
            <CardContent class="p-6 space-y-4">
              <div>
                <h3 class="mb-2">Opis</h3>
                <p class="text-gray-700">
                  {{ game.description }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Rok wydania</p>
                  <p>{{ game.releaseYear }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500 mb-1">Platformy</p>
                  <p>{{ game.platforms.join(', ') }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <h3 class="mb-4">Rozkład ocen</h3>

              <div class="space-y-2">
                <div
                    v-for="{ stars, count, percentage } in ratingBreakdown"
                    :key="stars"
                    class="flex items-center gap-3"
                >
                  <div class="flex items-center gap-1 w-24">
                    <span class="text-sm">{{ stars }}</span>
                    <Star class="size-3 fill-yellow-400 text-yellow-400" />
                  </div>

                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-yellow-400"
                        :style="{ width: percentage + '%' }"
                    />
                  </div>

                  <span class="text-sm text-gray-600 w-12 text-right">
                    {{ count }}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 class="mb-4">Komentarze i oceny</h2>

            <div v-if="gameRatings.length > 0" class="space-y-4">
              <CommentItem
                  v-for="rating in gameRatings"
                  :key="rating.id"
                  :rating="rating"
              />
            </div>

            <Card v-else>
              <CardContent class="p-6 text-center text-gray-500">
                Brak komentarzy. Bądź pierwszy!
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <RatingModal
      :open="ratingModalOpen"
      @update:open="ratingModalOpen = $event"
      :gameTitle="game?.title"
      :gameId="game?.id"
      @ratingAdded="loadGame"
    />

    <AddToListModal
        :open="listModalOpen"
        @onOpenChange="listModalOpen = $event"
        :gameTitle="game?.title"
    />
  </div>
</template>