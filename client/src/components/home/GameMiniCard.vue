<script setup>
defineProps({
  game: {type: Object, required: true}
});
</script>

<template>
  <article style="border:1px solid #e5e7eb;border-radius:12px;padding:10px;display:grid;gap:6px">
    <div
        style="height:120px;background:#f3f4f6;border-radius:8px;display:flex;align-items:center;justify-content:center">
      IMG
    </div>
    <strong style="font-size:14px">{{ game.title }}</strong>
    <span style="font-size:12px;color:#666">Ocena: {{ game.ratingAvg ?? '-' }}</span>
    <router-link :to="`/games/${game.id}`" style="font-size:12px">Szczegoly</router-link>
  </article>
</template>