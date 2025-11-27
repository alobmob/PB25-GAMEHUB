<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import Navbar from '../components/layout/Navbar.vue'
import Card from '../components/ui/card/Card.vue'
import CardContent from '../components/ui/card/CardContent.vue'
import Badge from '../components/ui/Badge.vue'
import ImageWithFallback from '../components/ui/ImageWithFallback.vue'

import { Trophy, TrendingUp, Star } from 'lucide-vue-next'
import { mockGames } from '../utils/mockData'

const topGames = computed(() =>
    [...mockGames].sort((a, b) => b.popularityScore - a.popularityScore).slice(0, 10)
)

const getMedalColor = (position) => {
  switch (position) {
    case 1: return 'text-yellow-500'
    case 2: return 'text-gray-400'
    case 3: return 'text-amber-700'
    default: return 'text-gray-600'
  }
}

const getMedalBg = (position) => {
  switch (position) {
    case 1: return 'bg-yellow-50 border-yellow-200'
    case 2: return 'bg-gray-50 border-gray-200'
    case 3: return 'bg-amber-50 border-amber-200'
    default: return 'bg-white'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="bg-purple-100 p-4 rounded-full">
              <Trophy class="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <h1 class="mb-2">Najpopularniejsze gry</h1>
          <p class="text-gray-600">Top 10 gier według wyników popularności</p>
        </div>

        <div class="space-y-4">
          <div v-for="(game, index) in topGames" :key="game.id">
            <RouterLink :to="`/game/${game.id}`">
              <Card
                  :class="`${getMedalBg(index + 1)} border-2 hover:shadow-lg transition-all cursor-pointer`"
              >
                <CardContent class="p-6">
                  <div class="flex gap-6">

                    <div class="flex flex-col items-center justify-center min-w-[60px]">
                      <template v-if="index + 1 <= 3">
                        <Trophy
                            class="w-8 h-8"
                            :class="getMedalColor(index + 1)"
                        />
                      </template>
                      <template v-else>
                        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <span class="text-xl text-gray-600">{{ index + 1 }}</span>
                        </div>
                      </template>
                      <span class="text-xs text-gray-500 mt-1">Miejsce</span>
                    </div>

                    <div class="w-20 h-28 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                      <ImageWithFallback
                          :src="game.coverImage"
                          :alt="game.title"
                          class="w-full h-full object-cover"
                      />
                    </div>

                    <div class="flex-1 min-w-0">
                      <h3 class="mb-2 line-clamp-1">{{ game.title }}</h3>

                      <div class="flex flex-wrap gap-2 mb-3">
                        <Badge
                            v-for="genre in game.genres.slice(0, 3)"
                            :key="genre"
                            variant="secondary"
                        >
                          {{ genre }}
                        </Badge>
                      </div>

                      <div class="flex items-center gap-4 text-sm text-gray-600">
                        <div class="flex items-center gap-1">
                          <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{{ game.averageRating.toFixed(1) }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <TrendingUp class="w-4 h-4" />
                          <span>Popularność: {{ game.popularityScore }}</span>
                        </div>
                        <span>Rok: {{ game.releaseYear }}</span>
                      </div>
                    </div>

                    <div class="hidden md:flex flex-col items-center justify-center min-w-[80px]">
                      <div class="bg-purple-600 text-white rounded-lg px-4 py-2">
                        <p class="text-xs text-purple-100">Wynik</p>
                        <p class="text-2xl">{{ game.popularityScore }}</p>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>