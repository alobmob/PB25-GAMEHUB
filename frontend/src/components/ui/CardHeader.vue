<script setup></script>

<template>
  <div
      data-slot="card-header"
      class="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6"
  >
    <slot></slot>
  </div>
</template>