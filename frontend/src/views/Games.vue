<script setup>
import api from '../api/http';
import {ref, onMounted} from 'vue';

const games = ref([]);
const loading = ref(true);
const error = ref(null);
onMounted(async () => {
  try {
    const {data} = await api.get('/api/games');
    games.value = data;
  } catch {
    error.value = 'Blad pobierania listy gier';
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <h1>Gry</h1>
  <p v-if="loading">Wczytywanie...</p>
  <p v-else-if="error">{{ error }}</p>
  <pre v-else>{{ games }}</pre>
</template>