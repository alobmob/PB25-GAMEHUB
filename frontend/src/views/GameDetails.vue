<script setup>
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

import Card from '../components/ui/card/Card.vue'
import CardContent from '../components/ui/card/CardContent.vue'
import Badge from '../components/ui/Badge.vue'
import Button from '../components/ui/Button.vue'

import RatingStars from '../components/rating/RatingStars.vue'
import CommentItem from '../components/rating/CommentItem.vue'
import RatingModal from '../components/rating/RatingModal.vue'
import AddToListModal from '../components/rating/AddToListModal.vue'

import ImageWithFallback from '../components/ui/ImageWithFallback.vue'

import { mockGames, mockRatings } from '../utils/mockData'
import { Star, Plus, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const id = route.params.id

const ratingModalOpen = ref(false)
const listModalOpen = ref(false)

const game = mockGames.find(g => g.id === id)
const gameRatings = mockRatings.filter(r => r.gameId === id)

const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => ({
  stars,
  count: Math.floor(Math.random() * 200) + 50,
  percentage: Math.floor(Math.random() * 60) + 10
}))
</script>

<template>
  <div class="min-h-screen bg-gray-50">

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

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
    />

    <AddToListModal
        :open="listModalOpen"
        @update:open="listModalOpen = $event"
        :gameTitle="game?.title"
    />
  </div>
</template>