<script setup>
defineProps({
  title: { type: String, required: true },
  points: { type: Array, required: true },
})
</script>

<template>
  <aside class="seo">
    <h3>{{ title }}</h3>
    <ul>
      <li v-for="point in points" :key="point">{{ point }}</li>
    </ul>
  </aside>
</template>
