<script setup>
import { RouterLink } from 'vue-router'
import Card from '../ui/card/Card.vue'
import CardContent from '../ui/card/CardContent.vue'
import Badge from '../ui/Badge.vue'
import ImageWithFallback from '../ui/ImageWithFallback.vue'
import { Star } from 'lucide-vue-next'

defineProps({
  game: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <RouterLink :to="`/game/${game.id}`">
    <Card class="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
      <div class="aspect-[2/3] relative overflow-hidden bg-gray-100">
        <ImageWithFallback
            :src="game.coverImage"
            :alt="game.title"
            class="w-full h-full object-cover"
        />
      </div>

      <CardContent class="p-4">
        <h3 class="mb-2 line-clamp-1">{{ game.title }}</h3>

        <div class="flex items-center gap-1 mb-3">
          <Star class="size-4 fill-yellow-400 text-yellow-400" />
          <span class="text-sm">{{ game.averageRating.toFixed(1) }}</span>
          <span class="text-sm text-gray-500">({{ game.ratingsCount }})</span>
        </div>

        <div class="flex flex-wrap gap-1 mb-2">
          <Badge
              v-for="genre in game.genres.slice(0, 2)"
              :key="genre"
              variant="secondary"
              class="text-xs"
          >
            {{ genre }}
          </Badge>
        </div>

        <p class="text-sm text-gray-600">
          {{ game.releaseYear }}
        </p>
      </CardContent>
    </Card>
  </RouterLink>
</template>