<script setup>
import HomeHero from '../components/home/HomeHero.vue';
import Section from '../components/home/Section.vue';
import GameMiniCard from '../components/home/GameMiniCard.vue';

// Tymczasowe dane mock do prezentacji UI.
// Podmienimy na API w kolejnym etapie.
const popular = Array.from({length: 6}, (_, i) => ({
  id: i + 1,
  title: `Popularna gra #${i + 1}`,
  ratingAvg: 4.2 - (i * 0.1)
}));

const recent = Array.from({length: 6}, (_, i) => ({
  id: 100 + i + 1,
  title: `Nowa gra #${i + 1}`,
  ratingAvg: 4.0 + (i * 0.1)
}));
</script>

<template>
  <div style="display:grid;gap:24px">
    <HomeHero/>

    <Section title="Ranking popularnosci">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px">
        <GameMiniCard v-for="g in popular" :key="g.id" :game="g"/>
      </div>
    </Section>

    <Section title="Ostatnio dodane">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px">
        <GameMiniCard v-for="g in recent" :key="g.id" :game="g"/>
      </div>
    </Section>
  </div>
</template>