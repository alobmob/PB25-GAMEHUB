<script setup>
import Section from '../components/home/Section.vue';
import GameMiniCard from '../components/home/GameMiniCard.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

// fallbacky (tak jak miałeś) — teraz jako wartości początkowe refs
const popularFallback = Array.from({length: 6}, (_, i) => ({
  id: i + 1,
  title: `Popularna gra #${i + 1}`,
  ratingAvg: (4.5 - i * 0.1).toFixed(1)
}));
const recentFallback = Array.from({length: 6}, (_, i) => ({
  id: 100 + i + 1,
  title: `Nowa gra #${i + 1}`,
  ratingAvg: (3.9 + i * 0.1).toFixed(1)
}));

const popular = ref(popularFallback);
const recent = ref(recentFallback);

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

const normalizeGame = (g) => {
  // backend ma pole `points` — zamieniamy je na `ratingAvg`
  // ale akceptujemy też `ratingAvg` jeśli jest już zwrócone
  const rating = g.points ?? g.ratingAvg ?? 0;
  return {
    id: g.id,
    title: g.title,
    // zachowujemy format podobny do wcześniejszego (string z 1-2 miejscami po przecinku)
    ratingAvg: (typeof rating === 'number') ? Number(rating.toFixed(2)) : rating
  };
};

const fetchLists = async () => {
  try {
    const [p, r] = await Promise.all([
      api.get('/games/popular?limit=6'),
      api.get('/games/recent?limit=6')
    ]);

    if (Array.isArray(p.data) && p.data.length) {
      popular.value = p.data.map(normalizeGame);
    }
    if (Array.isArray(r.data) && r.data.length) {
      recent.value = r.data.map(normalizeGame);
    }
  } catch (err) {
    console.warn('Nie udało się pobrać list gier z API, używam fallbacków.', err);
    // fallbacky pozostają w popular/recent
  }
};

onMounted(() => {
  fetchLists();
});
</script>

<template>
  <div class="home">
    <Section title="Ranking popularnosci">
      <div class="game-grid">
        <GameMiniCard v-for="g in popular" :key="g.id" :game="g"/>
      </div>
    </Section>

    <Section title="Ostatnio dodane">
      <div class="game-grid">
        <GameMiniCard v-for="g in recent" :key="g.id" :game="g"/>
      </div>
    </Section>
  </div>
</template>

<style scoped>
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}
</style>
