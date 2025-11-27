<script setup>
import Card from '../ui/card/Card.vue'
import CardContent from '../ui/card/CardContent.vue'
import RatingStars from './RatingStars.vue'

const props = defineProps({
  rating: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <Card>
    <CardContent class="p-4">
      <div class="flex items-start justify-between mb-2">
        <div>
          <p class="font-medium">{{ rating.userName }}</p>
          <p class="text-sm text-gray-500">{{ rating.createdAt }}</p>
        </div>

        <!-- Gwiazdki -->
        <RatingStars :rating="rating.rating" />
      </div>

      <p class="text-gray-700">
        {{ rating.comment }}
      </p>
    </CardContent>
  </Card>
</template>