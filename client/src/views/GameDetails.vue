<script setup>
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import api from '../api/http';

const route = useRoute();
const game = ref(null);
const error = ref(null);
onMounted(async () => {
  try {
    const {data} = await api.get(`/api/games/${route.params.id}`);
    game.value = data;
  } catch {
    error.value = 'Blad pobierania gry';
  }
});
</script>
<template>
  <h1>Szczegoly gry</h1>
  <p v-if="error">{{ error }}</p>
  <pre v-else-if="game">{{ game }}</pre>
</template>