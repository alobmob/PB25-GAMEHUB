<script setup>
import Section from '../components/home/Section.vue';
import GameMiniCard from '../components/home/GameMiniCard.vue';

const popular = Array.from({length: 6}, (_, i) => ({
  id: i + 1, title: `Popularna gra #${i + 1}`, ratingAvg: (4.5 - i * 0.1).toFixed(1)
}));
const recent = Array.from({length: 6}, (_, i) => ({
  id: 100 + i + 1, title: `Nowa gra #${i + 1}`, ratingAvg: (3.9 + i * 0.1).toFixed(1)
}));
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