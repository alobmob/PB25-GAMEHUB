<script setup>
defineProps({
  game: {type: Object, required: true}
});
</script>

<template>
  <article class="mini-card">
    <div class="mini-card-image">IMG</div>
    <strong class="mini-card-title">{{ game.title }}</strong>
    <span class="mini-card-rating">Ocena: {{ game.ratingAvg ?? '-' }}</span>
    <router-link :to="`/games/${game.id}`" class="btn mini-card-link">Szczegoly</router-link>
  </article>
</template>