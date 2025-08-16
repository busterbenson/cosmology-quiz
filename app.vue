<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Global app setup
useHead({
  titleTemplate: '%s - Cosmology Quiz',
  meta: [
    { name: 'description', content: 'Discover your philosophical worldview through intelligent questioning about reality, consciousness, and existence.' }
  ]
})
</script>