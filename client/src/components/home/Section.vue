<script setup>
defineProps({title: {type: String, required: true}});
</script>

<template>
  <section style="display:grid;gap:12px">
    <h2 style="margin:0;font-size:18px">{{ title }}</h2>
    <div>
      <slot/>
    </div>
  </section>
</template>